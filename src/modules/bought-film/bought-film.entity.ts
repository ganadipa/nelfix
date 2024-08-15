import { Injectable } from '@nestjs/common';
import { TPrismaBoughtFilm } from 'src/common/types';

@Injectable()
export class BoughtFilm {
  id: string;
  purchasedAt: Date;
  userId: string;
  filmId: string;

  constructor(filmData: TPrismaBoughtFilm) {
    Object.assign(this, filmData);
  }
}
