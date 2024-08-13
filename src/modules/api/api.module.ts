import { Module } from '@nestjs/common';
import { ApiController } from './api.controller';
import { JwtService } from '@nestjs/jwt';
import { AuthModule } from '../auth/auth.module';
import { AuthService } from '../auth/auth.service';

@Module({
  imports: [AuthModule],
  controllers: [ApiController],
  providers: [AuthService, JwtService],
})
export class ApiModule {}
