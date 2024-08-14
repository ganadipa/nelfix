import { Module } from '@nestjs/common';
import { FilmController } from './film.controller';
import { FilmService } from './film.service';
import { FirebaseModule } from '../firebase/firebase.module';
import { FilmRepository } from './repository/film.repository';

@Module({
  imports: [FirebaseModule],
  controllers: [FilmController],
  providers: [FilmService, FilmRepository],
  exports: [FilmService],
})
export class FilmModule {}
