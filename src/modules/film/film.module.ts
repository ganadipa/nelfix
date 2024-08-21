import { Module } from '@nestjs/common';
import { FilmService } from './film.service';
import { FirebaseModule } from '../firebase/firebase.module';
import { DbFilmRepository } from './repository/db-film.repository';

@Module({
  imports: [FirebaseModule],
  providers: [
    {
      provide: 'FilmRepository',
      useClass: DbFilmRepository,
    },
    FilmService,
  ],
  exports: [FilmService, FirebaseModule, 'FilmRepository'],
})
export class FilmModule {}
