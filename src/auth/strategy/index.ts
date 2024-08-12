import { Request, Response } from 'express';
import { TUser } from 'src/types';

export interface IAuthStrategy {
  validate(token: string): TUser;
}
