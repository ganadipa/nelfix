import { Injectable } from '@nestjs/common';
import { Seeder } from './seeder.interface';
import { FilmRepository } from '../film/repository';
import { FirebaseRepository } from '../firebase/firebase.repository';
import * as path from 'path';
import { FileService } from '../file/file.service';
import { v4 as uuidv4 } from 'uuid';

@Injectable()
export class FilmSeeder extends Seeder<{
  filmId: string;
  title: string;
}> {
  constructor(
    private readonly filmRepository: FilmRepository,
    private firebaseRepo: FirebaseRepository,
    private readonly fileService: FileService,
  ) {
    super();
  }

  async seed(): Promise<void> {
    const imagePaths = [
      path.join('files', 'batman.jpg'),
      path.join('files', 'captain_america.jpg'),
      path.join('files', 'superman.jpg'),
    ];

    const videoPaths = [path.join('files', 'le-mari.mp4')];

    const imageFiles: Express.Multer.File[] = imagePaths.map((imagePath) =>
      this.fileService.createMulterFile(imagePath),
    );

    const videoFiles: Express.Multer.File[] = videoPaths.map((videoPath) =>
      this.fileService.createMulterFile(videoPath),
    );

    const imageUrls = await Promise.all(
      imageFiles.map((imageFile) => {
        const coverImageFileName = `cover_image_${uuidv4()}_${path.basename(imageFile.path)}`;
        return this.firebaseRepo.addFile(imageFile, coverImageFileName);
      }),
    );

    const videoUrls = await Promise.all(
      videoFiles.map((videoFile) => {
        const videoFileName = `video_${uuidv4()}_${path.basename(videoFile.path)}`;
        return this.firebaseRepo.addFile(videoFile, videoFileName);
      }),
    );

    const films = [
      {
        title: 'Le Mari',
        description: 'A romantic drama.',
        director: 'Jane Doe',
        releaseYear: 2024,
        genre: ['Drama', 'Romance'],
        price: 1500,
        duration: 120,
        videoUrl: videoUrls[Math.floor(Math.random() * videoUrls.length)],
        imageUrl: imageUrls[Math.floor(Math.random() * imageUrls.length)],
      },
      {
        title: 'The Coin',
        description: 'A thrilling adventure.',
        director: 'John Smith',
        releaseYear: 2023,
        genre: ['Adventure', 'Thriller'],
        price: 1200,
        duration: 100,
        videoUrl: videoUrls[Math.floor(Math.random() * videoUrls.length)],
        imageUrl: imageUrls[Math.floor(Math.random() * imageUrls.length)],
      },
      {
        title: 'The Placeholder',
        description: 'A mysterious placeholder story.',
        director: 'Placeholder Director',
        releaseYear: 2022,
        genre: ['Mystery', 'Suspense'],
        price: 1000,
        duration: 90,
        videoUrl: videoUrls[Math.floor(Math.random() * videoUrls.length)],
        imageUrl: imageUrls[Math.floor(Math.random() * imageUrls.length)],
      },
    ];

    for (const filmData of films) {
      const film = await this.filmRepository.create(filmData);
      this.logSeeding('Film', {
        filmId: film.id,
        title: film.title,
      });
    }
  }
}
