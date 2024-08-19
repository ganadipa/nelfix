import { V1StylePagination } from './pagination/v1-style.js';

export class PaginationManager {
  constructor(
    private topPaginationElement: HTMLElement,
    private bottomPaginationElement: HTMLElement,
  ) {}

  updatePagination(totalItems: number, itemsPerPage: number): void {
    const totalPages = Math.ceil(totalItems / itemsPerPage);
    this.renderPagination(this.topPaginationElement, totalPages);
    this.renderPagination(this.bottomPaginationElement, totalPages);
  }

  private renderPagination(container: HTMLElement, totalPages: number): void {
    container.innerHTML = '';
    if (totalPages < 1) return;
    container.setAttribute('data-current-page', '1');
    container.setAttribute('data-total-pages', `${totalPages}`);
    const pagination = new V1StylePagination(
      container as HTMLDivElement,
      1,
      totalPages,
    );
    pagination.prepare();
    pagination.render();
  }
}
