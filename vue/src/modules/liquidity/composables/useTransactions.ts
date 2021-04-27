import { computed, ComputedRef, unref, watch } from 'vue'
import { useStore } from 'vuex'
import { usePromise } from './usePromise'
import { useRefreshController } from './useRefreshController';

export function useTransactions<T>({
	query
}: {
	query: Record<string, string> | ComputedRef<Record<string, string>>
}) {
	const store = useStore()
	const { signal } = useRefreshController();

	const eventParams = computed(() => {
		const params = new URLSearchParams()
		for (const [key, value] of Object.entries(unref(query))) {
			params.set(key, value);
		}
		return encodeURIComponent(params.toString())
	})

	const promise = usePromise(
		async () => {
			await store.dispatch('common/transfers/ServiceGetTxsEvent', {
				subscribe: false,
				event: eventParams.value
			})
			return store.getters['common/transfers/getGetTxsEvent']({ event: eventParams.value })
		},
		{ immediate: true }
	)

	watch(signal, promise.execute)

	return promise
}
