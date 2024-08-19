import { TResponseStatus } from '../../types.js';
import { IRequestHandler } from './interface.js';

export class PostRequestHandler<T> implements IRequestHandler<T> {
  constructor(private url: string) {}

  public async send(data: Object): Promise<TResponseStatus<T>> {
    // send data as a JSON string
    const response = await fetch(this.url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    });
    return response.json();
  }
}
