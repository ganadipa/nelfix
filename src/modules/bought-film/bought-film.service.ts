import { Injectable } from '@nestjs/common';
import { BoughtFilmRepository } from './repository';
import { FilmRepository } from '../film/repository';
import { TFilmJson, TPrismaFilm } from 'src/common/types';
import { Film } from '../film/film.entity';

@Injectable()
export class BoughtFilmService {
  constructor(
    private readonly boughtFilmRepository: BoughtFilmRepository,
    private readonly filmRepository: FilmRepository,
  ) {}

  async getFilmsRelative(
    userId: string,
  ): Promise<(TFilmJson & { is_bought: boolean })[]> {
    const boughtFilms =
      await this.boughtFilmRepository.getBoughtFilmsByUserId(userId);

    const films = await this.filmRepository.getAll();

    const boughtMap = new Map<string, boolean>();
    boughtFilms.forEach((film) => boughtMap.set(film.filmId, true));

    const returnedFilms = films.map((film) => {
      const filmJson = new Film(film).toJSON();
      return {
        ...filmJson,
        is_bought: boughtMap.has(filmJson.id),
      };
    });

    // sort by isBought then by release year
    returnedFilms.sort((a, b) => {
      if (a.is_bought === b.is_bought) {
        return b.release_year - a.release_year;
      }
      return a.is_bought ? -1 : 1;
    });

    // OK
    return returnedFilms;
  }

  async buyFilm(userId: string, filmId: string) {
    const film = await this.filmRepository.findById(filmId);
    if (!film) {
      return {
        status: 'success',
        message: 'Film not found!',
        data: null,
      };
    }

    const boughtFilm =
      await this.boughtFilmRepository.getBoughtFilmByUserIdAndFilmId(
        userId,
        filmId,
      );
    if (boughtFilm) {
      return {
        status: 'success',
        message: 'Film already bought!',
        data: null,
      };
    }

    const information = await this.boughtFilmRepository.create({
      userId,
      filmId,
    });

    // OK
    return {
      status: 'success',
      message: 'Film bought successfully!',
      data: information,
    };
  }
}
