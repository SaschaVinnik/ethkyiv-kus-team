import { Controller, Param } from '@nestjs/common';
import { Get } from '@nestjs/common';
import { Repository } from 'typeorm';
import { UserModel } from '../models/user.model';
import { InjectRepository } from '@nestjs/typeorm';

@Controller('users')
export class GetUserByWalletController {
  constructor(
    @InjectRepository(UserModel)
    private readonly userRepository: Repository<UserModel>,
  ) {}
  @Get(':address')
  getUserByWallet(@Param('address') address: string) {
    return this.userRepository.findOne({
      where: {
        address,
      },
    });
  }
}
