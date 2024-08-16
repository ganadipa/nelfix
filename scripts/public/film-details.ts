import { AjaxRequest } from './ajax-request.js';
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

type TBuyFilmResponse = {
  status: 'success' | 'error';
  message: string;
  data: TFilmJson & { is_bought: boolean };
};

document.addEventListener('DOMContentLoaded', () => {
  const modal = document.querySelector('#purchaseModal') as HTMLDivElement;
  const modalHandler = new ModalHandler(modal);
  const responseContainer = modal.querySelector(
    'div#response-container',
  ) as HTMLDivElement;

  const filmId = window.location.pathname.split('/').pop() as string;
  const ajaxRequest = new AjaxRequest<TBuyFilmResponse>('/api/buy-film');

  modalHandler.setOnSuccess((message) => {
    responseContainer.textContent = message;
    responseContainer.className = 'text-green-500';
  });

  modalHandler.setOnFail((message) => {
    responseContainer.textContent = message;
    responseContainer.className = 'text-red-500';
  });

  modalHandler.setOnSubmit(() => {
    ajaxRequest.post({ filmId }).then((resp) => {
      if (resp.status === 'success') {
        modalHandler.onSuccess(resp.message);

        // then after 2s hide the modal
        setTimeout(() => {
          modalHandler.hide();
          window.location.reload();
        }, 2000);
      } else {
        modalHandler.onFail(resp.message);
      }
    });
  });

  const confirmPurchaseButton = document.getElementById(
    'confirmPurchaseButton',
  ) as HTMLButtonElement;

  confirmPurchaseButton.addEventListener('click', () => {
    modalHandler.onSubmit();
  });

  document.getElementById('closeModalButton')?.addEventListener('click', () => {
    modalHandler.hide();
  });

  document.getElementById('purchaseButton')?.addEventListener('click', () => {
    console.log('clicked');
    modalHandler.show();
  });
});
