import { Module } from '@nestjs/common';
import { FilmController } from './film.controller';
import { FilmService } from './film.service';
import { FirebaseModule } from '../firebase/firebase.module';
import { FilmRepository } from './repository/film.repository';
import { BoughtFilmRepository } from '../bought-film/repository';
import { BoughtFilmService } from '../bought-film/bought-film.service';

@Module({
  imports: [FirebaseModule],
  controllers: [FilmController],
  providers: [
    FilmService,
    FilmRepository,
    BoughtFilmRepository,
    BoughtFilmService,
  ],
  exports: [FilmService, BoughtFilmService],
})
export class FilmModule {}
