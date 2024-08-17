"use strict";
class PaginationContainer {
    constructor(paginationContainer, currentPage, totalPages) {
        this.paginationContainer = paginationContainer;
        this.currentPage = currentPage;
        this.totalPages = totalPages;
        this.prev = document.createElement('a');
        this.next = document.createElement('a');
        this.dotsGenerator = () => { };
        this.pageButtonGenerator = () => { };
    }
    setPreviousButtonAttribute(fn) {
        fn(this.prev);
    }
    setNextButtonAttribute(fn) {
        fn(this.next);
    }
    setPageButtonAttribute(fn) {
        this.pageButtonGenerator = fn;
    }
    setDotsAttribute(fn) {
        this.dotsGenerator = fn;
    }
    render() {
        const pivot = [1, this.currentPage, this.totalPages];
        // Create an array of objects that represent each page
        const elements = Array.from({ length: this.totalPages }).map((_, index) => {
            return {
                page: index + 1,
                willBeShown: pivot.some((p) => Math.abs(p - (index + 1)) <= 1),
                active: this.currentPage === index + 1,
            };
        });
        // render the previous button
        this.paginationContainer.appendChild(this.prev);
        // render the page buttons
        elements.forEach((element, index) => {
            if (element.willBeShown) {
                const pageLink = document.createElement('a');
                this.pageButtonGenerator(pageLink, element.page, element.active);
                this.paginationContainer.appendChild(pageLink);
            }
            else {
                const prevElement = elements[index - 1];
                if ((prevElement.willBeShown && index == 2) || index == 6) {
                    const dots = document.createElement('span');
                    this.dotsGenerator(dots);
                    this.paginationContainer.appendChild(dots);
                }
            }
        });
        // render the next button
        this.paginationContainer.appendChild(this.next);
    }
}
document.addEventListener('DOMContentLoaded', () => {
    const paginationElement = document.getElementById('pagination');
    if (!paginationElement)
        return;
    const currentPage = parseInt(paginationElement.getAttribute('data-current-page') || '1');
    const totalPages = parseInt(paginationElement.getAttribute('data-total-pages') || '1');
    const pagination = new PaginationContainer(paginationElement, currentPage, totalPages);
    // set previous button attribute
    pagination.setPreviousButtonAttribute((element) => {
        if (currentPage > 1) {
            element.href = `?page=${currentPage - 1}`;
            element.textContent = '<';
            element.className =
                'bg-gray-700 hover:bg-gray-600 text-white px-4 py-2 rounded transition duration-300 ease-in-out shadow hover:shadow-md';
            element.setAttribute('aria-label', 'Previous Page');
        }
        else {
            element.href = '#';
            element.textContent = '<';
            element.className =
                'bg-gray-500 text-white px-4 py-2 rounded cursor-not-allowed';
        }
    });
    // set next button attribute
    pagination.setNextButtonAttribute((element) => {
        if (currentPage < totalPages) {
            element.href = `?page=${currentPage + 1}`;
            element.textContent = '>';
            element.className =
                'bg-gray-700 hover:bg-gray-600 text-white px-4 py-2 rounded transition duration-300 ease-in-out shadow hover:shadow-md';
            element.setAttribute('aria-label', 'Next Page');
        }
        else {
            element.href = '#';
            element.textContent = '>';
            element.className =
                'bg-gray-500 text-white px-4 py-2 rounded cursor-not-allowed';
        }
    });
    pagination.setPageButtonAttribute((element, page, active) => {
        element.href = `?page=${page}`;
        element.textContent = `${page}`;
        element.className = `px-4 py-2 rounded transition duration-300 ease-in-out shadow ${active ? 'bg-blue-500' : 'bg-gray-700 hover:bg-gray-600 text-white'}`;
        return;
    });
    pagination.setDotsAttribute((element) => {
        element.textContent = '...';
        element.className = 'text-white mx-2';
    });
    pagination.render();
});
//# sourceMappingURL=pagination-logic.js.map