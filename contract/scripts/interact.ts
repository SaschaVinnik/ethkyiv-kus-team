import { ethers } from "hardhat";

const CONTRACT_ADDRESS = "0xa946b8EFFD3a4ED17205EcDAAF989A5423f7f3aE";

async function main() {
  const [party1, party2, mediator] = await ethers.getSigners();
  const dispute = await ethers.getContractAt("DisputeResolutionV2", CONTRACT_ADDRESS);

 
  console.log(`📝 Creating dispute between ${party1.address} and ${party2.address}`);
  const tx = await dispute.createDispute(party2.address, "ipfs://QmTestHash1");
  const receipt = await tx.wait();
  const disputeId = (await dispute.queryFilter(dispute.filters.DisputeCreated(), receipt!.blockNumber))[0].args[0];
  console.log("🆔 Dispute ID:", disputeId.toString());


  let disputeData = await dispute.getDispute(disputeId);
  console.log("Initial status:", getStatusName(disputeData.status));


  console.log("\n🔴 Testing cancelDispute BEFORE deposits...");
  await dispute.connect(party1).cancelDispute(disputeId);
  console.log("✅ Cancel successful in PendingFunding status");
  disputeData = await dispute.getDispute(disputeId);
  console.log("New status:", getStatusName(disputeData.status));


  console.log("\n🔄 Creating new dispute for full flow test...");
  const txNew = await dispute.createDispute(party2.address, "ipfs://QmTestHash2");
  const receiptNew = await txNew.wait();
  const newDisputeId = (await dispute.queryFilter(dispute.filters.DisputeCreated(), receiptNew!.blockNumber))[0].args[0];
  console.log("🆔 New Dispute ID:", newDisputeId.toString());


  console.log("\n💰 Party1 depositing...");
  await dispute.connect(party1).deposit(newDisputeId, { value: ethers.parseEther("0.001") });
  
  console.log("💰 Party2 depositing...");
  await dispute.connect(party2).deposit(newDisputeId, { value: ethers.parseEther("0.0") });

  disputeData = await dispute.getDispute(newDisputeId);
  console.log("Status after deposits:", getStatusName(disputeData.status));
  if (disputeData.status !== 1n) throw new Error("Status should be AwaitingMediatorApproval (1)");


  console.log("\n✅ Party1 confirming mediator...");
  await dispute.connect(party1).confirmMediator(newDisputeId, mediator.address);
  
  console.log("✅ Party2 confirming mediator...");
  await dispute.connect(party2).confirmMediator(newDisputeId, mediator.address);


  disputeData = await dispute.getDispute(newDisputeId);
  console.log("Status after mediator confirmation:", getStatusName(disputeData.status));
  if (disputeData.status !== 2n) throw new Error("Status should be Ready (2)");


  console.log("\n🟢 Resolving dispute...");
  await dispute.connect(party1).resolveDispute(newDisputeId, "ipfs://QmResolutionHash");
  console.log("✅ Dispute resolved successfully!");


  disputeData = await dispute.getDispute(newDisputeId);
  console.log("\n📊 Final status:", getStatusName(disputeData.status));
  console.log("📌 Resolution IPFS:", disputeData.resolutionIPFS);
  console.log("💸 Mediator payment:", ethers.formatEther(disputeData.totalLockedAmount), "ETH");
}


function getStatusName(status: bigint): string {
  const statusMap: Record<number, string> = {
    0: "PendingFunding",
    1: "AwaitingMediatorApproval",
    2: "Ready",
    3: "Resolved",
    4: "Cancelled"
  };
  return statusMap[Number(status)] || `Unknown (${status})`;
}

main().catch((error) => {
  console.error("❌ Fatal error:", error.reason || error.message);
  process.exitCode = 1;
});