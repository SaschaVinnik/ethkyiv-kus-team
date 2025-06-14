import { ethers } from "hardhat"; 
import * as dotenv from "dotenv";

dotenv.config();

const CONTRACT_ADDRESS = process.env.CONTRACT_ADDRESS!;
const USDC_ADDRESS = "0x1c7D4B196Cb0C7B01d743Fbc6116a902379C7238";
const USDC_DECIMALS = 6;
const DEPOSIT_AMOUNT = 1_000_000; // 1 USDC
const ADDITIONAL_AMOUNT = 2_000_000; // 2 USDC

async function main() {
  const provider = new ethers.JsonRpcProvider(
    `https://sepolia.infura.io/v3/${process.env.INFURA_API_KEY}`
  );

  const party1 = new ethers.Wallet(process.env.PARTY1_PRIVATE_KEY!, provider);
  const party2 = new ethers.Wallet(process.env.PARTY2_PRIVATE_KEY!, provider);
  const mediator = new ethers.Wallet(process.env.MEDIATOR_PRIVATE_KEY!, provider);

  const contract = await ethers.getContractAt("DisputeResolutionV2", CONTRACT_ADDRESS);
  const usdc = await ethers.getContractAt("IERC20", USDC_ADDRESS);

  // 1. Create dispute
  const tx = await contract.connect(party1).createDispute(party2.address, "ipfs://QmSepoliaTest1");
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
  await (await usdc.connect(party1).approve(CONTRACT_ADDRESS, DEPOSIT_AMOUNT)).wait();
  await (await usdc.connect(party2).approve(CONTRACT_ADDRESS, DEPOSIT_AMOUNT)).wait();

  await (await contract.connect(party1).deposit(disputeId, DEPOSIT_AMOUNT)).wait();
  await (await contract.connect(party2).deposit(disputeId, DEPOSIT_AMOUNT)).wait();
  console.log("✅ Both parties deposited initial amount");

  // 3. Request additional deposit (party1)
  await (await contract.connect(party1).requestAdditionalDeposit(disputeId, ADDITIONAL_AMOUNT)).wait();
  console.log("✅ Additional deposit requested");

  // 4. Approve additional funds
  const HALF_ADDITIONAL = ADDITIONAL_AMOUNT / 2;
  await (await usdc.connect(party1).approve(CONTRACT_ADDRESS, HALF_ADDITIONAL)).wait();
  await (await usdc.connect(party2).approve(CONTRACT_ADDRESS, HALF_ADDITIONAL)).wait();

  // 5. Contribute from both parties
  await (await contract.connect(party1).contributeAdditionalDeposit(disputeId)).wait();
  await (await contract.connect(party2).contributeAdditionalDeposit(disputeId)).wait();
  console.log("✅ Additional deposit completed by both parties");
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
