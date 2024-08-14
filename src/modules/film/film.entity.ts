import { Injectable } from '@nestjs/common';
import { TFilmJson, TPrismaFilm } from 'src/common/types';

@Injectable()
export class Film {
  id: string;
  createdAt: Date;
  updatedAt: Date;
  title: string;
  description: string;
  director: string;
  releaseYear: number;
  genre: string[];
  price: number;
  duration: number;
  videoUrl: string;
  imageUrl?: string;

  constructor(filmData: TPrismaFilm) {
    Object.assign(this, filmData);
  }

  public toJSON(): TFilmJson {
    return {
      id: this.id,
      title: this.title,
      description: this.description,
      director: this.director,
      release_year: this.releaseYear,
      genre: this.genre,
      price: this.price,
      duration: this.duration,
      video_url: this.videoUrl,
      cover_image_url: this.imageUrl,
      created_at: this.createdAt,
      updated_at: this.updatedAt,
    };
  }
}
