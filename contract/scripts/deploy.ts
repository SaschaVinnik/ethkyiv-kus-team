import { ethers } from "hardhat";

async function main() {
  const Dispute = await ethers.getContractFactory("DisputeResolutionV2");
  const dispute = await Dispute.deploy();
  await dispute.waitForDeployment();

  console.log("Contract deployed at:", await dispute.getAddress());
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});