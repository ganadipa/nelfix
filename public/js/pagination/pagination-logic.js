import { V1StylePagination } from './v1-style.js';
document.addEventListener('DOMContentLoaded', () => {
    const paginationContainers = [
        document.querySelector('#pagination-top'),
        document.querySelector('#pagination-bottom'),
    ];
    if (paginationContainers.some((container) => container === null || container === undefined) ||
        paginationContainers.some((container) => !(container instanceof HTMLDivElement))) {
        const emptyContainer = document.querySelector('#response-when-empty');
        if (!emptyContainer)
            throw new Error('Empty container not found!');
        emptyContainer.innerHTML =
            '<p class="text-xl text-gray-300 font-semibold">No Films Found!</p>';
        return;
    }
    if (!paginationContainers[0]) {
        return;
    }
    const currentPage = paginationContainers[0].getAttribute('data-current-page');
    if (!currentPage) {
        return;
    }
    if (parseInt(currentPage) < 1 || isNaN(parseInt(currentPage))) {
        return;
    }
    const totalPages = paginationContainers[0].getAttribute('data-total-pages');
    if (!totalPages) {
        return;
    }
    paginationContainers.forEach((container) => {
        if (!container) {
            return;
        }
        const pagination = new V1StylePagination(container, parseInt(currentPage), parseInt(totalPages));
        pagination.prepare();
        pagination.render();
    });
});
//# sourceMappingURL=pagination-logic.js.map