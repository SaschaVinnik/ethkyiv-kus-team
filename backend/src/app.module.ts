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
      host: process.env.DB_HOST,
      port: Number(process.env.DB_PORT),
      username: process.env.DB_USER,
      password: process.env.DB_PASSWORD,
      database: process.env.DB_NAME,
      entities: [UserModel, DisputeModel],
      synchronize: true,
    }),
    UsersModule,
    DisputesModule,
  ],
  providers: [],
})
export class AppModule {}
