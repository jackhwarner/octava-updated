describe('Authentication', () => {
  beforeEach(() => {
    cy.visit('/');
  });

  it('should allow user to sign in', () => {
    cy.get('[data-testid="sign-in-button"]').click();
    cy.get('[data-testid="email-input"]').type('test@example.com');
    cy.get('[data-testid="password-input"]').type('password123');
    cy.get('[data-testid="submit-button"]').click();
    cy.url().should('include', '/dashboard');
  });

  it('should show error message for invalid credentials', () => {
    cy.get('[data-testid="sign-in-button"]').click();
    cy.get('[data-testid="email-input"]').type('invalid@example.com');
    cy.get('[data-testid="password-input"]').type('wrongpassword');
    cy.get('[data-testid="submit-button"]').click();
    cy.get('[data-testid="error-message"]').should('be.visible');
  });
}); 