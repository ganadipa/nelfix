import { GetRequestHandler } from './strategy/get.js';
import { IRequestHandler } from './strategy/interface.js';
import { PostRequestHandler } from './strategy/post.js';

export class RequestHandlerFactory {
  public static create<T>(
    url: string,
    method: 'GET' | 'POST',
  ): IRequestHandler<T> {
    switch (method) {
      case 'GET':
        return new GetRequestHandler<T>(url);
      case 'POST':
        return new PostRequestHandler<T>(url);
      default:
        // this should never happen
        throw new Error('Invalid request method');
    }
  }
}
