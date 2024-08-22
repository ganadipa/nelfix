import { Controller, Get, Render, Req, Res } from '@nestjs/common';
import { Roles } from 'src/common/decorator/roles.decorator';
import { ExtendedRequest } from 'src/common/interfaces/request.interface';
import { TBaseViewData, TFilmJson } from 'src/common/types';
import { ApiTags } from '@nestjs/swagger';
import { WebService } from './web/web.service';

type THomeViewData = {
  highlighted_films: (TFilmJson & {
    is_bought: boolean;
    votes_this_month: number;
    rating_this_month: number;
    votes_all_time: number;
    rating_all_time: number;
  })[];
  preload_images: string[];
};

@ApiTags('Front End')
@Controller('')
export class AppController {
  constructor(private readonly webService: WebService) {}

  @Get('')
  @Render('index')
  @Roles(['GUEST', 'USER', 'ADMIN'])
  async getIndex(
    @Req() req: ExtendedRequest,
  ): Promise<TBaseViewData & THomeViewData> {
    return this.webService.getIndexViewData(req);
  }
}
