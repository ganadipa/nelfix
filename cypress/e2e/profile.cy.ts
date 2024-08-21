describe('Profile Tests', () => {
  beforeEach(() => {
    cy.login();
    cy.visit('http://localhost:3333/web/profile');
  });

  it('should display the full name', () => {
    cy.get('#full-name').should('be.visible');
  });

  it('should display the coin balance', () => {
    cy.get('#coin-balance').should('be.visible');
  });

  it('should display the first name', () => {
    cy.get('#first-name').should('be.visible');
  });

  it('should display the last name', () => {
    cy.get('#last-name').should('be.visible');
  });

  it('should display the email', () => {
    cy.get('#email').should('be.visible');
  });

  it('should display the username', () => {
    cy.get('#username').should('be.visible');
  });
});
