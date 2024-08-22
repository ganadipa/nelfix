import { Injectable } from '@nestjs/common';
import { ExtendedRequest } from 'src/common/interfaces/request.interface';
import { TFilmJson } from 'src/common/types';
import { BoughtFilmService } from '../bought-film/bought-film.service';
import { FilmService } from '../film/film.service';
import { FilmReviewService } from '../film-review/film-review.service';

@Injectable()
export class WebService {
  constructor(
    private readonly boughtFilmService: BoughtFilmService,
    private readonly filmService: FilmService,
    private readonly filmReviewService: FilmReviewService,
  ) {}

  /**
   * Get paginated data from films in a certain page
   *
   *
   * @param films
   * @param page
   * @returns
   */
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

  /**
   *
   * Get pagination data of films based on the query
   *
   *
   * @returns
   */
  async getPaginationData({
    pageStr,
    q,
    req,
    boughtOnly,
  }: {
    pageStr: string;
    q: string;
    req: ExtendedRequest;
    boughtOnly?: boolean;
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

    if (boughtOnly) {
      films = films.filter((f) => f.is_bought);
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

    if (paginationData.page > paginationData.total_pages) {
      paginationData.page = paginationData.total_pages;
    }
    return paginationData;
  }

  /**
   * Get data for the index view
   *
   *
   * @param req
   * @returns
   */
  async getIndexViewData(req: ExtendedRequest) {
    // Get the highest rated
    const topReviewFilms = await this.filmReviewService.getTopFilmsThisMonth();

    // Get the top 5
    const top5 = topReviewFilms.slice(0, 5);

    const preload_images: string[] = [];

    // Highlight!
    const highlighted_films = await Promise.all(
      top5.map(async (item) => {
        const film = await this.filmService.getFilm(item.filmId);
        const is_bought = req.user
          ? await this.boughtFilmService.hadBought(req.user?.id, item.filmId)
          : false;
        const allTimeRatingAndVoters =
          await this.filmReviewService.getAverageRatingAndTotalVoters(
            item.filmId,
          );

        preload_images.push(film.cover_image_url);

        return {
          ...film,
          is_bought,
          duration: Math.round(film.duration / 60),
          votes_this_month: item.count,
          rating_this_month: item.rating,
          votes_all_time: allTimeRatingAndVoters.total,
          rating_all_time: allTimeRatingAndVoters.avg,
        };
      }),
    );

    return {
      user: req.user,
      pathname: req.path,
      title: 'Home',
      highlighted_films,
      scripts: ['/js/trendings.js'],
      description:
        'Nelfix is a streaming service that offers a wide variety of award-winning TV shows, movies, anime, documentaries, and more on thousands of internet-connected devices.',
      preload_images,
    };
  }

  /**
   * Get data for the films view
   *
   *
   * @param req
   * @param pageStr
   * @param q
   * @returns
   */
  async getFilmsViewData(req: ExtendedRequest, pageStr: string, q: string) {
    const paginationData = await this.getPaginationData({
      pageStr,
      q,
      req,
    });
    const twoGenresPaginationData = {
      films: paginationData.films.map((film) => ({
        ...film,
        genres: film.genre.slice(0, 2),
      })),
      page: paginationData.page,
      total_pages: paginationData.total_pages,
    };

    return {
      query: q,
      films: twoGenresPaginationData.films,
      user: req.user,
      pathname: req.path,
      title: 'Films',
      page: paginationData.page,
      total_pages: paginationData.total_pages,
      scripts: ['/js/pagination/pagination-logic.js'],
      description: 'Watch your favorite films on Nelfix.',
    };
  }

  /**
   * Get data for the film details view
   *
   *
   * @param req
   * @param filmId
   * @returns
   */
  async getFilmDetailsViewData(req: ExtendedRequest, filmId: string) {
    const film = await this.filmService.getFilm(filmId);
    const dataReview =
      await this.filmReviewService.getAverageRatingAndTotalVoters(film.id);

    return {
      film: {
        ...film,
        is_bought: req.user
          ? await this.boughtFilmService.hadBought(req.user.id, film.id)
          : false,
        rating: dataReview.avg,
        total_voters: dataReview.total,
        rated: req.user
          ? await this.filmReviewService.hadRatedFilm(req.user.id, film.id)
          : undefined,
        duration_in_minutes: Math.round(film.duration / 60),
      },
      user: req.user,
      pathname: req.path,
      title: film.title,
      scripts: ['/js/film-details.js', '/js/reviews.js', '/js/star-review.js'],
      description: film.description,
    };
  }

  /**
   * get data for the my list view
   *
   *
   * @param req
   * @param pageStr
   * @param q
   * @returns
   */
  async getMyListViewData(req: ExtendedRequest, pageStr: string, q: string) {
    const paginationData = await this.getPaginationData({
      pageStr,
      q,
      req,
      boughtOnly: true,
    });
    const boughtOnly = paginationData.films.filter((film) => film.is_bought);

    const twoGenresPaginationData = {
      films: boughtOnly.map((film) => ({
        ...film,
        genres: film.genre.slice(0, 2),
      })),
      page: paginationData.page,
      total_pages: paginationData.total_pages,
    };

    return {
      query: q,
      films: twoGenresPaginationData.films,
      user: req.user,
      pathname: req.path,
      title: 'Purchased Films',
      page: paginationData.page,
      total_pages: paginationData.total_pages,
      scripts: ['/js/pagination/pagination-logic.js'],
      description: 'Watch your favorite films on Nelfix.',
    };
  }
}
