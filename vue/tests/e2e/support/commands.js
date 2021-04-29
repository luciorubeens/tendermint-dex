// ***********************************************
// This example commands.js shows you how to
// create various custom commands and overwrite
// existing commands.
//
// For more comprehensive examples of custom
// commands please read more here:
// https://on.cypress.io/custom-commands
// ***********************************************
//
//
// -- This is a parent command --
// Cypress.Commands.add("login", (email, password) => { ... })
//
//
// -- This is a child command --
// Cypress.Commands.add("drag", { prevSubject: 'element'}, (subject, options) => { ... })
//
//
// -- This is a dual command --
// Cypress.Commands.add("dismiss", { prevSubject: 'optional'}, (subject, options) => { ... })
//
//
// -- This is will overwrite an existing command --
// Cypress.Commands.overwrite("visit", (originalFn, url, options) => { ... })

const { defaults } = require("../helpers")

Cypress.Commands.add("importWallet", ({ mnemonic, name, password } = defaults) => {
	cy.get('.sp-wallet .sp-button__text').contains('Access wallet').click()

	cy.contains('h3', 'Access wallet')
	cy.get('.sp-wallet-create__cards .sp-card').eq(1).click()

	cy.contains('h3', 'Import existing wallet')
	cy.get('.sp-wallet .sp-key-area').first().type(mnemonic)

	cy.get('.sp-wallet .sp-button').contains('Next').should('not.be.disabled')
	cy.get('.sp-wallet .sp-button').contains('Next').click()

	cy.get('.sp-wallet .sp-wallet-create__form .sp-input').first().type(name)
	cy.get('.sp-wallet .sp-input[name=password]').first().type(password)
	cy.get('.sp-wallet .sp-input[name=confirm]').first().type(password)

	cy.get('.sp-wallet .sp-button').contains('Done').should('not.be.disabled')
	cy.get('.sp-wallet .sp-button').contains('Done').click()
})
