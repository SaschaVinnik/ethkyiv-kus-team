import { ethers } from "hardhat";

async function main() {
  const Dispute = await ethers.getContractFactory("DisputeResolutionV2");
  const dispute = await Dispute.deploy("0x1c7D4B196Cb0C7B01d743Fbc6116a902379C7238");
  await dispute.waitForDeployment();

  console.log("Contract deployed at:", await dispute.getAddress());
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
