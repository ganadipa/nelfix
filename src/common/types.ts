import { $Enums } from '@prisma/client';

export interface TResponseStatus<T> {
  status: 'success' | 'error';
  message: string;
  data: T | null;
}

export type TLoginPostData = {
  username: string;
  token: string;
};

export type TUser = {
  id: string;
  username: string;
  email: string;
  role: TRole;
  firstName: string;
  lastName: string;
  token: string;
  balance: number;
};

export type TGetUser = {
  id: string;
  username: string;
  email: string;
  balance: number;
};

export type TSelfGetData = {
  username: string;
  token: string;
};

export type TRole = 'ADMIN' | 'USER';

export type TFilmJson = {
  id: string;
  title: string;
  description: string;
  director: string;
  release_year: number;
  genre: string[];
  price: number;
  duration: number;
  video_url: string;
  cover_image_url: string | null;
  created_at: Date;
  updated_at: Date;
};

export type TUserJson = {
  id: string;
  created_at: Date;
  updated_at: Date;
  username: string;
  email: string;
  first_name: string;
  last_name: string;
  role: TRole;
  hashed_password: string;
  balance: number;
};

export type TPrismaFilm = {
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
};

export type TPrismaUser = {
  id: string;
  createdAt: Date;
  updatedAt: Date;
  username: string;
  email: string;
  firstName: string;
  lastName: string;
  role: $Enums.Role;
  hashedPassword: string;
  balance: number;
};

export type TPrismaBoughtFilm = {
  id: string;
  purchasedAt: Date;
  userId: string;
  filmId: string;
};

export type TBaseViewData = {
  title: string;
  scripts: string[];
  description: string;
  pathname: string;
  user?: TUser;
};
