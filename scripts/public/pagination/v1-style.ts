import { PaginationContainer } from './abstract.js';

export class V1StylePagination extends PaginationContainer {
  protected setPreviousButtonAttribute(): void {
    const element = this.prev;
    if (this.currentPage > 1) {
      const url = new URL(window.location.href);
      url.searchParams.set('page', `${this.currentPage - 1}`);
      url.hash = 'films';

      element.href = url.toString();
      element.textContent = '<';
      element.className =
        'bg-gray-700 hover:bg-gray-600 text-white px-4 py-2 rounded transition duration-300 ease-in-out shadow hover:shadow-md';
      element.setAttribute('aria-label', 'Previous Page');
    } else {
      element.href = '#';
      element.textContent = '<';
      element.className =
        'bg-gray-500 text-white px-4 py-2 rounded cursor-not-allowed';
    }
  }

  protected setNextButtonAttribute(): void {
    const element = this.next;
    if (this.currentPage < this.totalPages) {
      const url = new URL(window.location.href);
      url.searchParams.set('page', `${this.currentPage + 1}`);
      url.hash = 'films';
      element.href = url.toString();
      element.textContent = '>';
      element.className =
        'bg-gray-700 hover:bg-gray-600 text-white px-4 py-2 rounded transition duration-300 ease-in-out shadow hover:shadow-md';
      element.setAttribute('aria-label', 'Next Page');
    } else {
      element.href = '#';
      element.textContent = '>';
      element.className =
        'bg-gray-500 text-white px-4 py-2 rounded cursor-not-allowed';
    }
  }

  protected setPageButtonAttribute(): void {
    this.pageButtonGenerator = (
      element: HTMLAnchorElement,
      page: number,
      active: boolean,
    ) => {
      const url = new URL(window.location.href);
      url.searchParams.set('page', `${page}`);

      element.href = url.toString();
      element.textContent = `${page}`;
      element.className = `px-4 py-2 rounded transition duration-300 ease-in-out shadow ${
        active ? 'bg-blue-500' : 'bg-gray-700 hover:bg-gray-600 text-white'
      }`;
    };
  }

  protected setDotsAttribute(): void {
    this.dotsGenerator = (element: HTMLSpanElement) => {
      element.textContent = '...';
      element.className = 'text-white mx-2';
    };
  }
}
