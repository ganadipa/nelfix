import { TResponseStatus } from '../../types.js';

export interface IRequestHandler<T> {
  // send method should return a Promise of TResponseStatus
  send(data?: Object): Promise<TResponseStatus<T>>;
}
