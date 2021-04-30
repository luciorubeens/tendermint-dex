describe('View Pools List', () => {
	beforeEach(() => {
		cy.visit('/liquidity/pools/1')
	})

	it('should show pool name', () => {
		cy.get('.sp-component-title h3').should('contains.text', 'Pair UREGEN-XRUN')
	})

	it('should list transactions', () => {
		// TODO: Mock transactions request
		cy.get('.transaction-table__table')
			.find('tr')
			.its('length')
			.should('be.gte', 1)
	})

	it('should filter transactions', () => {
		cy.get('.transaction-table__nav__item').eq(0).should('have.text', 'deposit')
		cy.get('.transaction-table__nav__item')
			.eq(1)
			.should('have.text', 'withdraw')

		cy.wait(1000)
		cy.get('.transaction-table__nav__item')
			.eq(2)
			.should('have.text', 'swap')
			.click()
	})
})
