// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;
import "@openzeppelin/contracts/token/ERC20/IERC20.sol";

contract DisputeResolutionV2 {
    enum DisputeStatus {
        PendingFunding,
        AwaitingMediatorApproval,
        Ready,
        Resolved,
        Cancelled
    }

    struct AdditionalDeposit {
        uint256 requestedAmount;
        mapping(address => bool) hasPaid;
        uint256 paidSoFar;
    }

    struct Dispute {
        address[2] parties;
        mapping(address => bool) hasPaid;
        mapping(address => bool) mediatorConfirmed;
        mapping(uint256 => AdditionalDeposit) additionalDeposits;
        uint256 totalLockedAmount;
        address mediator;
        string problemIPFS;
        string resolutionIPFS;
        DisputeStatus status;
    }

    

    IERC20 public usdcToken;
    uint256 public disputeCount;
    mapping(uint256 => Dispute) private disputes;
    mapping(uint256 => address[]) public disputePartiesView;

    event DisputeCreated(
        uint256 indexed id,
        address party1,
        address party2,
        string ipfsHash
    );
    event DepositMade(uint256 indexed id, address indexed from, uint256 amount);
    event MediatorConfirmed(uint256 indexed id, address indexed party);
    event MediatorSet(uint256 indexed id, address mediator);
    event DisputeResolved(uint256 indexed id, string resolutionIPFS);
    event DisputeCancelled(uint256 indexed id);
    event DisputeUpdated(uint256 indexed id);

    modifier onlyParty(uint256 id) {
        require(
            msg.sender == disputes[id].parties[0] ||
                msg.sender == disputes[id].parties[1],
            "Not a party"
        );
        _;
    }

    modifier onlyMediator(uint256 id) {
        require(
            msg.sender == disputes[id].mediator,
            "Only mediator can call this"
        );
        _;
    }

    constructor(address _usdcToken) {
        usdcToken = IERC20(_usdcToken);
    }

    function createDispute(
        address _otherParty,
        string calldata _problemIPFS
    ) external returns (uint256) {
        require(msg.sender != _otherParty, "Cannot dispute with yourself");
        uint256 id = disputeCount++;
        Dispute storage d = disputes[id];
        d.parties[0] = msg.sender;
        d.parties[1] = _otherParty;
        d.problemIPFS = _problemIPFS;
        d.status = DisputeStatus.PendingFunding;

        disputePartiesView[id] = [msg.sender, _otherParty];

        emit DisputeCreated(id, msg.sender, _otherParty, _problemIPFS);
        emit DisputeUpdated(id);
        return id;
    }

    function deposit(uint256 id, uint256 amount) external onlyParty(id) {
        Dispute storage d = disputes[id];
        require(d.status == DisputeStatus.PendingFunding, "Funding closed");
        require(!d.hasPaid[msg.sender], "Already paid");
        require(amount > 0, "Must deposit non-zero amount");

        // Transfer USDC from user to contract
        require(
            usdcToken.transferFrom(msg.sender, address(this), amount),
            "Transfer failed"
        );

        d.hasPaid[msg.sender] = true;
        d.totalLockedAmount += amount;

        emit DepositMade(id, msg.sender, amount);
        emit DisputeUpdated(id);

        if (d.hasPaid[d.parties[0]] && d.hasPaid[d.parties[1]]) {
            d.status = DisputeStatus.AwaitingMediatorApproval;
        }
    }

    function confirmMediator(
        uint256 id,
        address _mediator
    ) external onlyParty(id) {
        Dispute storage d = disputes[id];
        require(
            d.status == DisputeStatus.AwaitingMediatorApproval,
            "Not awaiting mediator"
        );
        require(
            d.mediator == address(0) || d.mediator == _mediator,
            "Mediator mismatch"
        );
        require(
            _mediator != d.parties[0] && _mediator != d.parties[1],
            "Mediator cannot be a party member"
        );

        d.mediator = _mediator;
        d.mediatorConfirmed[msg.sender] = true;

        emit MediatorConfirmed(id, msg.sender);
        emit DisputeUpdated(id);

        if (
            d.mediatorConfirmed[d.parties[0]] &&
            d.mediatorConfirmed[d.parties[1]]
        ) {
            d.status = DisputeStatus.Ready;
            emit MediatorSet(id, _mediator);
            emit DisputeUpdated(id);
        }
    }

    function resolveDispute(
        uint256 id,
        string calldata _resolutionIPFS
    ) external onlyMediator(id) {
        Dispute storage d = disputes[id];
        require(d.status == DisputeStatus.Ready, "Dispute not ready");
        require(d.status != DisputeStatus.Resolved, "Already resolved");

        d.resolutionIPFS = _resolutionIPFS;
        d.status = DisputeStatus.Resolved;

        require(
            usdcToken.transfer(d.mediator, d.totalLockedAmount),
            "USDC payout failed"
        );

        emit DisputeResolved(id, _resolutionIPFS);
        emit DisputeUpdated(id);
    }

    function cancelDispute(uint256 id) external onlyParty(id) {
        Dispute storage d = disputes[id];
        require(
            d.status == DisputeStatus.PendingFunding ||
                d.status == DisputeStatus.AwaitingMediatorApproval,
            "Cannot cancel now"
        );

        address other = (msg.sender == d.parties[0])
            ? d.parties[1]
            : d.parties[0];
        require(!d.hasPaid[other], "Other party already paid");

        if (d.hasPaid[msg.sender]) {
            d.hasPaid[msg.sender] = false;
            uint256 refundAmount = d.totalLockedAmount;
            d.totalLockedAmount = 0;
            require(
                usdcToken.transfer(msg.sender, refundAmount),
                "USDC refund failed"
            );
        }

        d.status = DisputeStatus.Cancelled;
        emit DisputeCancelled(id);
        emit DisputeUpdated(id);
    }

    function getDispute(
        uint256 id
    )
        external
        view
        returns (
            address[2] memory parties,
            address mediator,
            string memory problemIPFS,
            string memory resolutionIPFS,
            uint256 totalLockedAmount,
            DisputeStatus status,
            bool paid1,
            bool paid2,
            bool confirmed1,
            bool confirmed2
        )
    {
        Dispute storage d = disputes[id];
        return (
            d.parties,
            d.mediator,
            d.problemIPFS,
            d.resolutionIPFS,
            d.totalLockedAmount,
            d.status,
            d.hasPaid[d.parties[0]],
            d.hasPaid[d.parties[1]],
            d.mediatorConfirmed[d.parties[0]],
            d.mediatorConfirmed[d.parties[1]]
        );
    }

    function requestAdditionalDeposit(uint256 id, uint256 amount) external onlyParty(id) {
    require(amount > 0, "Amount must be positive");
    Dispute storage d = disputes[id];
    require(d.status != DisputeStatus.Resolved && d.status != DisputeStatus.Cancelled, "Cannot add funds");

    AdditionalDeposit storage ad = disputes[id].additionalDeposits[0];

    require(ad.requestedAmount == 0 || ad.paidSoFar == ad.requestedAmount, "Previous deposit not completed");

    ad.requestedAmount = amount;
    ad.hasPaid[d.parties[0]] = false;
    ad.hasPaid[d.parties[1]] = false;
    ad.paidSoFar = 0;
    }

function contributeAdditionalDeposit(uint256 id) external onlyParty(id) {
    Dispute storage d = disputes[id];
    require(d.status != DisputeStatus.Resolved && d.status != DisputeStatus.Cancelled, "Cannot deposit");
    
    AdditionalDeposit storage ad = disputes[id].additionalDeposits[0];

    require(ad.requestedAmount > 0, "No active request");
    require(!ad.hasPaid[msg.sender], "Already paid");

    uint256 half = ad.requestedAmount / 2;
    require(usdcToken.transferFrom(msg.sender, address(this), half), "USDC transfer failed");

    ad.hasPaid[msg.sender] = true;
    ad.paidSoFar += half;
    d.totalLockedAmount += half;

    emit DepositMade(id, msg.sender, half);
    emit DisputeUpdated(id);

    // Якщо обидві сторони сплатили — скидаємо додатковий запит
    if (ad.hasPaid[d.parties[0]] && ad.hasPaid[d.parties[1]]) {
        ad.requestedAmount = 0;
        ad.paidSoFar = 0;
        ad.hasPaid[d.parties[0]] = false;
        ad.hasPaid[d.parties[1]] = false;
    }
    }


}
