/// <reference types="Cypress" />

describe('Central de Atendimento ao Cliente TAT', function() {
    beforeEach(function() {
        cy.visit('./src/index.html')
    })

    it('verifica o título da aplicação', function() {
        cy.title().should('be.equal', 'Central de Atendimento ao Cliente TAT')
    })

    it('preenche os campos obrigatórios e envia o formulário', function(){
        const longtext = 'Teste Teste Teste Teste Teste Teste Teste Teste Teste Teste Teste Teste Teste Teste Teste Teste Teste Teste Teste Teste'

        cy.get('#firstName').type('Ana')
        cy.get('#lastName').type('Souza')
        cy.get('#email').type('ana.silveira@dentalspeed.com')
        cy.get('#open-text-area').type(longtext, {delay: 0})
        cy.contains('button', 'Enviar').click()
        
        cy.get('.success').should('be.visible')
    })

    it('exibe mensagem de erro ao submeter o formulário com um email com formatação inválida', function(){
        cy.get('#firstName').type('Ana')
        cy.get('#lastName').type('Souza')
        cy.get('#email').type('ana.silveira@dentalspeed,com') // email com formatação errada
        cy.get('#open-text-area').type('teste', {delay: 0})
        cy.contains('button', 'Enviar').click()
        
        cy.get('.error').should('be.visible')
    })

    it('campo de telefone continua vazio ao digitar valor não numérico', function(){
        cy.get('#phone').type('abcd').should('have.text', '')
    })

    it('exibe mensagem de erro quando o telefone se torna obrigatório mas não é preenchido antes do envio do formulário', function(){
        cy.get('#firstName').type('Ana')
        cy.get('#lastName').type('Souza')
        cy.get('#email').type('ana.silveira@dentalspeed.com')
        cy.get('#phone-checkbox').click()
        cy.get('#open-text-area').type('teste')
        cy.contains('button', 'Enviar').click()
        
        cy.get('.error').should('be.visible')
    })

    it('preenche e limpa os campos nome, sobrenome, email e telefone', function(){
        cy.get('#firstName').type('Ana').should('have.value', 'Ana').clear().should('have.value', '')
        cy.get('#lastName').type('Souza').should('have.value', 'Souza').clear().should('have.value', '')
        cy.get('#email').type('ana.silveira@dentalspeed.com').should('have.value', 'ana.silveira@dentalspeed.com').clear().should('have.value', '')
        cy.get('#phone-checkbox').click()
        cy.get('#phone').type('489999999').should('have.value', '489999999').clear().should('have.value', '')
        cy.contains('button', 'Enviar').click()
    })

    it('exibe mensagem de erro ao submeter o formulário sem preencher os campos obrigatórios', function(){
        cy.contains('button', 'Enviar').click()
        cy.get('.error').should('be.visible')
    })

    it('envia o formulário com sucesso usando um comando customizado', function(){
        cy.fillMandatoryFieldsAndSubmit() // criou um comando personalizado que está em cypress > support > commands.js
        
        cy.get('.success').should('be.visible')
    })

    // Seção 4

    it('sleciona um produto (Youtube) por seu texto', function(){
        cy.get('#product').select('YouTube').should('have.value', 'youtube')
    })

    it('seleciona um produto (Mentoria) por seu valor (value)', function(){
        cy.get('#product').select('mentoria').should('have.value', 'mentoria')
    })

    it('seleciona um produto (Blog) por seu índice', function(){
        cy.get('#product').select(1).should('have.value', 'blog')
    })

    // Seção 5

    it('marca o tipo de atendimento "Feedback"', function(){
        cy.get('input[type="radio"][value="feedback"]').check().should('have.value', 'feedback')
    })

    it('marca cada tipo de atendimento', function(){
        cy.get('input[type="radio"]').should('have.length', 3).each(function($radio){
            cy.wrap($radio).check()
            cy.wrap($radio).should('be.checked')
        })
    })

    //seção 6

    it('marca ambos checkboxes, depois desmarca o último', function(){
        cy.get('#check input[type="checkbox"]').check().each(checkbox => { 
            expect(checkbox[0].checked).to.equal(true)
        }).last().uncheck().should('not.be.checked')
    })

    it('exibe mensagem de erro quando o telefone se torna obrigatório mas não é preenchido antes do envio do formulário - com check', function(){
        cy.get('#firstName').type('Ana')
        cy.get('#lastName').type('Souza')
        cy.get('#email').type('ana.silveira@dentalspeed.com')
        cy.get('#phone-checkbox').check().should('be.checked')
        cy.get('#open-text-area').type('teste')
        cy.contains('button', 'Enviar').click()
        
        cy.get('.error').should('be.visible')
    })

    //seção 7
    it('Seleciona um arquivo da pastas fixtures', function(){
        cy.get('input[type="file"]').should('not.have.value')
          .selectFile('cypress/fixtures/example.json').should(function($input){
            expect($input[0].files[0].name).to.equal('example.json')
          })
    })

    it.only('seleciona um arquivo simulando um drag-and-drop', function(){
        cy.get('input[type="file"]', {action: 'drag-drop'})
          .should('not.have.value')
        .selectFile('cypress/fixtures/example.json').should(input => {
            expect(input[0].files[0].name).to.equal('example.json')
          })
          
    })
    

  })


