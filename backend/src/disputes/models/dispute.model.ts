// create model
export class DisputeModel {
  id: string;
  address1: string;
  address2: string;
  mediatorAddress: string;
  createdAt: number;
  updatedAt: number;

  constructor(
    id: string,
    address1: string,
    address2: string,
    mediatorAddress: string,
    createdAt: number,
    updatedAt: number,
  ) {
    this.id = id;
    this.address1 = address1;
    this.address2 = address2;
    this.mediatorAddress = mediatorAddress;
    this.createdAt = createdAt;
    this.updatedAt = updatedAt;
  }
}
