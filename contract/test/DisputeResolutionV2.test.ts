import { ethers } from "hardhat";
import { expect } from "chai";

describe("DisputeResolutionV2", function () {
  let contract: any;
  let owner: any;
  let party1: any;
  let party2: any;
  let mediator: any;

  beforeEach(async () => {
    [owner, party1, party2, mediator] = await ethers.getSigners();
    const ContractFactory = await ethers.getContractFactory("DisputeResolutionV2");
    contract = await ContractFactory.deploy("0x1c7D4B196Cb0C7B01d743Fbc6116a902379C7238");
    await contract.waitForDeployment();
  });

  it("should create a dispute correctly", async () => {
    const tx = await contract.connect(party1).createDispute(party2.address, "ipfs://problem");
    const receipt = await tx.wait();

    const event = receipt.logs.find((l: any) => l.fragment.name === "DisputeCreated");
    const id = event.args.id;

    const data = await contract.getDispute(id);
    expect(data.parties[0]).to.equal(party1.address);
    expect(data.parties[1]).to.equal(party2.address);
    expect(data.problemIPFS).to.equal("ipfs://problem");
  });

  it("should deposit and transition to AwaitingMediatorApproval", async () => {
    const tx = await contract.connect(party1).createDispute(party2.address, "ipfs://problem");
    const receipt = await tx.wait();
    const id = receipt.logs[0].args[0];

    await contract.connect(party1).deposit(id, { value: ethers.parseEther("0.001") });
    await contract.connect(party2).deposit(id, { value: ethers.parseEther("0.001") });

    const data = await contract.getDispute(id);
    expect(data.status).to.equal(1); // AwaitingMediatorApproval
  });

  it("should allow mediator confirmation and move to Ready", async () => {
    const tx = await contract.connect(party1).createDispute(party2.address, "ipfs://problem");
    const receipt = await tx.wait();
    const id = receipt.logs[0].args[0];

    await contract.connect(party1).deposit(id, { value: ethers.parseEther("0.001") });
    await contract.connect(party2).deposit(id, { value: ethers.parseEther("0.001") });

    await contract.connect(party1).confirmMediator(id, mediator.address);
    await contract.connect(party2).confirmMediator(id, mediator.address);

    const data = await contract.getDispute(id);
    expect(data.status).to.equal(2); // Ready
    expect(data.mediator).to.equal(mediator.address);
  });

  it("should resolve the dispute and pay mediator", async () => {
    const tx = await contract.connect(party1).createDispute(party2.address, "ipfs://problem");
    const receipt = await tx.wait();
    const id = receipt.logs[0].args[0];

    await contract.connect(party1).deposit(id, { value: ethers.parseEther("0.001") });
    await contract.connect(party2).deposit(id, { value: ethers.parseEther("0.001") });

    await contract.connect(party1).confirmMediator(id, mediator.address);
    await contract.connect(party2).confirmMediator(id, mediator.address);

    const mediatorBalanceBefore = await ethers.provider.getBalance(mediator.address);
    await contract.connect(party1).resolveDispute(id, "ipfs://resolved");
    const mediatorBalanceAfter = await ethers.provider.getBalance(mediator.address);

    const data = await contract.getDispute(id);
    expect(data.status).to.equal(3); // Resolved
    expect(data.resolutionIPFS).to.equal("ipfs://resolved");
    expect(mediatorBalanceAfter).to.be.gt(mediatorBalanceBefore);
  });

  it("should allow cancel if only one party paid", async () => {
    const tx = await contract.connect(party1).createDispute(party2.address, "ipfs://problem");
    const receipt = await tx.wait();
    const id = receipt.logs[0].args[0];

    await contract.connect(party1).deposit(id, { value: ethers.parseEther("0.001") });

    await contract.connect(party1).cancelDispute(id);
    const data = await contract.getDispute(id);
    expect(data.status).to.equal(4); // Cancelled
  });
});
