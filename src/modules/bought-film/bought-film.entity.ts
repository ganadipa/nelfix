import { TPrismaBoughtFilm } from 'src/common/types';

export class BoughtFilm {
  id: string;
  purchasedAt: Date;
  userId: string;
  filmId: string;

  constructor(filmData: TPrismaBoughtFilm) {
    Object.assign(this, filmData);
  }
}
