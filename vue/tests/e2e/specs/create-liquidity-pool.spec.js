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

	it('should show error message if amount is below the mininum deposit', () => {
		cy.get('.create-pool').should(
			'contains.text',
			'Access a wallet to create a pool'
		)

		cy.importWallet()

		cy.inputTokenPair([
			{ denom: 'UATOM', amount: '100' },
			{ denom: 'UBAND', amount: '200' }
		])

		cy.get('.create-pool__form__submit').click()

		cy.get('.create-pool .alert--error').should(
			'contains.text',
			'You should deposit a minimum initial amount of 1000000 tokens.'
		)
	})

	it('should show error message if pair already exists', () => {
		cy.get('.create-pool').should(
			'contains.text',
			'Access a wallet to create a pool'
		)

		cy.importWallet()

		cy.inputTokenPair([
			{ denom: 'UATOM', amount: '1000000' },
			{ denom: 'UBAND', amount: '1000000' }
		])

		cy.get('.create-pool__form__submit').click()

		cy.get('.create-pool .alert--error').should(
			'contains.text',
			'A pool with this pair already exists.'
		)
	})
})
