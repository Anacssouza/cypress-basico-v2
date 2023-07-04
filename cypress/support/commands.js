Cypress.Commands.add('fillMandatoryFieldsAndSubmit', function(){
    cy.get('#firstName').type('Ana')
    cy.get('#lastName').type('Souza')
    cy.get('#email').type('ana.silveira@dentalspeed.com')
    cy.get('#open-text-area').type('teste')
    cy.contains('button', 'Enviar').click()
})