import { FormHandler } from './form-handler.js';
import { TReviewPayload, TReviewPostData } from './types.js';

document.addEventListener('DOMContentLoaded', () => {
  // get the form element
  const form = document.getElementById('review-form') as HTMLFormElement;
  if (!form) {
    return;
  }

  // create new FormHandler instance
  const url = '/api/review';
  const handler = new FormHandler<TReviewPayload, TReviewPostData>(
    form,
    url,
    'POST',
    { filmId: window.location.pathname.split('/').pop() },
  );

  // set the form handler
  handler.setOnSuccess((message) => {
    location.reload();
  });

  handler.set();
});
