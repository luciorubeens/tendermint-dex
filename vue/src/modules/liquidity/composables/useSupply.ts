import { computed } from 'vue'
import { useStore } from 'vuex'
import { QueryBankSupplyResponse } from '../interfaces'

export function useSupply() {
	const store = useStore()

	const tokenSupplies = computed<QueryBankSupplyResponse>(() =>
		store.getters['cosmos.bank.v1beta1/getTotalSupply']()
	)

	const findSupplyByDenom = (denom: string) =>
		tokenSupplies.value.supply.find((token) => token.denom === denom)?.amount

	const updateSupplies = () =>
		store.dispatch('cosmos.bank.v1beta1/QueryTotalSupply', { all: true })

	return {
		updateSupplies,
		findSupplyByDenom
	}
}
