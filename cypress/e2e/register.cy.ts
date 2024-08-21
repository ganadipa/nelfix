import { v4 as uuidv4 } from 'uuid';

describe('Login Tests', () => {
  beforeEach(() => {
    // Visit the login page before each test
    cy.visit('http://localhost:3333/auth/register'); // Update with the correct path if needed
  });

  it('should fail to register using an existing username', () => {
    // Enter a valid inputs with an existing username
    cy.get('input[name="email"]').type('validUser@example.com');
    cy.get('input[name="username"]').click().type('johndoe');
    cy.get('input[name="firstName"]').type('valid');
    cy.get('input[name="lastName"]').type('user');
    cy.get('input[name="password"]').type('Password');

    // Submit the form
    cy.get('button[type="submit"]').click();

    // Check that an error message is displayed
    cy.get('#response-container')
      .should('be.visible')
      .and('have.class', 'bg-red-100');
  });

  it('should fail to register using an existing email', () => {
    // Enter a valid inputs with an existing email
    cy.get('input[name="email"]').type('johndoe@example.com');
    cy.get('input[name="username"]').click().type('validUser2');
    cy.get('input[name="firstName"]').type('valid');
    cy.get('input[name="lastName"]').type('user');
    cy.get('input[name="password"]').type('Password');

    // Submit the form
    cy.get('button[type="submit"]').click();

    // Check that an error message is displayed
    cy.get('#response-container')
      .should('be.visible')
      .and('have.class', 'bg-red-100');
  });

  it('should fail to register using a short password (< 8)', () => {
    // Enter a random and unique inputs
    const generated = uuidv4();
    const email = `${generated}@test.com`;
    const username = `user-${generated}`;
    const firstName = `first-${generated}`;
    const lastName = `last-${generated}`;
    const password = `short`;

    // Fill the form
    cy.get('input[name="email"]').type(email);
    cy.get('input[name="username"]').click().type(username);
    cy.get('input[name="firstName"]').type(firstName);
    cy.get('input[name="lastName"]').type(lastName);
    cy.get('input[name="password"]').type(password);

    // Submit the form
    cy.get('button[type="submit"]').click();
  });

  it('should register successfully with a random and unique inputs', () => {
    // Enter a random and unique inputs
    const generated = uuidv4();
    const email = `${generated}@test.com`;
    const username = `user-${generated}`;
    const firstName = `first-${generated}`;
    const lastName = `last-${generated}`;
    const password = `password-${generated}`;

    // Fill the form
    cy.get('input[name="email"]').type(email);
    cy.get('input[name="username"]').click().type(username);
    cy.get('input[name="firstName"]').type(firstName);
    cy.get('input[name="lastName"]').type(lastName);
    cy.get('input[name="password"]').type(password);

    // Submit the form
    cy.get('button[type="submit"]').click();

    // It will successfully register
    cy.get('#response-container')
      .should('be.visible')
      .and('have.class', 'bg-green-100');
  });

  it('should redirect to the login page', () => {
    // Click the register link
    cy.contains('a', `Already have an account?`).click();

    // Check that the URL is correct
    cy.url().should('include', '/auth/login');
  });
});
