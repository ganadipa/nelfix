export interface TResponseStatus<T> {
  status: 'success' | 'error';
  message: string;
  data: T | null;
}

export type TAuthPostData = {
  id: string;
  username: string;
  email: string;
  token: string;
};

export type TUser = {
  id: string;
  username: string;
};

export type TSelfGetData = {
  username: string;
  token: string;
};

export type TLoginForm = {
  username: string;
  password: string;
};

export type TRegisterForm = {
  email: string;
  username: string;
  firstName: string;
  lastName: string;
  password: string;
};

export interface IApiResponseBase {
  status: 'success' | 'error';
  message: string;
}

export interface ISuccessResponse extends IApiResponseBase {
  status: 'success';
  data: any;
}

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
  cover_image_url?: string;
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

export interface IErrorResponse {
  status: 'error';
  message: string;
  data: null;
}
