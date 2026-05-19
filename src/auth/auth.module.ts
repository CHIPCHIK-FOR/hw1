import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserRepository } from 'src/user/user.repository';
import { JwtModule } from '@nestjs/jwt';
import { User } from 'src/user/user.entity';
import { UserModule } from 'src/user/user.module';
import { Repository } from 'typeorm';
import {config} from 'dotenv'
import { RefreshToken } from 'src/jwt/refresh-token.entity';
import { RefreshTokenRepository } from './refresh.repository';

config();

@Module({
  imports: [
    TypeOrmModule.forFeature([User, RefreshToken]),
    JwtModule.register({
      global:true,
      secret: process.env.JWT_SECRET,
      signOptions: { expiresIn: '15m' },
    }),
    UserModule
  ],
  providers: [AuthService, UserRepository, RefreshTokenRepository],
  controllers: [AuthController],
  exports: [AuthService]
})
export class AuthModule {}
