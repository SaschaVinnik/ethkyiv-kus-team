// SPDX-License-Identifier: MIT
pragma solidity ^0.8.19;

contract DisputeResolutionV2 {
    enum DisputeStatus { PendingFunding, AwaitingMediatorApproval, Ready, Resolved, Cancelled }

    struct Dispute {
        address[2] parties;
        mapping(address => bool) hasPaid;
        mapping(address => bool) mediatorConfirmed;
        uint256 totalLockedAmount;
        address payable mediator;
        string problemIPFS;
        string resolutionIPFS;
        DisputeStatus status;
    }

    uint256 public disputeCount;
    mapping(uint256 => Dispute) private disputes;
    mapping(uint256 => address[]) public disputePartiesView; 

    event DisputeCreated(uint256 indexed id, address party1, address party2, string ipfsHash);
    event DepositMade(uint256 indexed id, address indexed from, uint256 amount);
    event MediatorConfirmed(uint256 indexed id, address indexed party);
    event MediatorSet(uint256 indexed id, address mediator);
    event DisputeResolved(uint256 indexed id, string resolutionIPFS);
    event DisputeCancelled(uint256 indexed id);

    modifier onlyParty(uint256 id) {
        require(
            msg.sender == disputes[id].parties[0] || msg.sender == disputes[id].parties[1],
            "Not a party"
        );
        _;
    }

    function createDispute(address _otherParty, string calldata _problemIPFS) external returns (uint256) {
        require(msg.sender != _otherParty, "Cannot dispute with yourself");

        uint256 id = disputeCount++;
        Dispute storage d = disputes[id];
        d.parties[0] = msg.sender;
        d.parties[1] = _otherParty;
        d.problemIPFS = _problemIPFS;
        d.status = DisputeStatus.PendingFunding;

        disputePartiesView[id] = [msg.sender, _otherParty];

        emit DisputeCreated(id, msg.sender, _otherParty, _problemIPFS);
        return id;
    }

    function deposit(uint256 id) external payable onlyParty(id) {
        Dispute storage d = disputes[id];
        require(d.status == DisputeStatus.PendingFunding, "Funding closed");
        require(!d.hasPaid[msg.sender], "Already paid");
        require(msg.value > 0, "Must send funds");

        d.hasPaid[msg.sender] = true;
        d.totalLockedAmount += msg.value;

        emit DepositMade(id, msg.sender, msg.value);

        if (d.hasPaid[d.parties[0]] && d.hasPaid[d.parties[1]]) {
            d.status = DisputeStatus.AwaitingMediatorApproval;
        }
    }

    function confirmMediator(uint256 id, address payable _mediator) external onlyParty(id) {
        Dispute storage d = disputes[id];
        require(d.status == DisputeStatus.AwaitingMediatorApproval, "Not awaiting mediator");
        require(d.mediator == address(0) || d.mediator == _mediator, "Mediator mismatch");

        d.mediator = _mediator;
        d.mediatorConfirmed[msg.sender] = true;

        emit MediatorConfirmed(id, msg.sender);

        if (d.mediatorConfirmed[d.parties[0]] && d.mediatorConfirmed[d.parties[1]]) {
            d.status = DisputeStatus.Ready;
            emit MediatorSet(id, _mediator);
        }
    }

    function resolveDispute(uint256 id, string calldata _resolutionIPFS) external onlyParty(id) {
        Dispute storage d = disputes[id];
        require(d.status == DisputeStatus.Ready, "Dispute not ready");
        require(d.mediator != address(0), "Mediator not assigned");

        d.resolutionIPFS = _resolutionIPFS;
        d.status = DisputeStatus.Resolved;

        (bool sent, ) = d.mediator.call{value: d.totalLockedAmount}("");
        require(sent, "Payment to mediator failed");

        emit DisputeResolved(id, _resolutionIPFS);
    }

    function cancelDispute(uint256 id) external onlyParty(id) {
        Dispute storage d = disputes[id];
        require(
            d.status == DisputeStatus.PendingFunding || d.status == DisputeStatus.AwaitingMediatorApproval,
            "Cannot cancel now"
        );

        // Якщо інша сторона не внесла оплату
        address other = (msg.sender == d.parties[0]) ? d.parties[1] : d.parties[0];
        require(!d.hasPaid[other], "Other party already paid");

        uint256 refund = 0;
        if (d.hasPaid[msg.sender]) {
            refund = address(this).balance >= d.totalLockedAmount ? d.totalLockedAmount : address(this).balance;
            d.totalLockedAmount = 0;
            d.hasPaid[msg.sender] = false;
            payable(msg.sender).transfer(refund);
        }

        d.status = DisputeStatus.Cancelled;
        emit DisputeCancelled(id);
    }

    function getDispute(uint256 id) external view returns (
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
    ) {
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

    receive() external payable {}
}
