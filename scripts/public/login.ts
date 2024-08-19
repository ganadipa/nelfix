import { FormHandler } from './form-handler.js';
import { TLoginForm, TLoginPostData, TResponseStatus } from './types.js';

document.addEventListener('DOMContentLoaded', () => {
  // get the form element
  const form = document.getElementById('login-form') as HTMLFormElement;

  // response container is the div element inside the form that have id 'response-container', and must be inside the form element
  const responseContainer = form.querySelector(
    'div#response-container',
  ) as HTMLDivElement;

  // create new FormHandler instance
  const url = '/api/login';
  const handler = new FormHandler<TLoginForm, TLoginPostData>(
    form,
    url,
    'POST',
  );

  // What happens when it is successful?
  handler.setOnSuccess((data) => {
    // set the response message
    responseContainer.innerText = `Success: User ${data.username} logged in!`;

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

    // after 2s, eload to automatically redirect whatever it takes them to
    setTimeout(() => {
      location.reload();
    }, 2000);
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

    // Enable the form
    form.querySelectorAll('input, button').forEach((el) => {
      el.removeAttribute('disabled');
    });
  });

  // What happens when it is loading?
  handler.setLoading((form) => {
    // disable the form
    form.querySelectorAll('input, button').forEach((el) => {
      el.setAttribute('disabled', 'disabled');
    });

    // disable navigates to the register page
    const registerLink = form.querySelector('a') as HTMLAnchorElement;
    registerLink.setAttribute('href', '#');
    registerLink.classList.add('hidden');
  });

  // What happens when it is loaded?
  handler.setLoaded((form, status) => {
    // input and button still disabled

    // enable navigates to the register page
    if (status === 'error') {
      const registerLink = form.querySelector('a') as HTMLAnchorElement;
      registerLink.setAttribute('href', '/auth/register');
      registerLink.classList.remove('hidden');
    }
  });

  // Ok, we are ready
  handler.set();
});
