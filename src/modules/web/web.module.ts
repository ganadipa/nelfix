import { Module } from '@nestjs/common';
import { WebController } from './web.controller';
import { JwtService } from '@nestjs/jwt';
import { AuthModule } from '../auth/auth.module';
import { JwtAuthStrategy } from '../auth/strategy/jwt.strategy';
import { FilmModule } from '../film/film.module';
import { WebService } from './web.service';

@Module({
  imports: [AuthModule, FilmModule],
  controllers: [WebController],
  providers: [JwtAuthStrategy, JwtService, WebService],
})
export class WebModule {}
