import { Body, Controller } from '@nestjs/common';
import { Post } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { DisputeModel } from '../models/dispute.model';
import { Repository } from 'typeorm';
import { CreateDisputeBody } from '../requests/create-dispute.body';

@Controller('disputes')
export class CreateDisputeController {
  constructor(
    @InjectRepository(DisputeModel)
    private readonly disputeRepository: Repository<DisputeModel>,
  ) {}
  @Post()
  createDispute(@Body() createDisputeBody: CreateDisputeBody) {
    return '';
  }
}
