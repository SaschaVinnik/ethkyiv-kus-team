import { Module } from '@nestjs/common';
import { UpdateDisputeController } from './controllers/update-dispute.controller';
import { GetDisputesController } from './controllers/get-disputes.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { DisputeModel } from './models/dispute.model';
import { DisputeListener } from './listener/dispute.listener';
import { GetDisputeByIdController } from './controllers/get-dispute-by-id.controller';

@Module({
  imports: [TypeOrmModule.forFeature([DisputeModel])],
  controllers: [
    GetDisputesController,
    UpdateDisputeController,
    GetDisputeByIdController,
  ],
  providers: [DisputeListener],
})
export class DisputesModule {}
