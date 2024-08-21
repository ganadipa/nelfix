import { Inject, Injectable } from '@nestjs/common';
import { Seeder } from './seeder.interface';
import { FirebaseRepository } from '../firebase/firebase.repository';
import * as path from 'path';
import { FileService } from '../file/file.service';
import { v4 as uuidv4 } from 'uuid';
import { IFilmRepository } from '../film/repository';

@Injectable()
export class FilmSeeder extends Seeder<{
  filmId: string;
  title: string;
}> {
  constructor(
    @Inject('FilmRepository')
    private readonly filmRepository: IFilmRepository,
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
        title: 'Eternal Echoes',
        description: 'A tale of love and loss.',
        director: 'Emily Wright',
        releaseYear: 2025,
        genre: ['Romance', 'Drama'],
        price: 1600,
        duration: 110,
      },
      {
        title: "Shadow's Edge",
        description: 'A gripping crime thriller.',
        director: 'Michael Gray',
        releaseYear: 2023,
        genre: ['Thriller', 'Crime'],
        price: 1400,
        duration: 115,
      },
      {
        title: 'Winds of Time',
        description: 'An epic historical drama.',
        director: 'Olivia Thompson',
        releaseYear: 2024,
        genre: ['Drama', 'History'],
        price: 1700,
        duration: 130,
      },
      {
        title: 'Digital Horizon',
        description: 'A futuristic sci-fi journey.',
        director: 'James Ford',
        releaseYear: 2026,
        genre: ['Science Fiction', 'Adventure'],
        price: 1800,
        duration: 140,
      },
      {
        title: 'Silent Whispers',
        description: 'A chilling horror experience.',
        director: 'Sarah Lee',
        releaseYear: 2023,
        genre: ['Horror', 'Suspense'],
        price: 1300,
        duration: 95,
      },
      {
        title: 'Broken Chains',
        description: 'A powerful tale of freedom.',
        director: 'Andrew Mitchell',
        releaseYear: 2025,
        genre: ['Drama', 'Action'],
        price: 1500,
        duration: 105,
      },
      {
        title: 'Moonlit Journey',
        description: 'A romantic adventure under the stars.',
        director: 'Anna Roberts',
        releaseYear: 2024,
        genre: ['Adventure', 'Romance'],
        price: 1600,
        duration: 120,
      },
      {
        title: 'City of Secrets',
        description: 'A detective uncovers hidden truths.',
        director: 'Daniel White',
        releaseYear: 2023,
        genre: ['Crime', 'Mystery'],
        price: 1400,
        duration: 100,
      },
      {
        title: 'Echoes in the Dark',
        description: 'A haunting supernatural story.',
        director: 'Rebecca Green',
        releaseYear: 2022,
        genre: ['Horror', 'Thriller'],
        price: 1200,
        duration: 90,
      },
      {
        title: 'Rising Tides',
        description: 'A struggle for survival in a flooded world.',
        director: 'Kevin Brown',
        releaseYear: 2026,
        genre: ['Drama', 'Science Fiction'],
        price: 1700,
        duration: 130,
      },
      {
        title: 'The Last Frontier',
        description: 'A group of explorers face the unknown.',
        director: 'Laura Davis',
        releaseYear: 2024,
        genre: ['Adventure', 'Action'],
        price: 1600,
        duration: 115,
      },
      {
        title: 'Chasing Shadows',
        description: 'A cat-and-mouse chase in the criminal underworld.',
        director: 'Christopher Young',
        releaseYear: 2023,
        genre: ['Thriller', 'Crime'],
        price: 1500,
        duration: 110,
      },
      {
        title: 'Frozen Dreams',
        description: 'A love story set in the Arctic.',
        director: 'Sophia Johnson',
        releaseYear: 2025,
        genre: ['Romance', 'Drama'],
        price: 1600,
        duration: 100,
      },
      {
        title: 'The Enigma Code',
        description: 'A puzzle that could change the world.',
        director: 'Jack Turner',
        releaseYear: 2024,
        genre: ['Mystery', 'Thriller'],
        price: 1500,
        duration: 120,
      },
      {
        title: 'Under the Iron Sky',
        description: 'A dystopian fight for freedom.',
        director: 'Rachel Morgan',
        releaseYear: 2026,
        genre: ['Science Fiction', 'Action'],
        price: 1800,
        duration: 130,
      },
      {
        title: "Ocean's Heart",
        description: 'A journey across the seas.',
        director: 'David Walker',
        releaseYear: 2023,
        genre: ['Adventure', 'Drama'],
        price: 1400,
        duration: 110,
      },
      {
        title: 'The Silent Desert',
        description: "A lone survivor's tale in the desert.",
        director: 'Lisa Carter',
        releaseYear: 2025,
        genre: ['Thriller', 'Drama'],
        price: 1500,
        duration: 105,
      },
      {
        title: 'Glimmer of Hope',
        description: 'A story of resilience against all odds.',
        director: 'Tom Harris',
        releaseYear: 2024,
        genre: ['Drama', 'Romance'],
        price: 1600,
        duration: 115,
      },
      {
        title: 'Nightfall',
        description: 'A battle against creatures of the night.',
        director: 'Victoria Ross',
        releaseYear: 2023,
        genre: ['Horror', 'Action'],
        price: 1400,
        duration: 100,
      },
      {
        title: 'The Lost Kingdom',
        description: 'An epic quest to find a lost empire.',
        director: 'Patrick Wilson',
        releaseYear: 2025,
        genre: ['Adventure', 'Fantasy'],
        price: 1700,
        duration: 130,
      },
      {
        title: 'Fading Memories',
        description: 'A poignant drama about memory and identity.',
        director: 'Grace Clark',
        releaseYear: 2024,
        genre: ['Drama', 'Science Fiction'],
        price: 1600,
        duration: 120,
      },
      {
        title: 'Blood Moon',
        description: 'A terrifying horror under the full moon.',
        director: 'Ryan Kelly',
        releaseYear: 2023,
        genre: ['Horror', 'Thriller'],
        price: 1300,
        duration: 95,
      },
      {
        title: 'Echo of Silence',
        description: 'A mystery that echoes through time.',
        director: 'Heather Adams',
        releaseYear: 2024,
        genre: ['Mystery', 'Drama'],
        price: 1500,
        duration: 110,
      },
      {
        title: 'Iron Will',
        description: 'A story of unbreakable determination.',
        director: 'Adam Lewis',
        releaseYear: 2025,
        genre: ['Drama', 'Action'],
        price: 1600,
        duration: 120,
      },
      {
        title: 'The Forgotten Land',
        description: 'A journey to a place lost in time.',
        director: 'Natalie King',
        releaseYear: 2023,
        genre: ['Adventure', 'Fantasy'],
        price: 1500,
        duration: 115,
      },
      {
        title: 'Beyond the Stars',
        description: "An astronaut's quest in deep space.",
        director: 'Matthew Moore',
        releaseYear: 2026,
        genre: ['Science Fiction', 'Adventure'],
        price: 1800,
        duration: 140,
      },
      {
        title: 'Shattered Glass',
        description: 'A psychological thriller of broken minds.',
        director: 'Nicole Turner',
        releaseYear: 2024,
        genre: ['Thriller', 'Drama'],
        price: 1500,
        duration: 110,
      },
      {
        title: 'Wildfire',
        description: 'A drama set against a raging wildfire.',
        director: 'Samuel Wright',
        releaseYear: 2023,
        genre: ['Drama', 'Action'],
        price: 1400,
        duration: 100,
      },
      {
        title: 'The Silver Lining',
        description: 'A feel-good story about finding hope.',
        director: 'Isabella Scott',
        releaseYear: 2025,
        genre: ['Romance', 'Drama'],
        price: 1600,
        duration: 115,
      },
      {
        title: 'Le Mari',
        description: 'A romantic drama.',
        director: 'Jane Doe',
        releaseYear: 2024,
        genre: ['Drama', 'Romance'],
        price: 1500,
        duration: 120,
      },
      {
        title: 'The Coin',
        description: 'A thrilling adventure.',
        director: 'John Smith',
        releaseYear: 2023,
        genre: ['Adventure', 'Thriller'],
        price: 1200,
        duration: 100,
      },
      {
        title: 'The Placeholder',
        description: 'A mysterious placeholder story.',
        director: 'Placeholder Director',
        releaseYear: 2022,
        genre: ['Mystery', 'Suspense'],
        price: 1000,
        duration: 90,
      },
    ];

    const filmsWithImageAndVideo = films.map((film, index) => ({
      ...film,
      videoUrl: videoUrls[Math.floor(Math.random() * videoUrls.length)],
      imageUrl: imageUrls[Math.floor(Math.random() * imageUrls.length)],
    }));

    for (const filmData of filmsWithImageAndVideo) {
      const film = await this.filmRepository.create(filmData);
      this.logSeeding('Film', {
        filmId: film.id,
        title: film.title,
      });
    }
  }
}
