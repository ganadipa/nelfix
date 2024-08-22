import { Module } from '@nestjs/common';
import { WebController } from './web.controller';
import { JwtService } from '@nestjs/jwt';
import { AuthModule } from '../auth/auth.module';
import { JwtAuthStrategy } from '../auth/strategy/jwt.strategy';
import { FilmModule } from '../film/film.module';
import { WebService } from './web.service';
import { BoughtFilmModule } from '../bought-film/bought-film.module';
import { FilmReviewModule } from '../film-review/film-review.module';

@Module({
  imports: [BoughtFilmModule, FilmReviewModule],
  controllers: [WebController],
  providers: [WebService],
  exports: [BoughtFilmModule, WebService],
})
export class WebModule {}
