import { Controller, Get, Param, Query, Render, Req } from '@nestjs/common';
import { Roles } from '../../common/decorator/roles.decorator';
import { BoughtFilmService } from '../bought-film/bought-film.service';
import { ExtendedRequest } from 'src/common/interfaces/request.interface';
import { WebService } from './web.service';
import { FilmService } from '../film/film.service';
import { TBaseViewData, TFilmJson, TReviewJson, TUser } from 'src/common/types';
import { FilmReviewService } from '../film-review/film-review.service';

type TFilmsViewData = {
  films: (TFilmJson & { is_bought: boolean })[];
  page: number;
  total_pages: number;
};

type TDetailsViewData = {
  film: TFilmJson & {
    is_bought: boolean;
    rating: number;
    rated?: number;
    total_voters: number;
  };
};

@Controller('web')
export class WebController {
  constructor(
    private readonly boughtFilmService: BoughtFilmService,
    private readonly webService: WebService,
    private readonly filmService: FilmService,
    private readonly filmReviewService: FilmReviewService,
  ) {}

  @Get('films')
  @Render('films')
  @Roles(['USER', 'ADMIN', 'GUEST'])
  async getFilms(
    @Req() req: ExtendedRequest,
    @Query('page') pageStr?: string,
    @Query('q') q?: string,
  ): Promise<TBaseViewData & TFilmsViewData> {
    const paginationData = await this.webService.getPaginationData({
      pageStr,
      q,
      req,
    });
    return {
      films: paginationData.films,
      user: req.user,
      pathname: req.path,
      title: 'Films',
      page: paginationData.page,
      total_pages: paginationData.total_pages,
      scripts: ['/js/pagination/pagination-logic.js', '/js/search-films.js'],
      description: 'Watch your favorite films on Nelfix.',
    };
  }

  @Get('films/:filmid')
  @Render('films/details')
  @Roles(['USER', 'ADMIN', 'GUEST'])
  async getFilm(
    @Req() req: ExtendedRequest,
    @Param('filmid') filmId: string,
  ): Promise<TBaseViewData & TDetailsViewData> {
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
      },
      user: req.user,
      pathname: req.path,
      title: film.title,
      scripts: ['/js/film-details.js', '/js/reviews.js', '/js/star-review.js'],
      description: film.description,
    };
  }

  @Get('my-list')
  @Render('films')
  @Roles(['USER', 'ADMIN'], '/auth/login')
  async getMyList(@Req() req: ExtendedRequest, @Query('page') page: number) {
    const films = await this.boughtFilmService.getBoughtFilmsByUserId(
      req.user.id,
    );

    const paginationData = this.webService.getPaginatedData(
      films.map((f) => ({
        ...f,
        is_bought: true,
      })),
      page,
    );

    return {
      films: paginationData.films,
      user: req.user,
      pathname: req.path,
      title: 'My List',
      page: paginationData.page,
      total_pages: paginationData.total_pages,
      scripts: ['/js/pagination-logic.js'],
      no_film_desc: "You haven't bought any film yet.",
    };
  }

  @Get('profile')
  @Render('profile')
  @Roles(['USER', 'ADMIN'], '/auth/login')
  async getProfile(@Req() req: ExtendedRequest) {
    return {
      user: req.user,
      pathname: req.path,
      title: 'Profile',
    };
  }
}
