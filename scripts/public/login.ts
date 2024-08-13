import { FormHandler } from './form-handler.js';
import { TAuthPostData, TResponseStatus } from './types.js';

document.addEventListener('DOMContentLoaded', () => {
  // get the form element
  const form = document.getElementById('login-form') as HTMLFormElement;

  // response container is the div element inside the form that have id 'response-container', and must be inside the form element
  const responseContainer = form.querySelector(
    'div#response-container',
  ) as HTMLDivElement;

  // create new FormHandler instance
  const handler = new FormHandler<TResponseStatus<TAuthPostData>>(
    form,
    '/api/login',
  );

  // What happens when it is successful?
  handler.setOnSuccess((data) => {
    // set the response message
    responseContainer.innerText = `Success: ${data.message}`;

    // remove the error classes
    responseContainer.classList.remove(
      'bg-red-100',
      'text-red-800',
      'border-red-400',
      'mb-12',
    );

    // add the success classes
    responseContainer.classList.add(
      'bg-green-100',
      'text-green-800',
      'border-green-400',
      'mb-12',
    );

    location.reload();
  });

  // What happens when it fails?
  handler.setOnFail((data) => {
    // set the response message
    responseContainer.innerText = `Error: ${data.message}`;

    // remove the success classes
    responseContainer.classList.remove(
      'bg-green-100',
      'text-green-800',
      'border-green-400',
      'mb-12',
    );

    // add the error classes
    responseContainer.classList.add(
      'bg-red-100',
      'text-red-800',
      'border-red-400',
      'mb-12',
    );
  });

  // Ok, we are ready
  handler.set();
});
