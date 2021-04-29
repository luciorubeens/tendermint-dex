import { computed, ComputedRef, unref, watch } from 'vue'
import { useStore } from 'vuex'
import { usePromise } from './usePromise'
import { useRefreshController } from './useRefreshController'
import { Transactions } from '../interfaces'

type Props = {
	query: Record<string, string> | ComputedRef<Record<string, string>>
}

export function useTransactions({ query }: Props) {
	const store = useStore()
	const { signal } = useRefreshController()

	const eventParams = computed(() => {
		const params = new URLSearchParams()
		for (const [key, value] of Object.entries(unref(query))) {
			params.set(key, value)
		}
		return encodeURIComponent(params.toString())
	})

	const fetchTransactions = async (): Promise<Transactions> => {
		await store.dispatch('common/transfers/ServiceGetTxsEvent', {
			subscribe: false,
			event: eventParams.value
		})
		return store.getters['common/transfers/getGetTxsEvent']({
			event: eventParams.value
		})
	}

	const promise = usePromise(fetchTransactions)

	watch(signal, promise.execute)

	return promise
}
