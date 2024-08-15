import { HttpException, Injectable } from '@nestjs/common';
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
      // throw relevant http exception
      throw new Error('Film not found!');
    }

    const boughtFilm =
      await this.boughtFilmRepository.getBoughtFilmByUserIdAndFilmId(
        userId,
        filmId,
      );
    if (boughtFilm) {
      throw new Error('Film already bought!');
    }

    const information = await this.boughtFilmRepository.create({
      userId,
      filmId,
    });

    // OK
    return information;
  }

  async hadBought(userId: string, filmId: string) {
    const boughtFilm =
      await this.boughtFilmRepository.getBoughtFilmByUserIdAndFilmId(
        userId,
        filmId,
      );
    if (!boughtFilm) {
      return false;
    }

    const film = await this.filmRepository.findById(filmId);
    if (!film) {
      throw new Error('Film not found!');
    }

    const filmJson = new Film(film).toJSON();

    // OK
    return true;
  }

  async getBoughtFilmsByUserId(userId: string) {
    const boughtFilms =
      await this.boughtFilmRepository.getBoughtFilmsByUserId(userId);
    const films = await this.filmRepository.getAll();

    const boughtMap = new Map<string, boolean>();
    boughtFilms.forEach((film) => boughtMap.set(film.filmId, true));

    const returnedFilms = films
      .filter((film) => boughtMap.has(film.id))
      .map((film) => new Film(film).toJSON());

    // OK
    return returnedFilms;
  }
}
