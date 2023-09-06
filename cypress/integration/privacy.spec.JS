Cypress._.times(5 , () => {
    it.only('testa a página da política de privacidade de forma independente', function(){
        cy.visit('./src/privacy.html')

        cy.contains('CAC TAT - Política de privacidade').should('be.visible')
    })
})

// ._.times(num, função com caso de teste a se repetir) -> faz com que o teste ou o conteúdo que é passado como segundo parametro se repita o tanto de vezes que for passado como primeiro parametro. 