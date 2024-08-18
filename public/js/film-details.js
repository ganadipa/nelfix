import { AjaxRequest } from './request/ajax-request.js';
import { RequestHandlerFactory } from './request/request-factory.js';
class ModalHandler {
    constructor(modal) {
        this.modal = modal;
        this.onSubmit = () => { };
        this.onSuccess = () => { };
        this.onFail = () => { };
    }
    show() {
        this.modal.classList.add('flex');
        this.modal.classList.remove('hidden');
    }
    hide() {
        this.modal.classList.add('hidden');
        this.modal.classList.remove('flex');
    }
    setOnSubmit(callback) {
        this.onSubmit = callback;
    }
    setOnSuccess(callback) {
        this.onSuccess = callback;
    }
    setOnFail(callback) {
        this.onFail = callback;
    }
}
document.addEventListener('DOMContentLoaded', () => {
    var _a, _b;
    const modal = document.querySelector('#purchaseModal');
    const modalHandler = new ModalHandler(modal);
    const responseContainer = modal.querySelector('div#response-container');
    const url = '/api/buy-film';
    const filmId = window.location.pathname.split('/').pop();
    const strategy = RequestHandlerFactory.create(url, 'POST');
    const ajaxRequest = new AjaxRequest(url, strategy);
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
                // then after 2s hide the modal
                setTimeout(() => {
                    modalHandler.hide();
                    window.location.reload();
                }, 2000);
            }
            else {
                modalHandler.onFail(resp.message);
            }
        });
    });
    const confirmPurchaseButton = document.getElementById('confirmPurchaseButton');
    confirmPurchaseButton.addEventListener('click', () => {
        modalHandler.onSubmit();
    });
    (_a = document.getElementById('closeModalButton')) === null || _a === void 0 ? void 0 : _a.addEventListener('click', () => {
        modalHandler.hide();
    });
    (_b = document.getElementById('purchaseButton')) === null || _b === void 0 ? void 0 : _b.addEventListener('click', () => {
        console.log('clicked');
        modalHandler.show();
    });
});
//# sourceMappingURL=film-details.js.map