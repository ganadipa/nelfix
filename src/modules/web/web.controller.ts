import { Controller, Get, Param, Query, Render, Req } from '@nestjs/common';
import { Roles } from '../../common/decorator/roles.decorator';
import { BoughtFilmService } from '../bought-film/bought-film.service';
import { ExtendedRequest } from 'src/common/interfaces/request.interface';
import { WebService } from './web.service';
import { FilmService } from '../film/film.service';

@Controller('web')
export class WebController {
  constructor(
    private readonly boughtFilmService: BoughtFilmService,
    private readonly webService: WebService,
    private readonly filmService: FilmService,
  ) {}

  @Get('films')
  @Render('films')
  @Roles(['USER', 'ADMIN'], '/auth/login')
  async getFilms(@Req() req: ExtendedRequest, @Query('page') page: number) {
    const films = await this.boughtFilmService.getFilmsRelative(req.user.id);
    const paginationData = this.webService.getPaginatedData(films, page);

    return {
      films: paginationData.films,
      user: req.user,
      pathname: req.path,
      title: 'Films',
      page: paginationData.page,
      totalPages: paginationData.totalPages,
      script: '/js/pagination-logic.js',
      no_film_desc: "Oops, there's no film available.",
    };
  }

  @Get('films/:id')
  @Render('films/details')
  @Roles(['USER', 'ADMIN'], '/auth/login')
  async getFilm(@Req() req: ExtendedRequest, @Param('id') id: string) {
    const hadBought = await this.boughtFilmService.hadBought(req.user.id, id);
    const film = await this.filmService.getFilm(id);

    return {
      film: {
        ...film,
        is_bought: hadBought,
      },
      user: req.user,
      pathname: req.path,
      title: film.title,
      script: '/js/film-details.js',
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
      totalPages: paginationData.totalPages,
      script: '/js/pagination-logic.js',
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
