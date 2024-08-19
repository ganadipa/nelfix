import { Injectable } from '@nestjs/common';
import { ExtendedRequest } from 'src/common/interfaces/request.interface';
import { TFilmJson } from 'src/common/types';
import { BoughtFilmService } from '../bought-film/bought-film.service';
import { FilmService } from '../film/film.service';

@Injectable()
export class WebService {
  constructor(
    private readonly boughtFilmService: BoughtFilmService,
    private readonly filmService: FilmService,
  ) {}

  public getPaginatedData(
    films: (TFilmJson & { is_bought: boolean })[],
    page: number,
  ) {
    const totalPages = Math.ceil(films.length / 12);
    const currentPage = !page || page > totalPages || page < 1 ? 1 : page;
    const filmsToReturn = films.slice((currentPage - 1) * 12, currentPage * 12);

    return {
      films: filmsToReturn,
      page: currentPage,
      total_pages: totalPages,
    };
  }

  async getPaginationData({
    pageStr,
    q,
    req,
  }: {
    pageStr: string;
    q: string;
    req: ExtendedRequest;
  }) {
    let films: (TFilmJson & { is_bought: boolean })[] = [];
    if (req.user) {
      films = await this.boughtFilmService.queryFilmsRelative(req.user.id, q);
    } else {
      const filmsReturned = await this.filmService.getFilms(q);
      films = filmsReturned.map((f) => ({
        ...f,
        is_bought: false,
      }));
    }

    const sortedFilms =
      this.boughtFilmService.sortFilmsByIsBoughtThenReleaseYear(films);
    const numPage = Math.ceil(sortedFilms.length / 12);

    if (!pageStr) {
      pageStr = '1';
    }

    let page = parseInt(pageStr, 10);
    if (isNaN(page) || page < 1 || page > numPage) {
      page = 1;
    }

    const paginationData = this.getPaginatedData(sortedFilms, page);
    return paginationData;
  }
}
