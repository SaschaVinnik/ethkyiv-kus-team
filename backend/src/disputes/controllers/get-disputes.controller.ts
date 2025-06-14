import { Controller, Param } from '@nestjs/common';
import { Get } from '@nestjs/common';
import { Or, Repository } from 'typeorm';
import { DisputeModel } from '../models/dispute.model';
import { InjectRepository } from '@nestjs/typeorm';

@Controller('disputes')
export class GetDisputesController {
  constructor(
    @InjectRepository(DisputeModel)
    private readonly disputeRepository: Repository<DisputeModel>,
  ) {}
  @Get()
  getDisputes(@Param('address') address: string) {
    return this.disputeRepository.find({
      where: [
        {
          address1: address,
        },
        {
          address2: address,
        },
        {
          mediatorAddress: address,
        },
      ],
    });
  }
}
