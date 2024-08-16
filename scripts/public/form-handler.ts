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
  private loading: (form: HTMLFormElement) => void;
  private loaded: (form: HTMLFormElement) => void;

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

  public setLoading(fn: (form: HTMLFormElement) => void): void {
    this.loading = fn;
  }

  public setLoaded(fn: (form: HTMLFormElement) => void): void {
    this.loaded = fn;
  }

  private async handleSubmit(event: Event): Promise<void> {
    event.preventDefault();

    const formData = new FormData(this.form);
    const data: { [key: string]: unknown } = {};

    formData.forEach((value, key) => {
      data[key] = value;
    });

    const ajaxRequest = new AjaxRequest<T>(this.url);
    this.loading(this.form);
    const resp = await ajaxRequest.post(data);
    this.loaded(this.form);

    if (resp.status === 'success') {
      this.onSuccess(resp);
    } else {
      this.onFail(resp);
    }
  }
}
