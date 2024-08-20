import { GetRequestHandler } from './strategy/get.js';
import { PostRequestHandler } from './strategy/post.js';
export class RequestHandlerFactory {
    static create(url, method) {
        switch (method) {
            case 'GET':
                return new GetRequestHandler(url);
            case 'POST':
                return new PostRequestHandler(url);
            default:
                // this should never happen
                throw new Error('Invalid request method');
        }
    }
}
//# sourceMappingURL=request-factory.js.map