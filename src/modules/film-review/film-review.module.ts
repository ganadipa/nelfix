import { Module } from '@nestjs/common';
import { FilmModule } from '../film/film.module';
import { UserModule } from '../user/user.module';
import { FilmReviewService } from './film-review.service';
import { DbFilmReviewRepository } from './repository/db-film-review.repository';

@Module({
  imports: [FilmModule, UserModule],
  providers: [
    FilmReviewService,
    {
      provide: 'FilmReviewRepository',
      useClass: DbFilmReviewRepository,
    },
  ],
  exports: [FilmReviewService, 'FilmReviewRepository'],
})
export class FilmReviewModule {}
