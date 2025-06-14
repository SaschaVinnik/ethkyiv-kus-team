import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UsersModule } from './users/users.module';
import { UserModel } from './users/models/user.model';
import { DisputeModel } from './disputes/models/dispute.model';
import { ConfigModule } from '@nestjs/config';
import { DisputesModule } from './disputes/disputes.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: '.env',
    }),
    TypeOrmModule.forRoot({
      type: 'postgres',
      url: process.env.DATABASE_URL,
      ssl: {
        rejectUnauthorized: false,
      },
      entities: [UserModel, DisputeModel],
      synchronize: true,
    }),
    UsersModule,
    DisputesModule,
  ],
  providers: [],
})
export class AppModule {}
