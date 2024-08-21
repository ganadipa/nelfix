import { Module } from '@nestjs/common';
import { DbBoughtFilmRepository } from './repository';
import { BoughtFilmService } from './bought-film.service';
import { FilmModule } from '../film/film.module';
import { UserModule } from '../user/user.module';

@Module({
  imports: [FilmModule, UserModule],
  providers: [
    {
      provide: 'BoughtFilmRepository',
      useClass: DbBoughtFilmRepository,
    },
    BoughtFilmService,
  ],
  exports: ['BoughtFilmRepository', BoughtFilmService, FilmModule, UserModule],
})
export class BoughtFilmModule {}
