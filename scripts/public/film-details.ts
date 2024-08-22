import { AjaxRequest } from './request/ajax-request.js';
import { RequestHandlerFactory } from './request/request-factory.js';
import { TFilmJson } from './types.js';

class ModalHandler {
  public onSubmit: () => void;
  public onSuccess: (message: string) => void;
  public onFail: (message: string) => void;

  constructor(private modal: HTMLDivElement) {
    this.onSubmit = () => {};
    this.onSuccess = () => {};

    this.onFail = () => {};
  }

  public show(): void {
    this.modal.classList.add('flex');
    this.modal.classList.remove('hidden');
  }

  public hide(): void {
    this.modal.classList.add('hidden');
    this.modal.classList.remove('flex');
  }

  public setOnSubmit(callback: () => void): void {
    this.onSubmit = callback;
  }

  public setOnSuccess(callback: (message: string) => void): void {
    this.onSuccess = callback;
  }

  public setOnFail(callback: (message: string) => void): void {
    this.onFail = callback;
  }
}

document.addEventListener('DOMContentLoaded', () => {
  const modal = document.querySelector('#purchaseModal') as HTMLDivElement;
  if (!modal) {
    return;
  }
  const modalHandler = new ModalHandler(modal);
  const responseContainer = modal.querySelector(
    'div#response-container',
  ) as HTMLDivElement;
  if (!responseContainer) {
    return;
  }

  const url = '/api/buy-film';
  const filmId = window.location.pathname.split('/').pop() as string;
  const strategy = RequestHandlerFactory.create<
    TFilmJson & {
      is_bought: boolean;
    }
  >(url, 'POST');

  const ajaxRequest = new AjaxRequest<
    TFilmJson & {
      is_bought: boolean;
    }
  >(url, strategy);

  const confirmPurchaseButton = document.getElementById(
    'confirmPurchaseButton',
  ) as HTMLButtonElement;
  if (!confirmPurchaseButton) {
    return;
  }

  modalHandler.setOnSuccess((message) => {
    responseContainer.textContent = message;
    responseContainer.className = 'text-green-500';
  });

  modalHandler.setOnFail((message) => {
    responseContainer.textContent = message;
    responseContainer.className = 'text-red-500';
  });

  modalHandler.setOnSubmit(() => {
    ajaxRequest.request({ filmId }).then((resp) => {
      if (resp.status === 'success') {
        modalHandler.onSuccess(resp.message);

        setTimeout(() => {
          modalHandler.hide();
          window.location.reload();
        }, 1000);

        confirmPurchaseButton.disabled = true;
      } else {
        modalHandler.onFail(resp.message);
      }
    });
  });

  confirmPurchaseButton.addEventListener('click', () => {
    modalHandler.onSubmit();
  });

  document.getElementById('closeModalButton')?.addEventListener('click', () => {
    modalHandler.hide();
  });

  document.getElementById('buy-now')?.addEventListener('click', () => {
    modalHandler.show();
  });
});
