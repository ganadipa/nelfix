import { Module } from '@nestjs/common';
import { WebController } from './web.controller';
import { JwtService } from '@nestjs/jwt';
import { AuthModule } from '../auth/auth.module';
import { JwtAuthStrategy } from '../auth/strategy/jwt.strategy';

@Module({
  imports: [AuthModule],
  controllers: [WebController],
  providers: [JwtAuthStrategy, JwtService],
})
export class WebModule {}
