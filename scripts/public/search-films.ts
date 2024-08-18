import { FormHandler } from './form-handler.js';
import { V1StylePagination } from './pagination/v1-style.js';
import { TFilmJson } from './types.js';

document.addEventListener('DOMContentLoaded', () => {
  const form = document.getElementById('search-form');
  console.log(form);
  if (!form) {
    return;
  }

  const handler = new FormHandler<
    {
      q: string;
    },
    {
      films: (TFilmJson & { is_bought: boolean })[];
      total: number;
    }
  >(form as HTMLFormElement, '/api/search-films', 'GET');

  let paginationContainer: V1StylePagination | null = null;

  // What happens when it is successful?
  handler.setOnSuccess((data, payload) => {
    const container = document.getElementById('results');

    if (!container) {
      return;
    }
    container.innerHTML = '';

    let html = `<div class="font-sans font-semibold mx-auto grid grid-cols-4 gap-3.5 auto-cols-max min-h-[800px]">`;

    data.films.forEach((film) => {
      html += `<a class='bg-gray-700 hover:bg-gray-600 rounded-lg shadow-lg hover:shadow-2xl transition relative duration-300 ease-in-out overflow-hidden cursor-pointer flex flex-col justify-between h-[400px]' href="/web/films/${film.id}">
        <img src='${film.cover_image_url ? film.cover_image_url : '/placeholder.jpg'}' alt='${film.title}' class='w-full h-[200px] object-cover' />
        <div class='p-4 text-gray-300 flex flex-col gap-1.5'>
          <h2 class="text-xl font-bold line-clamp-2">${film.title} (${film.release_year})</h2>
          <p class="text-sm mt-1 font-normal">${film.director}</p>
          <div class="flex flex-wrap gap-2 mt-1">
            ${film.genre.map((genre) => `<div class="bg-blue-800 text-xs font-medium py-1 px-3 rounded-full">${genre}</div>`).join('')}
          </div>
          <div class="bg-cyan-950 px-4 py-1 border-2 border-emerald-900 rounded-full min-w-16 text-center flex items-center justify-around self-end">
            <span class="text-white">${film.price}</span>
            <img src="/coin.png" alt="Coin" class="h-4 inline" />
          </div>
        </div>
      </a>`;
    });

    html += `</div>`;

    html += `<div id="pagination-bottom" class="flex justify-center items-center gap-3 mt-6">
    </div>`;
    container.innerHTML = html;

    const filmsPerPage = 12;
    const numberPage = Math.ceil(data.total / filmsPerPage);

    //  Pagination top
    const pagination = document.getElementById('pagination-top');
    if (!pagination) {
      return;
    }

    pagination.innerHTML = '';
    pagination.setAttribute('data-current-page', '1');
    pagination.setAttribute('data-total-pages', `${numberPage}`);

    paginationContainer = new V1StylePagination(
      pagination as HTMLDivElement,
      1,
      numberPage,
    );

    paginationContainer.prepare();
    paginationContainer.render();

    // pagination bottom
    const paginationBottom = document.getElementById('pagination-bottom');
    if (!paginationBottom) {
      return;
    }

    paginationBottom.innerHTML = '';
    paginationBottom.setAttribute('data-current-page', '1');
    paginationBottom.setAttribute('data-total-pages', `${numberPage}`);

    const paginationBottomContainer = new V1StylePagination(
      paginationBottom as HTMLDivElement,
      1,
      numberPage,
    );

    paginationBottomContainer.prepare();
    paginationBottomContainer.render();

    // Construct the new url
    const url = new URL(window.location.href);
    url.searchParams.set('q', payload.q);
    url.searchParams.delete('page');
    url.hash = '';
    window.history.pushState({}, '', url.toString());
  });

  // What happens when it fails?
  handler.setOnFail((data) => {
    const container = document.getElementById('search-results');
    if (!container) {
      return;
    }

    container.innerHTML = `<div class="text-red-500">${data.message}</div>`;
  });

  // What happens when it is loading?
  handler.setLoading((form) => {
    // disable the form
    form.querySelectorAll('input, button').forEach((el) => {
      el.setAttribute('disabled', 'disabled');
    });
  });

  // What happens when it is done loading?
  handler.setLoaded((form) => {
    // enable the form
    form.querySelectorAll('input, button').forEach((el) => {
      el.removeAttribute('disabled');
    });
  });

  handler.set();
});
