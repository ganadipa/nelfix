describe('Films Tests for User', () => {
  beforeEach(() => {
    cy.visit('http://localhost:3333/web/films');
  });

  // Search bar
  it('Should have the search bar', () => {
    cy.get('#searchbar').should('be.visible');
  });

  it('Should have the search button', () => {
    cy.get('#search-form button[type="submit"]').should('be.visible');
  });

  it('Should redirect to the search results page when the search button is clicked', () => {
    const searchQuery = 'something';

    cy.get('input[name="q"]').type(searchQuery);

    cy.get('button[type="submit"]').click();

    cy.url().should('include', `/web/films?q=${searchQuery}`);
  });

  /**
   * When film is empty
   * --- start
   */
  it('Should display "No film is found", when film is empty', () => {
    cy.get('body').then(($body) => {
      const $response_when_empty = $body.find('#response-when-empty');
      if ($response_when_empty.length > 0) {
        cy.get('#response-when-empty').should(
          'contain.text',
          'No film is found',
        );
      }
    });
  });

  it('Should hide the pagination, when film is empty', () => {
    cy.get('body').then(($body) => {
      const $response_when_empty = $body.find('#response-when-empty');
      if ($response_when_empty.length > 0) {
        cy.get('#pagination-top').should('not.be.visible');
        cy.get('#pagination-bottom').should('not.be.visible');
      }
    });
  });

  /**
   * --- end
   */

  /**
   * When film is not empty
   * --- start
   */
  it('Should hide the #response-when-empty, when film is not empty', () => {
    cy.get('body').then(($body) => {
      const $response_when_empty = $body.find('#response-when-empty');
      if ($response_when_empty.length == 0) {
        cy.get('#response_when_empty').should('not.exist');
      }
    });
  });

  // Pagination
  it('Should have the top pagination and bottom pagination, when film is not empty', () => {
    cy.get('body').then(($body) => {
      const $response_when_empty = $body.find('#response-when-empty');
      if ($response_when_empty.length == 0) {
        cy.get('#pagination-top').should('be.visible');
        cy.get('#pagination-bottom').should('be.visible');
      }
    });
  });

  it('Should have left arrow on both top pagination and bottom pagination, when film is not empty', () => {
    cy.get('body').then(($body) => {
      const $response_when_empty = $body.find('#response-when-empty');
      if ($response_when_empty.length == 0) {
        cy.get('#pagination-top a').first().should('have.text', '<');
        cy.get('#pagination-bottom a').first().should('have.text', '<');
      }
    });
  });

  it('Should have right arrow on both top pagination and bottom pagination, when film is not empty', () => {
    cy.get('body').then(($body) => {
      const $response_when_empty = $body.find('#response-when-empty');

      if ($response_when_empty.length == 0) {
        cy.get('#pagination-top a').last().should('have.text', '>');
        cy.get('#pagination-bottom a').last().should('have.text', '>');
      }
    });
  });

  it('Should have the current page number on both top pagination and bottom pagination, when film is not empty', () => {
    cy.get('body').then(($body) => {
      const $responseWhenEmpty = $body.find('#response-when-empty');

      if ($responseWhenEmpty.length === 0) {
        cy.get('#pagination-top').then(($paginationTop) => {
          const currentPage = $paginationTop.attr('data-current-page');

          // Iterate over all <a> tags in #pagination-top and check if any contains the total pages
          cy.get('#pagination-top a').each(($el) => {
            if ($el.text().trim() === currentPage) {
              cy.wrap($el).should('have.text', currentPage);
            }
          });

          // Iterate over all <a> tags in #pagination-bottom and check if any contains the total pages
          cy.get('#pagination-bottom a').each(($el) => {
            if ($el.text().trim() === currentPage) {
              cy.wrap($el).should('have.text', currentPage);
            }
          });
        });
      }
    });
  });

  it('Should have the first page number on both top pagination and bottom pagination, when film is not empty', () => {
    cy.get('body').then(($body) => {
      const $response_when_empty = $body.find('#response-when-empty');
      if ($response_when_empty.length == 0) {
        cy.get('#pagination-top a').eq(1).should('have.text', '1');
        cy.get('#pagination-bottom a').eq(1).should('have.text', '1');
      }
    });
  });

  it('Should have the last page number on both top pagination and bottom pagination, when film is not empty', () => {
    cy.get('body').then(($body) => {
      const $response_when_empty = $body.find('#response-when-empty');
      const lastPage = $body.find('#pagination-top').attr('data-total-pages');
      if ($response_when_empty.length == 0) {
        cy.get('#pagination-top a').eq(-2).should('have.text', lastPage);
        cy.get('#pagination-bottom a').eq(-2).should('have.text', lastPage);
      }
    });
  });

  it('Should keep the first page button active when the left arrow is clicked on the first page', () => {
    cy.get('body').then(($body) => {
      const $responseWhenEmpty = $body.find('#response-when-empty');

      if ($responseWhenEmpty.length === 0) {
        cy.get('#pagination-top a').eq(1).should('have.class', 'bg-blue-500');

        cy.get('#pagination-top #left-arrow').click();

        cy.get('#pagination-top a').eq(1).should('have.class', 'bg-blue-500');

        cy.get('#pagination-top a').each(($el, index) => {
          if (index !== 1 && index !== 0) {
            cy.wrap($el).should('have.class', 'bg-gray-700');
          }
        });

        cy.get('#pagination-bottom a')
          .eq(1)
          .should('have.class', 'bg-blue-500');
        cy.get('#pagination-bottom a').each(($el, index) => {
          if (index !== 1 && index !== 0) {
            cy.wrap($el).should('have.class', 'bg-gray-700');
          }
        });
      }
    });
  });

  it('Should keep the last page button active when the right arrow is clicked on the last page', () => {
    cy.get('body').then(($body) => {
      const $responseWhenEmpty = $body.find('#response-when-empty');
      const lastPage = $body.find('#pagination-top').attr('data-total-pages');

      if ($responseWhenEmpty.length === 0 && parseInt(lastPage) > 1) {
        cy.get('#pagination-top a')
          .eq(-2)
          .should('have.class', 'bg-gray-700')
          .click();

        cy.get('#pagination-top a').eq(-2).should('have.class', 'bg-blue-500');

        cy.get('#pagination-top #right-arrow').click();

        cy.get('#pagination-top a').eq(-2).should('have.class', 'bg-blue-500');

        cy.get('#pagination-bottom a')
          .eq(-2)
          .should('have.class', 'bg-blue-500');
      }
    });
  });

  it('Should redirect to the details page of a film when the film card is clicked', () => {
    cy.get('body').then(($body) => {
      const $responseWhenEmpty = $body.find('#response-when-empty');

      if ($responseWhenEmpty.length === 0) {
        cy.get('.film-card').first().click();

        cy.url().should('include', '/web/films/');
      }
    });
  });
  /**
   * --- end
   */
});
