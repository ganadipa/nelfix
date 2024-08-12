var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
export class AjaxRequest {
    constructor(url) {
        this.url = url;
    }
    post(data) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const response = yield fetch(this.url, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify(data),
                });
                const jsonData = yield response.json();
                if (this.isValidSuccessResponse(jsonData)) {
                    return jsonData;
                }
                else if (this.isErrorResponseExpected(jsonData)) {
                    return jsonData;
                }
                else {
                    return {
                        error: 'Invalid Response',
                        message: ['Invalid response from the server'],
                        statusCode: 500,
                    };
                }
            }
            catch (error) {
                return {
                    error: 'Fetch Error',
                    message: error instanceof Error ? [error.message] : ['Unknown error'],
                    statusCode: 500,
                };
            }
        });
    }
    isValidSuccessResponse(data) {
        return 'status' in data && data.status === 'success' && 'data' in data;
    }
    isErrorResponseExpected(data) {
        return (('error' in data && 'message' in data && 'statusCode' in data) ||
            ('status' in data && data.status === 'error'));
    }
}
//# sourceMappingURL=ajax-request.js.map