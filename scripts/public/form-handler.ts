import { AjaxRequest } from './ajax-request.js';

/**
 * FormHandler class
 * U is the type of the response data
 */
export class FormHandler<
  T extends {
    status: 'success' | 'error';
    message: string;
  },
> {
  private onSuccess: (data: T) => void;
  private onFail: ({
    status,
    message,
  }: {
    status: 'success' | 'error';
    message: string;
  }) => void;

  constructor(
    private readonly form: HTMLFormElement,
    private url: string,
  ) {
    this.onSuccess = () => {};
    this.onFail = () => {};
  }

  public set(): void {
    this.form.addEventListener('submit', this.handleSubmit.bind(this));
  }

  public setOnSuccess(callback: (data: T) => void): void {
    this.onSuccess = callback;
  }

  public setOnFail(
    callback: (data: { status: 'success' | 'error'; message: string }) => void,
  ): void {
    this.onFail = callback;
  }

  private async handleSubmit(event: Event): Promise<void> {
    event.preventDefault();

    const formData = new FormData(this.form);
    const data: { [key: string]: unknown } = {};

    formData.forEach((value, key) => {
      data[key] = value;
    });

    const ajaxRequest = new AjaxRequest<T>(this.url);
    const resp = await ajaxRequest.post(data);
    if ('status' in resp && 'message' in resp) {
      if (resp.status === 'success') {
        this.onSuccess(resp);
      } else {
        this.onFail(resp);
      }
    } else {
      this.onFail({
        status: 'error',
        message: resp.message[0],
      });
    }
  }
}
