import { computed, ComputedRef, unref, watch } from 'vue'
import { useStore } from 'vuex'

export function useBank({
	address
}: {
	address: string | ComputedRef<string>
}) {
	const store = useStore()

	const allBalances = computed<{ denom: string; amount: string }[]>(
		() =>
			store.getters['cosmos.bank.v1beta1/getAllBalances']({
				params: { address: unref(address) }
			})?.balances ?? []
	)

	const balanceByDenom = (denom: string) =>
		computed(
			() => allBalances.value.find((item) => item.denom === denom)?.amount
		)

	const updateBalances = () => {
		if (unref(address)) {
			store.dispatch('cosmos.bank.v1beta1/QueryAllBalances', {
				params: { address: unref(address) },
				options: { all: true, subscribe: false }
			})
		}
	}

	watch(() => address, updateBalances, { immediate: true })

	return { allBalances, balanceByDenom, updateBalances }
}
