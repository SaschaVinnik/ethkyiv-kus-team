import { Module } from '@nestjs/common';
import { UpdateDisputeController } from './controllers/update-dispute.controller';
import { CreateDisputeController } from './controllers/create-dispute.controller';
import { GetDisputesController } from './controllers/get-disputes.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { DisputeModel } from './models/dispute.model';

@Module({
  imports: [TypeOrmModule.forFeature([DisputeModel])],
  controllers: [
    GetDisputesController,
    CreateDisputeController,
    UpdateDisputeController,
  ],
  providers: [],
})
export class DisputesModule {}
