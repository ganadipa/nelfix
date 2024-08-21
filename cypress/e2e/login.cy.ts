describe('Login Tests', () => {
  beforeEach(() => {
    // Visit the login page before each test
    cy.visit('http://localhost:3333/auth/login'); // Update with the correct path if needed
  });

  it('should fail to login with invalid credentials', () => {
    // Enter invalid username and password
    cy.get('input[name="username_or_email"]').click().type('invalidUser');
    cy.get('input[name="password"]').type('wrongPassword');

    // Submit the form
    cy.get('button[type="submit"]').click();

    // Check that an error message is displayed
    cy.get('#response-container')
      .should('be.visible')
      .and('have.class', 'bg-red-100');
  });

  it('should login successfully with valid credentials', () => {
    // Enter valid username and password
    cy.get('input[name="username_or_email"]').type('johndoe');
    cy.get('input[name="password"]').type('password1');

    // Submit the form
    cy.get('button[type="submit"]').click();

    cy.get('#response-container')
      .should('be.visible')
      .and('have.class', 'bg-green-100');

    // Then after 2s, url will be /web/films
    cy.url().should('include', '/web/films');
  });

  it('should redirect to the register page', () => {
    // Click the register link
    cy.contains('a', `Don't have an account?`).click();

    // Check that the URL is correct
    cy.url().should('include', '/auth/register');
  });
});
