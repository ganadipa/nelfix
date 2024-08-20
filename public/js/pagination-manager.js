import { V1StylePagination } from './pagination/v1-style.js';
export class PaginationManager {
    constructor(topPaginationElement, bottomPaginationElement) {
        this.topPaginationElement = topPaginationElement;
        this.bottomPaginationElement = bottomPaginationElement;
    }
    updatePagination(totalItems, itemsPerPage) {
        const totalPages = Math.ceil(totalItems / itemsPerPage);
        this.renderPagination(this.topPaginationElement, totalPages);
        this.renderPagination(this.bottomPaginationElement, totalPages);
    }
    renderPagination(container, totalPages) {
        container.innerHTML = '';
        if (totalPages < 1)
            return;
        container.setAttribute('data-current-page', '1');
        container.setAttribute('data-total-pages', `${totalPages}`);
        const pagination = new V1StylePagination(container, 1, totalPages);
        pagination.prepare();
        pagination.render();
    }
}
//# sourceMappingURL=pagination-manager.js.map