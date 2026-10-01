describe('Galactic Archives', () => {
  beforeEach(() => cy.visit('/dashboard'));

  it('ouvre les modules depuis le dashboard', () => {
    cy.contains('Archives').should('be.visible');
    cy.contains('Personnages').click();
    cy.url().should('include', '/people');
  });

  it('permet une recherche de personnage', () => {
    cy.visit('/people');
    cy.get('input[type="search"]').type('luke');
    cy.get('input[type="search"]').should('have.value', 'luke');
  });

  it('navigue vers un detail de ressource', () => {
    cy.visit('/films');
    cy.get('.record-card').first().click();
    cy.url().should('match', /\/films\//);
  });
});
