import { TUser } from 'src/common/types';
export * from './jwt.strategy';

export interface IAuthStrategy {
  validate(token: string): Promise<TUser>;
  getToken(id: string): Promise<string>;
}
