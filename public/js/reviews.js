import { FormHandler } from './form-handler.js';
document.addEventListener('DOMContentLoaded', () => {
    // get the form element
    const form = document.getElementById('review-form');
    if (!form) {
        return;
    }
    // create new FormHandler instance
    const url = '/api/review';
    const handler = new FormHandler(form, url, 'POST', { filmId: window.location.pathname.split('/').pop() });
    // set the form handler
    handler.setOnSuccess((message) => {
        location.reload();
    });
    handler.set();
});
//# sourceMappingURL=reviews.js.map