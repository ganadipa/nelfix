import { Injectable } from '@nestjs/common';
import { IFilmReviewRepository } from '.';
import { TPrismaReviewFilm } from 'src/common/types';
import { PrismaService } from 'src/modules/prisma/prisma.service';

@Injectable()
export class FilmReviewRepository implements IFilmReviewRepository {
  constructor(private readonly prisma: PrismaService) {}

  async create(reviewInfo: {
    userId: string;
    filmId: string;
    rating: number;
  }): Promise<TPrismaReviewFilm> {
    return this.prisma.review.create({
      data: reviewInfo,
    });
  }

  async findById(id: string): Promise<TPrismaReviewFilm | null> {
    return this.prisma.review.findUnique({
      where: { id },
    });
  }

  async delete(id: string): Promise<TPrismaReviewFilm> {
    return this.prisma.review.delete({
      where: { id },
    });
  }

  async getAll(): Promise<TPrismaReviewFilm[]> {
    return this.prisma.review.findMany();
  }

  async getReviewsByUserId(userId: string): Promise<TPrismaReviewFilm[]> {
    return this.prisma.review.findMany({
      where: { userId },
    });
  }

  async getReviewsByFilmId(filmId: string): Promise<TPrismaReviewFilm[]> {
    return this.prisma.review.findMany({
      where: { filmId },
    });
  }

  async getReviewByUserIdAndFilmId(
    userId: string,
    filmId: string,
  ): Promise<TPrismaReviewFilm | null> {
    return this.prisma.review.findFirst({
      where: { userId, filmId },
    });
  }

  async getFilmsSortedByRating({
    startDate,
    endDate,
  }: {
    startDate?: Date;
    endDate?: Date;
  }): Promise<{ filmId: string; rating: number; count: number }[]> {
    const where: Object & {
      createdAt?: {
        gte?: Date;
        lte?: Date;
      };
    } = {};
    if (startDate && endDate) {
      where.createdAt = {
        gte: startDate,
        lte: endDate,
      };
    } else if (startDate) {
      where.createdAt = {
        gte: startDate,
      };
    } else if (endDate) {
      where.createdAt = {
        lte: endDate,
      };
    }

    const result = await this.prisma.review.groupBy({
      by: ['filmId'],
      _avg: {
        rating: true,
      },
      _count: {
        filmId: true, // Counting the number of reviews for each film
      },
      orderBy: [
        {
          _avg: {
            rating: 'desc',
          },
        },
        {
          _count: {
            filmId: 'desc',
          },
        },
      ],
      where,
    });
    result;

    const ret = await Promise.all(
      result.map(async (item) => {
        return {
          filmId: item.filmId,
          count: item._count.filmId,
          rating: item._avg.rating,
        };
      }),
    );

    return ret;
  }
}
