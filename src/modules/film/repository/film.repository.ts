import { Injectable } from '@nestjs/common';
import { IFilmRepository } from '.';
import { PrismaService } from '../../..//modules/prisma/prisma.service';
import { TPrismaFilm } from '../../..//common/types';

@Injectable()
export class FilmRepository implements IFilmRepository {
  constructor(private prismaService: PrismaService) {}

  async create(
    filmData: Omit<TPrismaFilm, 'id' | 'createdAt' | 'updatedAt'>,
  ): Promise<TPrismaFilm> {
    return this.prismaService.film.create({ data: filmData });
  }

  async findById(id: string): Promise<TPrismaFilm | null> {
    return this.prismaService.film.findUnique({ where: { id } });
  }

  async update(
    id: string,
    filmData: Partial<TPrismaFilm>,
  ): Promise<TPrismaFilm> {
    return this.prismaService.film.update({ where: { id }, data: filmData });
  }

  async delete(id: string): Promise<TPrismaFilm> {
    return await this.prismaService.film.delete({ where: { id } });
  }

  async getAll(): Promise<TPrismaFilm[]> {
    return this.prismaService.film.findMany();
  }

  async getFilmsLikeTitle(title: string): Promise<TPrismaFilm[]> {
    return this.prismaService.film.findMany({
      where: {
        title: {
          contains: title,
          mode: 'insensitive',
        },
      },
    });
  }

  async getFilmsLikeDirector(director: string): Promise<TPrismaFilm[]> {
    return this.prismaService.film.findMany({
      where: {
        director: {
          contains: director,
          mode: 'insensitive',
        },
      },
    });
  }
}
