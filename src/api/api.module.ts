import { Module } from '@nestjs/common';
import { ApiController } from './api.controller';
import { AuthService } from 'src/auth/auth.service';
import { JwtService } from '@nestjs/jwt';
import { AuthModule } from 'src/auth/auth.module';

@Module({
  imports: [AuthModule],
  controllers: [ApiController],
  providers: [AuthService, JwtService],
})
export class ApiModule {}
