import { Body, Controller, Post } from '@nestjs/common';
import { Repository } from 'typeorm';
import { RegisterUserBody } from '../requests/register-user.body';
import { UserModel } from '../models/user.model';
import { InjectRepository } from '@nestjs/typeorm';

@Controller('users')
export class RegisterUserController {
  constructor(
    @InjectRepository(UserModel)
    private readonly userRepository: Repository<UserModel>,
  ) {}
  @Post()
  registerUser(@Body() body: RegisterUserBody) {
    return this.userRepository.save({
      address: body.address,
      name: body.name,
      isMediator: body.isMediator,
      createdAt: Date.now(),
      bio: body.bio,
      email: body.email,
      photoUri: body.photoUri,
      portfolioUri: body.portfolioUri,
    });
  }
}
