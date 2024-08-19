import { Module } from '@nestjs/common';
import { BoughtFilmRepository } from './repository';
import { BoughtFilmService } from './bought-film.service';
import { FilmModule } from '../film/film.module';
import { UserModule } from '../user/user.module';

@Module({
  imports: [FilmModule, UserModule],
  providers: [BoughtFilmRepository, BoughtFilmService],
  exports: [BoughtFilmRepository, BoughtFilmService, FilmModule],
})
export class BoughtFilmModule {}
