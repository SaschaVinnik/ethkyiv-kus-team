import { ethers } from 'ethers';
import disputeResolutionAbi from './contractABI.json'; // ABI вашого контракту

const CONTRACT_ADDRESS = "0xDebBF78Eb506bB6DfEBBFef18d0c8f3bfe9260EB";
const USDC_ADDRESS = "0x1c7D4B196Cb0C7B01d743Fbc6116a902379C7238";

export async function getContract() {
  const provider = new ethers.BrowserProvider(window.ethereum);
  const signer = await provider.getSigner();
  return new ethers.Contract(
    CONTRACT_ADDRESS,
    disputeResolutionAbi.abi,
    signer
  );
}

export async function getUsdcContract() {
  const provider = new ethers.BrowserProvider(window.ethereum);
  const signer = await provider.getSigner();
  return new ethers.Contract(
    USDC_ADDRESS,
    ['function approve(address spender, uint256 amount)'],
    signer
  );
}

export async function createDispute(otherParty: string, ipfsHash: string) {
  try {
    const contract = await getContract();
    const tx = await contract.createDispute(otherParty, ipfsHash);
    
    // Очікуємо підтвердження в MetaMask
    const receipt = await tx.wait();
    
    // Парсимо подію для отримання ID спору
    const disputeId = receipt.logs[0].args[0];
    return disputeId.toString();
  } catch (error) {
    console.error('Помилка при створенні спору:', error);
    throw error;
  }
}

export async function depositFunds(disputeId: number, amount: number) {
  try {
    const usdc = await getUsdcContract();
    const contract = await getContract();
    
    // Спочатку approve
    const approveTx = await usdc.approve(
      CONTRACT_ADDRESS,
      ethers.parseUnits(amount.toString(), 6) // 6 decimals для USDC
    );
    await approveTx.wait();
    
    // Потім депозит
    const depositTx = await contract.deposit(disputeId, amount);
    await depositTx.wait();
    
    return true;
  } catch (error) {
    console.error('Помилка при депозиті:', error);
    throw error;
  }
}

export async function confirmMediator(disputeId: number, mediatorAddress: string) {
  try {
    const contract = await getContract();
    const tx = await contract.confirmMediator(disputeId, mediatorAddress);
    await tx.wait();
    return true;
  } catch (error) {
    console.error('Помилка при підтвердженні медіатора:', error);
    throw error;
  }
}


export async function resolveDispute(disputeId: number, resolutionIpfs: string) {
  try {
    const contract = await getContract();
    const tx = await contract.resolveDispute(disputeId, resolutionIpfs);
    await tx.wait();
    return true;
  } catch (error) {
    console.error('Помилка при вирішенні спору:', error);
    throw error;
  }
}
