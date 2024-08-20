export class FilmRenderer {
    constructor(container) {
        this.container = container;
    }
    renderFilms(films) {
        if (films.length === 0) {
            this.container.innerHTML = `<div class="text-gray-500">No films found</div>`;
            return;
        }
        const html = films.map((film) => this.renderFilm(film)).join('');
        this.container.innerHTML = `<div class="font-sans font-semibold mx-auto grid grid-cols-4 gap-3.5 auto-cols-max min-h-[800px]">${html}</div>
                                  <div id="pagination-bottom" class="flex justify-center items-center gap-3 mt-6"></div>`;
    }
    renderFilm(film) {
        return `
        <a class='bg-gray-700 hover:bg-gray-600 rounded-lg shadow-lg hover:shadow-2xl transition relative duration-300 ease-in-out overflow-hidden cursor-pointer flex flex-col justify-between h-[400px]' href="/web/films/${film.id}">
          <img src='${film.cover_image_url || '/placeholder.jpg'}' alt='${film.title}' class='w-full h-[200px] object-cover' />
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
        </a>
      `;
    }
}
//# sourceMappingURL=film-renderer.js.map