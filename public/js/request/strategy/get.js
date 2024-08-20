var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
export class GetRequestHandler {
    constructor(url) {
        this.url = url;
    }
    send(data) {
        return __awaiter(this, void 0, void 0, function* () {
            // make data as a query string
            let query = '';
            if (data) {
                query = Object.keys(data)
                    .map((key) => `${key}=${data[key]}`)
                    .join('&');
            }
            // append query string to the url
            const response = yield fetch(this.url + (query ? `?${query}` : ''));
            return response.json();
        });
    }
}
//# sourceMappingURL=get.js.map