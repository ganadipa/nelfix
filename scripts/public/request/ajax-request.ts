import { TResponseStatus } from '../types.js';
import { IRequestHandler } from './strategy/interface.js';

export class AjaxRequest<T> {
  constructor(
    private url: string,
    private context: IRequestHandler<T>,
  ) {}

  async request(data?: Object): Promise<TResponseStatus<T>> {
    try {
      const resp = await this.context.send(data);
      return resp;
    } catch (error) {
      return {
        status: 'error',
        message: error.message,
        data: null,
      };
    }
  }
}
