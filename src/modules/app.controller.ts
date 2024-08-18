import { Controller, Get, Render, Req, Res } from '@nestjs/common';
import { Response } from 'express';
import { Roles } from 'src/common/decorator/roles.decorator';
import { ExtendedRequest } from 'src/common/interfaces/request.interface';
import { TBaseViewData, TFilmJson } from 'src/common/types';
import { FilmService } from './film/film.service';
import { BoughtFilmService } from './bought-film/bought-film.service';

type THomeViewData = {
  highlighted_films: (TFilmJson & { is_bought: boolean })[];
};

@Controller('')
export class AppController {
  constructor(
    private readonly filmService: FilmService,
    private readonly boughtFilmService: BoughtFilmService,
  ) {}

  @Get('404')
  @Roles(['GUEST', 'USER', 'ADMIN'])
  get404(@Res() res: Response) {
    res.send('404');
    return;
  }

  @Get('')
  @Render('index')
  @Roles(['GUEST', 'USER', 'ADMIN'])
  async getIndex(
    @Req() req: ExtendedRequest,
  ): Promise<TBaseViewData & THomeViewData> {
    // const top5Films = await this.filmService.getTop5Films();
    const allFilms = await this.filmService.getFilms();
    console.log(allFilms.length);
    const top5Films = allFilms.slice(0, 5);
    const highlighted_films = await Promise.all(
      top5Films.map(async (f) => {
        const is_bought = req.user
          ? await this.boughtFilmService.hadBought(req.user.id, f.id)
          : false;
        return {
          ...f,
          is_bought,
          duration: Math.round(f.duration / 60),
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
    };
  }
}
