import { Module } from '@nestjs/common';
import { UserModel } from './models/user.model';
import { TypeOrmModule } from '@nestjs/typeorm';
import { GetMediatorsController } from './controllers/get-mediators.controller';
import { RegisterUserController } from './controllers/register-user.controller';

@Module({
  imports: [TypeOrmModule.forFeature([UserModel])],
  controllers: [GetMediatorsController, RegisterUserController],
  providers: [],
})
export class UsersModule {}
