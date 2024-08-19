import { FormHandler } from './form-handler.js';
document.addEventListener('DOMContentLoaded', () => {
    // get the form element
    const form = document.getElementById('register-form');
    // response container is the div element inside the form that have id 'response-container', and must be inside the form element
    const responseContainer = form.querySelector('div#response-container');
    // create new FormHandler instance
    const url = '/api/register';
    const handler = new FormHandler(form, url, 'POST');
    // What happens when it is successful?
    handler.setOnSuccess(() => {
        // set the response message
        responseContainer.innerText = `Success: Register successful!`;
        // remove the error classes
        responseContainer.classList.remove('bg-red-100', 'text-red-800', 'border-red-400', 'mb-12');
        // add the success classes
        responseContainer.classList.add('bg-green-100', 'text-green-800', 'border-green-400', 'mb-12');
    });
    // What happens when it fails?
    handler.setOnFail((data) => {
        // set the response message
        responseContainer.innerText = `Error: ${data.message}`;
        // remove the success classes
        responseContainer.classList.remove('bg-green-100', 'text-green-800', 'border-green-400', 'mb-12');
        // add the error classes
        responseContainer.classList.add('bg-red-100', 'text-red-800', 'border-red-400', 'mb-12');
    });
    // What happens when it is loading?
    handler.setLoading((form) => {
        // disable the form
        form.querySelectorAll('input, button').forEach((el) => {
            el.setAttribute('disabled', 'disabled');
        });
        // disable navigates to the login page
        const loginLink = form.querySelector('a');
        loginLink.setAttribute('href', '#');
        loginLink.classList.add('hidden');
    });
    // What happens when it is loaded?
    handler.setLoaded((form) => {
        // enable the form
        form.querySelectorAll('input, button').forEach((el) => {
            el.removeAttribute('disabled');
        });
        // enable navigates to the register page
        const loginLink = form.querySelector('a');
        loginLink.setAttribute('href', '/auth/login');
        loginLink.classList.remove('hidden');
    });
    // Ok, we are ready
    handler.set();
});
//# sourceMappingURL=register.js.map