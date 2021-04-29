// https://docs.cypress.io/api/introduction/api.html

describe('Create Liquidity Pool', () => {
	beforeEach(() => {
		cy.visit('/liquidity/pools/create')
	})

	it('should show message if unauthenticated', () => {
		cy.get('.create-pool').should(
			'contains.text',
			'Access a wallet to create a pool'
		)
	})

	it('should show form if authenticated', () => {
		cy.get('.create-pool').should(
			'contains.text',
			'Access a wallet to create a pool'
		)

		cy.importWallet()

		cy.get('.create-pool .input-token-pair').should('be.visible')
		cy.get('.create-pool__form__submit').should('be.visible')
	})

	it('should show error message if amount is below mininum deposit', () => {
		cy.get('.create-pool').should(
			'contains.text',
			'Access a wallet to create a pool'
		)

		cy.importWallet()

		// TODO:
	})
})
