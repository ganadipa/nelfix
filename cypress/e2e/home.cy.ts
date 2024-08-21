describe('Home Tests', () => {
  beforeEach(() => {
    // Visit the page
    cy.visit('/');
  });

  it('should handle the presence or absence of highlighted films', () => {
    // Check if the highlighted films section exists
    cy.get('body').then(($body) => {
      if ($body.find('#trendings').length > 0) {
        // If highlighted films exist
        cy.get('#trendings').should('be.visible');

        // Check that the search section is not exist
        cy.get('#search-section').should('not.exist');

        // But instead, a tag with the text "Browse all films" should be visible
        cy.contains('a', 'Browse all films').should('be.visible');
      } else {
        // If highlighted films do not exist

        // Then #trendings should not exist
        cy.get('#trendings').should('not.exist');

        // And the search section should be visible
        cy.get('#search-section').should('be.visible');
        cy.get('input[name="q"]').should('exist');
      }
    });
  });

  /**
   * This section provides the test case if highlighted films exist
   * ---- Start
   */
  it('should redirect to the details of the film when "More details" is clicked', () => {
    cy.get('body').then(($body) => {
      if ($body.find('#trendings').length > 0) {
        // If highlighted films exist
        cy.get('#trendings').should('be.visible');

        // Get the current title of the movie
        cy.get('#trendings h2')
          .first()
          .invoke('text')
          .then((title) => {
            // Click the first "More details" button
            cy.contains('a', 'More details').first().click();

            // Check that the URL is correct
            cy.url().should('include', '/web/films/');

            // Check that the title is correct
            cy.get('h1').should('have.text', title);
          });
      }
    });
  });

  it('should reddirect to the details of the film when an li element in the trendings list is clicked', () => {
    cy.get('body').then(($body) => {
      if ($body.find('#trendings').length > 0) {
        // If highlighted films exist
        cy.get('#trendings').should('be.visible');

        // Get the current title of the movie
        cy.get('#trendings-table li h3')
          .first()
          .invoke('text')
          .then((title) => {
            // Click the first li element in the trendings list
            cy.get('#trendings-table li').first().click();

            // Check that the URL is correct
            cy.url().should('include', '/web/films/');

            // Check that the title is correct
            cy.get('h1').should('have.text', title);
          });
      }
    });
  });

  it('should redirect to the browse page when "Browse all films" is clicked', () => {
    cy.get('body').then(($body) => {
      if ($body.find('#trendings').length > 0) {
        // If highlighted films exist
        cy.get('#trendings').should('be.visible');

        // Click the "Browse all films" link
        cy.contains('a', 'Browse all films').click();

        // Check that the URL is correct
        cy.url().should('include', '/web/films');
      }
    });
  });

  /**
   * ---- End
   */

  /**
   * This section provides the test case if highlighted films do not exist
   * ---- Start
   */
  it('should redirect to the browse page when the search form is submitted with query param q equals to the text inputted', () => {
    cy.get('body').then(($body) => {
      if ($body.find('#trendings').length === 0) {
        // If highlighted films do not exist
        cy.get('#search-section').should('be.visible');

        // Enter a random query
        const query = 'random query';
        const encodedQuery = encodeURIComponent(query);
        const handleSpaces = encodedQuery.replace(/%20/g, '+');
        cy.get('input[name="q"]').type(query);

        // Submit the form
        cy.get('button[type="submit"]').click();

        // Check that the URL is correct
        cy.url().should('include', `/web/films?q=${handleSpaces}`);
      }
    });
  });

  /**
   * ---- End
   */
});
