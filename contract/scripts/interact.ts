import { ethers } from "hardhat";
import * as dotenv from "dotenv";

dotenv.config();

const CONTRACT_ADDRESS = process.env.CONTRACT_ADDRESS!;
const USDC_ADDRESS = "0x1c7D4B196Cb0C7B01d743Fbc6116a902379C7238";
const USDC_DECIMALS = 6;
const DEPOSIT_AMOUNT = 1_000_000; // 1 USDC with 6 decimals

async function main() {
  const provider = new ethers.JsonRpcProvider(
    `https://sepolia.infura.io/v3/${process.env.INFURA_API_KEY}`
  );

  const party1 = new ethers.Wallet(process.env.PARTY1_PRIVATE_KEY!, provider);
  const party2 = new ethers.Wallet(process.env.PARTY2_PRIVATE_KEY!, provider);
  const mediator = new ethers.Wallet(
    process.env.MEDIATOR_PRIVATE_KEY!,
    provider
  );

  const contract = await ethers.getContractAt(
    "DisputeResolutionV2",
    CONTRACT_ADDRESS,
    party1
  );
  const usdc = await ethers.getContractAt("IERC20", USDC_ADDRESS, party1);

  // 1. Create dispute
  const tx = await contract
    .connect(party1)
    .createDispute(party2.address, "ipfs://QmSepoliaTest1");
  const receipt = await tx.wait();
  const iface = new ethers.Interface([
    "event DisputeCreated(uint256 indexed id, address party1, address party2, string ipfsHash)",
  ]);
  const log = receipt?.logs?.find(
    (log) => log.address.toLowerCase() === String(contract.target).toLowerCase()
  );
  const parsedLog = iface.parseLog(log!);
  const disputeId = parsedLog!.args[0];
  console.log("🆕 Created dispute ID:", disputeId.toString());
    // 2. Approve and Deposit
  await (
    await usdc.connect(party1).approve(CONTRACT_ADDRESS, DEPOSIT_AMOUNT)
  ).wait();
  await (
    await usdc.connect(party2).approve(CONTRACT_ADDRESS, DEPOSIT_AMOUNT)
  ).wait();

  await (
    await contract.connect(party1).deposit(disputeId, DEPOSIT_AMOUNT)
  ).wait();
  await (
    await contract.connect(party2).deposit(disputeId, DEPOSIT_AMOUNT)
  ).wait();

  const disputeBefore = await contract.getDispute(disputeId);
  console.log("🔒 Dispute state before mediator:", disputeBefore[5]);

  // 3. Confirm mediator
  await (
    await contract.connect(party1).confirmMediator(disputeId, mediator.address)
  ).wait();
  await (
    await contract.connect(party2).confirmMediator(disputeId, mediator.address)
  ).wait();

  const disputeReady = await contract.getDispute(disputeId);
  console.log("🧑‍⚖️ Mediator confirmed. Status:", disputeReady[5]); // Ready = 2

  // Optional: check balance of mediator before
  const balanceBefore = await usdc.balanceOf(mediator.address);
  console.log("💰 Mediator USDC before:", balanceBefore.toString());

  // 4. Resolve dispute — by mediator
  await (
    await contract
      .connect(mediator)
      .resolveDispute(disputeId, "ipfs://QmSepoliaResolution")
  ).wait();
  console.log("✅ Dispute resolved!");

  // Optional: check balance after
  const balanceAfter = await usdc.balanceOf(mediator.address);
  console.log("💰 Mediator USDC after:", balanceAfter.toString());
}

main().catch((error) => {
  console.error("❌", error);
  process.exit(1);
});
