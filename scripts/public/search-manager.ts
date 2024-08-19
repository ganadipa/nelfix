import { FilmRenderer } from './film-renderer.js';
import { FormHandler } from './form-handler.js';
import { PaginationManager } from './pagination-manager.js';

export class SearchManager<T, V> {
  constructor(
    private form: HTMLFormElement,
    private handler: FormHandler<T, V>,
  ) {
    this.initialize();
  }

  private initialize(): void {
    this.handler.setOnSuccess((data, payload) =>
      this.handleSuccess(data, payload),
    );
    this.handler.setOnFail((data) => this.handleFail(data));
    this.handler.setLoading(() => this.setLoading());
    this.handler.setLoaded(() => this.setLoaded());
    this.handler.set();
  }

  private handleSuccess(data: any, payload: any): void {
    const resultsContainer = document.getElementById('results');
    if (!resultsContainer) return;

    const filmRenderer = new FilmRenderer(resultsContainer);
    filmRenderer.renderFilms(data.films);

    const topPagination = document.getElementById('pagination-top');
    const bottomPagination = document.getElementById('pagination-bottom');
    if (topPagination && bottomPagination) {
      const paginationManager = new PaginationManager(
        topPagination,
        bottomPagination,
      );
      paginationManager.updatePagination(data.total, 12);
    }

    this.updateUrl(payload.q);
  }

  private handleFail(data: any): void {
    const container = document.getElementById('search-results');
    if (container) {
      container.innerHTML = `<div class="text-red-500">${data.message}</div>`;
    }
  }

  private setLoading(): void {
    this.form.querySelectorAll('input, button').forEach((el) => {
      el.setAttribute('disabled', 'disabled');
    });
  }

  private setLoaded(): void {
    this.form.querySelectorAll('input, button').forEach((el) => {
      el.removeAttribute('disabled');
    });
  }

  private updateUrl(query: string): void {
    const url = new URL(window.location.href);
    url.searchParams.set('q', query);
    url.searchParams.delete('page');
    url.hash = '';
    window.history.pushState({}, '', url.toString());
  }
}
