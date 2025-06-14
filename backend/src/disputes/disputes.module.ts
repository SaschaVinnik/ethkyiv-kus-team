import { Module } from '@nestjs/common';
import { UpdateDisputeController } from './controllers/update-dispute.controller';
import { GetDisputesController } from './controllers/get-disputes.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { DisputeModel } from './models/dispute.model';
import { DisputeListener } from './listener/dispute.listener';

@Module({
  imports: [TypeOrmModule.forFeature([DisputeModel])],  
  controllers: [
    GetDisputesController,
    UpdateDisputeController,    
  ],
  providers: [DisputeListener],
})
export class DisputesModule {}
