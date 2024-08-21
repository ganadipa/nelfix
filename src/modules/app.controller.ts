import { Controller, Get, Render, Req, Res } from '@nestjs/common';
import { Response } from 'express';
import { Roles } from 'src/common/decorator/roles.decorator';
import { ExtendedRequest } from 'src/common/interfaces/request.interface';
import { TBaseViewData, TFilmJson } from 'src/common/types';
import { FilmService } from './film/film.service';
import { BoughtFilmService } from './bought-film/bought-film.service';
import { FilmReviewService } from './film-review/film-review.service';
import { ApiTags } from '@nestjs/swagger';

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
  constructor(
    private readonly filmService: FilmService,
    private readonly boughtFilmService: BoughtFilmService,
    private readonly filmReviewService: FilmReviewService,
  ) {}

  @Get('')
  @Render('index')
  @Roles(['GUEST', 'USER', 'ADMIN'])
  async getIndex(
    @Req() req: ExtendedRequest,
  ): Promise<TBaseViewData & THomeViewData> {
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
}
