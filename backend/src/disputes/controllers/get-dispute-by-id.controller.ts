import { Controller, Param } from '@nestjs/common';
import { Get } from '@nestjs/common';
import { Or, Repository } from 'typeorm';
import { DisputeModel } from '../models/dispute.model';
import { InjectRepository } from '@nestjs/typeorm';

@Controller('disputes')
export class GetDisputeByIdController {
  constructor(
    @InjectRepository(DisputeModel)
    private readonly disputeRepository: Repository<DisputeModel>,
  ) {}

  @Get(':id')
  getDisputeById(@Param('id') id: string) {
    return this.disputeRepository.findOne({
      where: {
        id,
      },
    });
  }
}
