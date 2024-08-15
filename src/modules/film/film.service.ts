import { Injectable, Query } from '@nestjs/common';
import { FilmDto } from './dto/film.dto';
import { FirebaseRepository } from '../firebase/firebase.repository';
import { v4 as uuidv4 } from 'uuid';
import { Film } from './film.entity';
import { FilmRepository } from './repository/film.repository';
import { TPrismaFilm } from 'src/common/types';
import { BoughtFilmRepository } from '../bought-film/repository';

@Injectable()
export class FilmService {
  constructor(
    private firebaseRepository: FirebaseRepository,
    private readonly filmRepository: FilmRepository,
    private readonly boughtFilmRepository: BoughtFilmRepository,
  ) {}

  async createFilm(
    film: FilmDto,
    files: {
      video: Express.Multer.File[];
      cover_image?: Express.Multer.File[];
    },
  ) {
    // Generate unique file names then upload the files to Firebase Storage
    const videoFileName = `video_${uuidv4()}_${files.video[0].originalname}`;
    const videoUrl = await this.firebaseRepository.addFile(
      files.video[0],
      videoFileName,
    );

    let imageUrl: string | null = null;
    if (files.cover_image && files.cover_image.length > 0) {
      const coverImageFileName = `cover_image_${uuidv4()}_${files.cover_image[0].originalname}`;
      imageUrl = await this.firebaseRepository.addFile(
        files.cover_image[0],
        coverImageFileName,
      );
    }

    const { release_year: releaseYear, ...otherFilmAttributes } = film;

    // Create the film in the database
    const filmData = {
      ...otherFilmAttributes,
      releaseYear,
      videoUrl,
      imageUrl,
    };
    console.log(imageUrl);

    const prismaFilm = await this.filmRepository.create(filmData);
    const filmInstance = new Film(prismaFilm);

    // OK
    return {
      status: 'success',
      message: 'Film created successfully!',
      data: filmInstance.toJSON(),
    };
  }

  async getFilm(id: string) {
    const film = await this.filmRepository.findById(id);
    if (!film) {
      // Not Found
      return {
        status: 'error',
        message: 'Film not found!',
        data: null,
      };
    }

    // OK
    return {
      status: 'success',
      message: 'Film fetched successfully!',
      data: new Film(film).toJSON(),
    };
  }

  async getFilms(q: string) {
    const byTitle = await this.filmRepository.getFilmsLikeTitle(q);
    const byDirector = await this.filmRepository.getFilmsLikeDirector(q);

    const filmMap = new Map<string, TPrismaFilm>();
    byTitle.forEach((film) => filmMap.set(film.id, film));

    let combinedFilms = byTitle;
    byDirector.forEach((film) => {
      if (!filmMap.has(film.id)) {
        combinedFilms.push(film);
      }
    });

    const filmInstances = Array.from(combinedFilms).map(
      (film) => new Film(film),
    );

    // OK
    return {
      status: 'success',
      message: 'Films fetched successfully!',
      data: filmInstances.map((film) => {
        const json = film.toJSON();
        delete json.video_url;
        return json;
      }),
    };
  }

  async updateFilm(
    newFilm: FilmDto,
    files: {
      video?: Express.Multer.File[];
      cover_image?: Express.Multer.File[];
    },
    id: string,
  ) {
    const oldFilm = await this.filmRepository.findById(id);
    if (!oldFilm) {
      // Not Found
      return {
        status: 'error',
        message: 'Film not found!',
        data: null,
      };
    }

    let videoUrl = oldFilm.videoUrl;
    if (files.video && files.video.length > 0) {
      this.firebaseRepository.removeFileByUrl(videoUrl);
      const videoFileName = `video_${uuidv4()}_${files.video[0].originalname}`;
      videoUrl = await this.firebaseRepository.addFile(
        files.video[0],
        videoFileName,
      );
    }

    let imageUrl = oldFilm.imageUrl;
    if (files.cover_image && files.cover_image.length > 0) {
      this.firebaseRepository.removeFileByUrl(imageUrl);
      const coverImageFileName = `cover_image_${uuidv4()}_${files.cover_image[0].originalname}`;
      imageUrl = await this.firebaseRepository.addFile(
        files.cover_image[0],
        coverImageFileName,
      );
    }

    const { release_year: releaseYear, ...otherFilmAttributes } = newFilm;

    const updatedFilmData = {
      ...otherFilmAttributes,
      releaseYear,
      videoUrl,
      imageUrl,
    };

    const updatedFilm = await this.filmRepository.update(id, updatedFilmData);

    // OK
    return {
      status: 'success',
      message: 'Film updated successfully!',
      data: new Film(updatedFilm).toJSON(),
    };
  }

  async deleteFilm(id: string) {
    const film = await this.filmRepository.findById(id);
    if (!film) {
      // Not Found
      return {
        status: 'error',
        message: 'Film not found!',
        data: null,
      };
    }

    const prismaFilm = await this.filmRepository.delete(id);
    this.firebaseRepository.removeFileByUrl(prismaFilm.videoUrl);
    this.firebaseRepository.removeFileByUrl(prismaFilm.imageUrl);

    const deletedFilm = new Film(prismaFilm).toJSON();
    delete deletedFilm.cover_image_url;

    // OK
    return {
      status: 'success',
      message: 'Film deleted successfully!',
      data: deletedFilm,
    };
  }

  async buyFilm(userId: string, filmId: string) {
    // Check if the user has already bought the film
    const boughtFilm =
      await this.boughtFilmRepository.getBoughtFilmByUserIdAndFilmId(
        userId,
        filmId,
      );
    if (boughtFilm) {
      // Bad Request
      return {
        status: 'error',
        message: 'Film already bought!',
        data: null,
      };
    }

    // Create a new bought film record
    await this.boughtFilmRepository.create({ userId, filmId });

    // OK
    return {
      status: 'success',
      message: 'Film bought successfully!',
      data: { user_id: userId, film_id: filmId },
    };
  }
}
