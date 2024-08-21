describe('Films Tests for User', () => {
  before(() => {
    cy.login();
  });

  beforeEach(() => {
    cy.visit('http://localhost:3333/web/films');
  });

  it('should display the films', () => {
    cy.get('#films').should('be.visible');
  });
});
