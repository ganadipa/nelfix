import { Controller, Get, Query, Render, Req } from '@nestjs/common';
import { Roles } from '../../common/decorator/roles.decorator';
import { BoughtFilmService } from '../bought-film/bought-film.service';
import { ExtendedRequest } from 'src/common/interfaces/request.interface';
import { WebService } from './web.service';

@Controller('web')
export class WebController {
  constructor(
    private readonly boughtFilmService: BoughtFilmService,
    private readonly webService: WebService,
  ) {}

  @Get('films')
  @Render('films/index')
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
    };
  }
}
