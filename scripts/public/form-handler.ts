import { AjaxRequest } from './request/ajax-request.js';
import { RequestHandlerFactory } from './request/request-factory.js';

/**
 * FormHandler class
 * T is the form data
 * V is the type of the response.data
 */
export class FormHandler<T, V> {
  private onSuccess: (data: V, payload: T) => void;
  private onFail: ({
    status,
    message,
  }: {
    status: 'success' | 'error';
    message: string;
  }) => void;
  private loading: (form: HTMLFormElement) => void;
  private loaded: (form: HTMLFormElement, status: 'success' | 'error') => void;
  private additional: Object;

  constructor(
    private readonly form: HTMLFormElement,
    private url: string,
    private method: 'GET' | 'POST',
    additional?: Object,
  ) {
    this.onSuccess = () => {};
    this.onFail = () => {};
    this.loading = () => {};
    this.loaded = () => {};
    if (additional) this.additional = additional;
  }

  public set(): void {
    this.form.addEventListener('submit', this.handleSubmit.bind(this));
  }

  public setOnSuccess(callback: (data: V, payload: T) => void): void {
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

  public setLoaded(
    fn: (form: HTMLFormElement, status: 'success' | 'error') => void,
  ): void {
    this.loaded = fn;
  }

  private async handleSubmit(event: Event): Promise<void> {
    event.preventDefault();
    console.log('Form submitted');

    const formData = new FormData(this.form);

    // for each additional data, append it to the formData
    if (this.additional !== undefined) {
      for (const key in this.additional) {
        formData.append(key, this.additional[key]);
      }
    }
    console.log('Form data:', formData);

    const data: { [key: string]: unknown } = {};

    formData.forEach((value, key) => {
      data[key] = value;
    });

    const strategy = RequestHandlerFactory.create<V>(this.url, this.method);
    const ajaxRequest = new AjaxRequest<V>(this.url, strategy);

    this.loading(this.form);
    const resp = await ajaxRequest.request(data);
    this.loaded(this.form, resp.status);

    if (resp.status === 'success' && resp.data !== null) {
      this.onSuccess(resp.data, data as T);
    } else {
      this.onFail({
        status: resp.status,
        message: resp.message,
      });
    }
  }
}
