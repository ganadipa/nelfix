export class PaginationContainer {
    constructor(paginationContainer, currentPage, totalPages, additionalId) {
        this.paginationContainer = paginationContainer;
        this.currentPage = currentPage;
        this.totalPages = totalPages;
        this.additionalId = additionalId;
        this.prev = document.createElement('a');
        this.next = document.createElement('a');
        this.dotsGenerator = () => { };
        this.pageButtonGenerator = () => { };
    }
    // Template method
    render() {
        const pivot = [1, this.currentPage, this.totalPages];
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
                index;
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
    prepare() {
        this.setPreviousButtonAttribute();
        this.setNextButtonAttribute();
        this.setPageButtonAttribute();
        this.setDotsAttribute();
    }
    destroy() {
        this.paginationContainer.innerHTML = '';
    }
}
//# sourceMappingURL=abstract.js.map