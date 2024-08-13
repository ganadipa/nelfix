import { Request, Response } from 'express';
import { TUser } from 'src/common/types';

export interface IAuthStrategy {
  validate(token: string): TUser;
}
