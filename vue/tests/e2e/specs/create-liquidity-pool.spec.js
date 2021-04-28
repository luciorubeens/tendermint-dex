// https://docs.cypress.io/api/introduction/api.html

describe('Create Liquidity Pool', () => {
	beforeEach(() => {
		cy.visit('/liquidity/pools/create')
	})

	it('should show message if unauthenticated', () => {
		cy.get('.create-pool').should('contains.text', 'Access a wallet to create a pool')
	})

	it('should show form if authenticated', () => {
		cy.get('.create-pool').should('contains.text', 'Access a wallet to create a pool')
		cy.get('.sp-wallet .sp-button__text').contains('Access wallet').click()

		cy.contains('h3', 'Access wallet')
		cy.get('.sp-wallet-create__cards .sp-card').eq(1).click()

		cy.contains('h3', 'Import existing wallet')
		cy.get('.sp-wallet .sp-key-area').first().type('improve depth vanish view ripple illness welcome lake swift cigar interest canoe certain garage mix horn dumb airport exchange magic early raccoon airport release')
		// cy.get('.sp-wallet .sp-key-area').first().type('galaxy fossil teach soul canoe pioneer trip hotel attract endless traffic forward vault enter before ivory candy solar blade permit frost mansion muscle gasp')

		cy.get('.sp-wallet .sp-button').contains('Next').should('not.be.disabled')
		cy.get('.sp-wallet .sp-button').contains('Next').click()

		cy.get('.sp-wallet .sp-wallet-create__form .sp-input').first().type('Test')
		cy.get('.sp-wallet .sp-input[name=password]').first().type('1234')
		cy.get('.sp-wallet .sp-input[name=confirm]').first().type('1234')

		cy.get('.sp-wallet .sp-button').contains('Done').should('not.be.disabled')
		cy.get('.sp-wallet .sp-button').contains('Done').click()

		cy.get('.create-pool .input-token-pair').should('be.visible')
		cy.get('.create-pool__form__submit').should('be.visible')
	})

	it('should show error message if amount is below mininum deposit', () => {
		cy.get('.create-pool').should('contains.text', 'Access a wallet to create a pool')

		// TODO
	})
})
