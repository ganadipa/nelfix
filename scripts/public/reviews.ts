import { FormHandler } from './form-handler.js';
import { TReviewPayload, TReviewPostData } from './types.js';

document.addEventListener('DOMContentLoaded', () => {
  // get the form element
  const form = document.getElementById('review-form') as HTMLFormElement;

  // response container is the div element inside the form that have id 'response-container', and must be inside the form element
  const responseContainer = form.querySelector(
    'div#response-container',
  ) as HTMLDivElement;

  // create new FormHandler instance
  const url = '/api/review';
  const handler = new FormHandler<TReviewPayload, TReviewPostData>(
    form,
    url,
    'POST',
    { filmId: window.location.pathname.split('/').pop() },
  );

  handler.set();
});
