import { Request } from 'express';
import { TUser } from '../types';

export interface ExtendedRequest extends Request {
  user?: TUser;
}
