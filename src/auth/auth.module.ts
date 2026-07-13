import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { UserModule } from 'src/user/user.module';
import { AccessTokenGuard } from '../security/guards/access-token.guard';
import { SecurityModule } from 'src/security/security.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { RefreshSession } from './entities/refresh-session.entity';
import { RefreshSessionRepository } from './refresh.repository';

@Module({
  imports: [UserModule, SecurityModule, TypeOrmModule.forFeature([RefreshSession])],
  controllers: [AuthController],
  providers: [AuthService, RefreshSessionRepository],
})
export class AuthModule {}
