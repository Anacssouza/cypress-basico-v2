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

    it('seleciona um produto (Youtube) por seu texto', function(){
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

    it('seleciona um arquivo simulando um drag-and-drop', function(){
        cy.get('input[type="file"]', {action: 'drag-drop'})
          .should('not.have.value')
        .selectFile('cypress/fixtures/example.json').should(input => {
            expect(input[0].files[0].name).to.equal('example.json')
          })
    })

    it('seleciona um arquivo utilizando uma fixture para a qual foi dada um alias', function(){
        cy.fixture('example.json').as('exampleFile')
        cy.get('input[type="file"]').should('not.have.value')
          .selectFile('@exampleFile').should(function($input){
            expect($input[0].files[0].name).to.equal('example.json')
        })
    })

    // seção 8
    it('verifica que a política de privacidade abre em outra aba sem a necessidade de um clique', function(){
        cy.get('#privacy a').should('have.attr', 'target', '_blank')
    })
  
    it('acessa a página da política de privacidade removendo o target e então clicando no link', function(){
        cy.get('#privacy a').invoke('removeAttr', 'target').click()

        cy.contains('CAC TAT - Política de privacidade').should('be.visible')
    })

    // exercício extra 2 ta no privacy.spec.JS

    // seção 9 - testando em dispositivos móveis

    /*
     * Nessa seção foi adicionado no package.json um novo comando que altera a altura e a largura da visualização, simulando um mobile
     * 
     * adicionado no package.json o comando --> "cy:open:mobile": "cypress open --config viewportWidth=410 viewportHeight=860" <-- em scripts
     * 
     * todos os testes já criados são feitos normalmente, porém em um tamanho de tela diferente
     * 
     */

    /*
    * Outro ponto ensinado nessa seção foi como rodar o cypress em modo headless, ou seja, "por trás dos panos", aparecendo os resultados somente no terminal e não naquela telinha.
    * 
    * Para rodar em modo headless na visualização do tamanho de desktop normal é só colocar no terminal --> npm run test <-- que está definido em package.json
    * 
    * Rodando nesse modo, ele também cria automaticamente uma nova pasta de videos e um video de todo o teste rodando, sendo que quando acontece um erro ele tira uma print da tela e cria outra pasta chamada screenshots com a evidência do erro
    * 
    * Para rodar em modo headless na visualização mobile é só colocar no terminal --> npm run test:mobile <-- que está definido em package.json
    * 
    */

    // seção 10 - documentação do projeto

    /**
     * Criado o arquivo __intro.md pros textos referentes a introdução do curso que estavam no readme
     * 
     * Adicionada  a documentação básica no arquivo readme.md
     */


    // Seção 11 - 
    /**
     *  links úteis -> https://docs.cypress.io/guides/continuous-integration/github-actions#Cypress-GitHub-Action
     *              -> https://github.com/cypress-io/github-action
     * 
     * 
     *  Foi criado o diretório github e o subdiretório workflows. Dentro do diretório workflows foi criado o arquivo main.yml 
     */

    

})