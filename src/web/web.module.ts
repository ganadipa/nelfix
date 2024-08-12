import { Module } from '@nestjs/common';
import { WebController } from './web.controller';
import { JwtAuthStrategy } from 'src/auth/strategy/jwt.strategy';
import { JwtService } from '@nestjs/jwt';
import { AuthModule } from 'src/auth/auth.module';

@Module({
  imports: [AuthModule],
  controllers: [WebController],
  providers: [JwtAuthStrategy, JwtService],
})
export class WebModule {}
