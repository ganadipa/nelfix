var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
import { AjaxRequest } from './request/ajax-request.js';
import { RequestHandlerFactory } from './request/request-factory.js';
/**
 * FormHandler class
 * T is the form data
 * V is the type of the response.data
 */
export class FormHandler {
    constructor(form, url, method, additional) {
        this.form = form;
        this.url = url;
        this.method = method;
        this.onSuccess = () => { };
        this.onFail = () => { };
        this.loading = () => { };
        this.loaded = () => { };
        if (additional)
            this.additional = additional;
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
            // for each additional data, append it to the formData
            if (this.additional !== undefined) {
                for (const key in this.additional) {
                    formData.append(key, this.additional[key]);
                }
            }
            const data = {};
            formData.forEach((value, key) => {
                data[key] = value;
            });
            const strategy = RequestHandlerFactory.create(this.url, this.method);
            const ajaxRequest = new AjaxRequest(this.url, strategy);
            this.loading(this.form);
            const resp = yield ajaxRequest.request(data);
            this.loaded(this.form, resp.status);
            if (resp.status === 'success' && resp.data !== null) {
                this.onSuccess(resp.data, data);
            }
            else {
                this.onFail({
                    status: resp.status,
                    message: resp.message,
                });
            }
        });
    }
}
//# sourceMappingURL=form-handler.js.map