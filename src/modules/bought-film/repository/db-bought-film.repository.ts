import { Injectable } from '@nestjs/common';
import { IBoughtFilmRepository } from '.';
import { TPrismaBoughtFilm } from 'src/common/types';
import { PrismaService } from 'src/modules/prisma/prisma.service';

@Injectable()
export class DbBoughtFilmRepository implements IBoughtFilmRepository {
  constructor(private readonly prisma: PrismaService) {}

  async create(boughtInfo: {
    userId: string;
    filmId: string;
  }): Promise<TPrismaBoughtFilm> {
    return this.prisma.boughtFilm.create({
      data: boughtInfo,
    });
  }

  async findById(id: string): Promise<TPrismaBoughtFilm | null> {
    return this.prisma.boughtFilm.findUnique({
      where: { id },
    });
  }

  async delete(id: string): Promise<TPrismaBoughtFilm> {
    return this.prisma.boughtFilm.delete({
      where: { id },
    });
  }

  async getAll(): Promise<TPrismaBoughtFilm[]> {
    return this.prisma.boughtFilm.findMany();
  }

  async getBoughtFilmsByUserId(userId: string): Promise<TPrismaBoughtFilm[]> {
    return this.prisma.boughtFilm.findMany({
      where: { userId },
    });
  }

  async getBoughtFilmsByFilmId(filmId: string): Promise<TPrismaBoughtFilm[]> {
    return this.prisma.boughtFilm.findMany({
      where: { filmId },
    });
  }

  async getBoughtFilmByUserIdAndFilmId(
    userId: string,
    filmId: string,
  ): Promise<TPrismaBoughtFilm | null> {
    return this.prisma.boughtFilm.findFirst({
      where: { userId, filmId },
    });
  }
}
