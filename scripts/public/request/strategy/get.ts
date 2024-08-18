import { TResponseStatus } from '../../types.js';
import { IRequestHandler } from './interface.js';

export class GetRequestHandler<T> implements IRequestHandler<T> {
  constructor(private url: string) {}

  public async send(data?: Object): Promise<TResponseStatus<T>> {
    // make data as a query string
    let query = '';
    if (data) {
      query = Object.keys(data)
        .map((key) => `${key}=${data[key]}`)
        .join('&');
    }

    // append query string to the url
    const response = await fetch(this.url + (query ? `?${query}` : ''));
    return response.json();
  }
}
