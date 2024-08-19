import { Module } from '@nestjs/common';
import { FilmModule } from '../film/film.module';
import { UserModule } from '../user/user.module';
import { FilmReviewService } from './film-review.service';
import { FilmReviewRepository } from './repository/film-review.repository';

@Module({
  imports: [FilmModule, UserModule],
  providers: [FilmReviewService, FilmReviewRepository],
  exports: [FilmReviewService, FilmReviewRepository],
})
export class FilmReviewModule {}
