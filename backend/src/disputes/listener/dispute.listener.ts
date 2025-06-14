import { Injectable, OnModuleInit, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { ethers } from 'ethers';
import { DisputeModel } from '../models/dispute.model';
import { Repository } from 'typeorm';

@Injectable()
export class DisputeListener implements OnModuleInit {
  constructor(
    @InjectRepository(DisputeModel)
    private readonly disputeRepository: Repository<DisputeModel>,
  ) { }
  private readonly logger = new Logger(DisputeListener.name);
  private provider: ethers.JsonRpcProvider;
  private contract: ethers.Contract;

  private readonly rpcUrl = `https://sepolia.infura.io/v3/${process.env.INFURA_API_KEY}`;
  private readonly contractAddress = process.env.CONTRACT_ADDRESS!;

  async onModuleInit() {
    try {
      await this.initContract();
      this.listenToEvents();
      this.logger.log('Listener started successfully');
    } catch (error) {
      this.logger.error('Initialization failed', error.stack);
      throw error;
    }
  }

  private async initContract() {
    this.provider = new ethers.JsonRpcProvider(this.rpcUrl);
    this.contract = new ethers.Contract(
      this.contractAddress,
      this.getContractAbi(),
      this.provider
    );

    // Verify contract connection
    const code = await this.provider.getCode(this.contractAddress);
    if (code === '0x') {
      throw new Error('Contract not found at the specified address');
    }
  }

  private getContractAbi() {
    return [
      "event DisputeUpdated(uint256 indexed id)",
      "event DisputeCreated(uint256 indexed id, address party1, address party2, string ipfsHash)",
      {
        "inputs": [{ "internalType": "uint256", "name": "id", "type": "uint256" }],
        "name": "getDispute",
        "outputs": [
          { "internalType": "address[2]", "name": "parties", "type": "address[2]" },
          { "internalType": "address", "name": "mediator", "type": "address" },
          { "internalType": "string", "name": "problemIPFS", "type": "string" },
          { "internalType": "string", "name": "resolutionIPFS", "type": "string" },
          { "internalType": "uint256", "name": "totalLockedAmount", "type": "uint256" },
          { "internalType": "uint8", "name": "status", "type": "uint8" },
          { "internalType": "bool", "name": "paid1", "type": "bool" },
          { "internalType": "bool", "name": "paid2", "type": "bool" },
          { "internalType": "bool", "name": "confirmed1", "type": "bool" },
          { "internalType": "bool", "name": "confirmed2", "type": "bool" }
        ],
        "stateMutability": "view",
        "type": "function"
      }
    ];
  }

  private listenToEvents() {

    this.contract.on('DisputeCreated', async (disputeId, party1, party2, ipfsHash) => {
      try {
        this.logger.log(`New DisputeCreated event for ID: ${disputeId}`);

        const dispute = await this.contract.getDispute(disputeId);
        console.log(dispute)
        await this.disputeRepository.save({
          id: disputeId.toString(),
          address1: dispute.parties[0],
          address2: dispute.parties[1],
          mediatorAddress: dispute.mediator,
          problemIPFS: dispute.problemIPFS,
          resolutionIPFS: dispute.resolutionIPFS || null,
          totalLockedAmount: dispute.totalLockedAmount.toString(),
          status: Number(dispute.status),
          paid1: dispute.paid1,
          paid2: dispute.paid2,
          confirmed1: dispute.confirmed1,
          confirmed2: dispute.confirmed2,
          updatedAt: Date.now(),
          createdAt: Date.now(),
        });

        this.logger.log(`Dispute ${disputeId} created and saved to DB`);
      } catch (error) {
        this.logger.error(`Error processing DisputeCreated ${disputeId}:`, error.message);
      }
    });

    this.contract.on('DisputeUpdated', async (disputeId) => {
      try {
        this.logger.log(`New DisputeUpdated event for ID: ${disputeId}`);

        const dispute = await this.contract.getDispute(disputeId);
        console.log(dispute)
        await this.disputeRepository.save({
          id: disputeId.toString(),
          address1: dispute.parties[0],
          address2: dispute.parties[1],
          mediatorAddress: dispute.mediator,
          problemIPFS: dispute.problemIPFS,
          resolutionIPFS: dispute.resolutionIPFS || null,
          totalLockedAmount: dispute.totalLockedAmount.toString(),
          status: Number(dispute.status),
          paid1: dispute.paid1,
          paid2: dispute.paid2,
          confirmed1: dispute.confirmed1,
          confirmed2: dispute.confirmed2,
          updatedAt: Date.now(),
        });

      } catch (error) {
        this.logger.error(`Error processing dispute ${disputeId}:`, error.message);
      }
    });
  }



  private getStatusName(status: number): string {
    const statusMap = [
      'PendingFunding',
      'AwaitingMediatorApproval',
      'Ready',
      'Resolved',
      'Cancelled'
    ];
    return statusMap[status] || `Unknown (${status})`;
  }

  async onApplicationShutdown() {
    if (this.contract) {
      this.contract.removeAllListeners();
    }
  }
}