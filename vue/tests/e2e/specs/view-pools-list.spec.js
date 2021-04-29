describe('View Pools List', () => {
	beforeEach(() => {
		cy.visit('/liquidity')
	})

	it('should navigate to pools by sidebar', () => {
		cy.visit('/')
		cy.get('.sp-sidebar .sp-link-icon').eq(3).contains('Liquidity').click({force: true})
		cy.get('.pools__holder').should('be.visible')
	})

	it('should show available pools table', () => {
		cy.get('.pools__table').find('tr').its('length').should('be.gte', 4)
	})

	it('should navigate to pool creation', () => {
		cy.get('.pools__header__create-button').click()
		cy.get('.create-pool').should('be.visible')
	})

	it('should navigate to pool details', () => {
		cy.get('.pools__table')
			.find('td.pools__table__details')
			.first()
			.find('a')
			.click()

		cy.get('.pool__holder').should('be.visible')
	})
})
