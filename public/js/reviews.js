import { FormHandler } from './form-handler.js';
document.addEventListener('DOMContentLoaded', () => {
    // get the form element
    const form = document.getElementById('review-form');
    // response container is the div element inside the form that have id 'response-container', and must be inside the form element
    const responseContainer = form.querySelector('div#response-container');
    // create new FormHandler instance
    const url = '/api/review';
    const handler = new FormHandler(form, url, 'POST', { filmId: window.location.pathname.split('/').pop() });
    handler.set();
});
//# sourceMappingURL=reviews.js.map