import { ethers } from "hardhat";
import * as dotenv from "dotenv";

const CONTRACT_ADDRESS = "0xa946b8EFFD3a4ED17205EcDAAF989A5423f7f3aE";

dotenv.config();

async function main() {
  const provider = new ethers.JsonRpcProvider(`https://sepolia.infura.io/v3/${process.env.INFURA_API_KEY}`);

  const party1 = new ethers.Wallet(process.env.PARTY1_PRIVATE_KEY!, provider);
  const party2 = new ethers.Wallet(process.env.PARTY2_PRIVATE_KEY!, provider);
  const mediator = new ethers.Wallet(process.env.MEDIATOR_PRIVATE_KEY!, provider);

  const contract = await ethers.getContractAt(
    "DisputeResolutionV2",
    CONTRACT_ADDRESS!,
    party1 // default signer
  );

  // 1. Creating a dispute
  const tx = await contract.connect(party1).createDispute(party2.address, "ipfs://QmSepoliaTest1");
  const receipt = await tx.wait();
  const iface = new ethers.Interface([
    "event DisputeCreated(uint256 indexed id, address party1, address party2, string ipfsHash)"
  ]);

  const log = receipt?.logs?.find(log => log.address.toLowerCase() === String(contract.target).toLowerCase());
  const parsedLog = iface.parseLog(log!);
  const disputeId = parsedLog!.args[0];

  console.log("Created dispute ID:", disputeId.toString());

  // 2. Deposit
  await (await contract.connect(party1).deposit(disputeId, { value: ethers.parseEther("0.001") })).wait();
  await (await contract.connect(party2).deposit(disputeId, { value: ethers.parseEther("0.001") })).wait();

  const dispute = await contract.getDispute(disputeId);
  console.log("🧾 Dispute state before confirm:", dispute);

  // 3. Confirmation of the mediator
  await (await contract.connect(party1).confirmMediator(disputeId, mediator.address)).wait();
  await (await contract.connect(party2).confirmMediator(disputeId, mediator.address)).wait();

  const updated = await contract.getDispute(disputeId);
  console.log("✅ Updated state:", updated[5]); // 2 (Ready)


  // 4. Confirmation of the mediatoravilization of the dispute
  await (await contract.connect(party1).resolveDispute(disputeId, "ipfs://QmSepoliaResolution")).wait();

  console.log("✅ Resolved on-chain!");
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
