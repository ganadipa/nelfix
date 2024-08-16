var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
import { AjaxRequest } from './ajax-request.js';
/**
 * FormHandler class
 * U is the type of the response data
 */
export class FormHandler {
    constructor(form, url) {
        this.form = form;
        this.url = url;
        this.onSuccess = () => { };
        this.onFail = () => { };
    }
    set() {
        this.form.addEventListener('submit', this.handleSubmit.bind(this));
    }
    setOnSuccess(callback) {
        this.onSuccess = callback;
    }
    setOnFail(callback) {
        this.onFail = callback;
    }
    setLoading(fn) {
        this.loading = fn;
    }
    setLoaded(fn) {
        this.loaded = fn;
    }
    handleSubmit(event) {
        return __awaiter(this, void 0, void 0, function* () {
            event.preventDefault();
            const formData = new FormData(this.form);
            const data = {};
            formData.forEach((value, key) => {
                data[key] = value;
            });
            const ajaxRequest = new AjaxRequest(this.url);
            this.loading(this.form);
            const resp = yield ajaxRequest.post(data);
            this.loaded(this.form);
            if (resp.status === 'success') {
                this.onSuccess(resp);
            }
            else {
                this.onFail(resp);
            }
        });
    }
}
//# sourceMappingURL=form-handler.js.map