import { FormHandler } from './form-handler.js';
import { SearchManager } from './search-manager.js';
import { TFilmJson } from './types.js';

document.addEventListener('DOMContentLoaded', () => {
  const formElement = document.getElementById('search-form') as HTMLFormElement;
  if (formElement) {
    const handler = new FormHandler<
      { q: string },
      { films: (TFilmJson & { is_bought: boolean })[]; total: number }
    >(formElement, '/api/search-films', 'GET');
    new SearchManager(formElement, handler);
  }
});
