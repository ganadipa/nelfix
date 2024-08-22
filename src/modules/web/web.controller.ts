import { Controller, Get, Param, Query, Render, Req } from '@nestjs/common';
import { Roles } from '../../common/decorator/roles.decorator';
import { ExtendedRequest } from 'src/common/interfaces/request.interface';
import { WebService } from './web.service';
import { TBaseViewData, TFilmJson } from 'src/common/types';
import { ApiTags } from '@nestjs/swagger';

type TFilmsViewData = {
  films: (TFilmJson & { is_bought: boolean })[];
  page: number;
  total_pages: number;
  query?: string;
};

type TDetailsViewData = {
  film: TFilmJson & {
    is_bought: boolean;
    rating: number;
    rated?: number;
    total_voters: number;
    duration_in_minutes: number;
  };
};

@ApiTags('Front End')
@Controller('web')
export class WebController {
  constructor(private readonly webService: WebService) {}

  @Get('films')
  @Render('films')
  @Roles(['USER', 'ADMIN', 'GUEST'])
  async getFilms(
    @Req() req: ExtendedRequest,
    @Query('page') pageStr?: string,
    @Query('q') q?: string,
  ): Promise<TBaseViewData & TFilmsViewData> {
    return this.webService.getFilmsViewData(req, pageStr, q);
  }

  @Get('films/:filmid')
  @Render('films/details')
  @Roles(['USER', 'ADMIN', 'GUEST'])
  async getFilm(
    @Req() req: ExtendedRequest,
    @Param('filmid') filmId: string,
  ): Promise<TBaseViewData & TDetailsViewData> {
    return this.webService.getFilmDetailsViewData(req, filmId);
  }

  @Get('my-list')
  @Render('films')
  @Roles(['USER', 'ADMIN'], '/auth/login')
  async getPurchase(
    @Req() req: ExtendedRequest,
    @Query('page') pageStr?: string,
    @Query('q') q?: string,
  ): Promise<TBaseViewData & TFilmsViewData> {
    return this.webService.getMyListViewData(req, pageStr, q);
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
