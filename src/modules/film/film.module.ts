import { Module } from '@nestjs/common';
import { FilmService } from './film.service';
import { FirebaseModule } from '../firebase/firebase.module';
import { FilmRepository } from './repository/film.repository';
import { UserModule } from '../user/user.module';
import { BoughtFilmModule } from '../bought-film/bought-film.module';

@Module({
  imports: [FirebaseModule],
  providers: [FilmService, FilmRepository],
  exports: [FilmService, FirebaseModule, FilmRepository],
})
export class FilmModule {}
