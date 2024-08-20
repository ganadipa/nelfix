import { FormHandler } from './form-handler.js';
import { SearchManager } from './search-manager.js';
document.addEventListener('DOMContentLoaded', () => {
    const formElement = document.getElementById('search-form');
    if (formElement) {
        const handler = new FormHandler(formElement, '/api/search-films', 'GET');
        new SearchManager(formElement, handler);
    }
});
//# sourceMappingURL=search-films.js.map