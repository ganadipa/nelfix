import { Injectable } from '@nestjs/common';
import { TFilmJson } from 'src/common/types';

@Injectable()
export class WebService {
  constructor() {}

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
      totalPages,
    };
  }
}
