import { Module } from '@nestjs/common';
import { ApiController } from './api.controller';
import { AuthModule } from '../auth/auth.module';
import { BoughtFilmModule } from '../bought-film/bought-film.module';
import { FilmReviewModule } from '../film-review/film-review.module';

@Module({
  imports: [AuthModule, BoughtFilmModule, FilmReviewModule],
  controllers: [ApiController],
  providers: [],
  exports: [AuthModule, BoughtFilmModule, FilmReviewModule],
})
export class ApiModule {}
