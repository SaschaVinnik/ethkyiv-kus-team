export class CreateDisputeBody {
  id: string;
  address1: string;
  address2: string;
  mediatorAddress: string;
  problemIPFS: string;
  resolutionIPFS?: string;
  totalLockedAmount: string;
  status: number;
  paid1: boolean;
  paid2: boolean;
  confirmed1: boolean;
  confirmed2: boolean;
}