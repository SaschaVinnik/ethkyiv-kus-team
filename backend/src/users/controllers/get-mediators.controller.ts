import { Controller, Get } from '@nestjs/common';
import { Repository } from 'typeorm';
import { UserModel } from '../models/user.model';
import { InjectRepository } from '@nestjs/typeorm';

@Controller('users')
export class GetMediatorsController {
  constructor(
    @InjectRepository(UserModel)
    private readonly userRepository: Repository<UserModel>,
  ) {}

  @Get('mediators')
  getMediators() {
    return this.userRepository.find({
      where: {
        isMediator: true,
      },
    });
  }
}
