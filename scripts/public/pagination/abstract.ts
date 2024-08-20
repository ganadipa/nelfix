export abstract class PaginationContainer {
  protected prev: HTMLAnchorElement;
  protected next: HTMLAnchorElement;
  protected pageButtonGenerator: (
    element: HTMLAnchorElement,
    page: number,
    active: boolean,
  ) => void;
  protected dotsGenerator: (element: HTMLSpanElement) => void;

  constructor(
    protected readonly paginationContainer: HTMLDivElement,
    protected readonly currentPage: number,
    protected readonly totalPages: number,
  ) {
    this.prev = document.createElement('a');
    this.next = document.createElement('a');
    this.dotsGenerator = () => {};
    this.pageButtonGenerator = () => {};
  }

  // Template method
  public render(): void {
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
      } else {
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

  protected abstract setPreviousButtonAttribute(): void;
  protected abstract setNextButtonAttribute(): void;
  protected abstract setPageButtonAttribute(): void;
  protected abstract setDotsAttribute(): void;

  public prepare(): void {
    this.setPreviousButtonAttribute();
    this.setNextButtonAttribute();
    this.setPageButtonAttribute();
    this.setDotsAttribute();
  }

  public destroy(): void {
    this.paginationContainer.innerHTML = '';
  }
}
