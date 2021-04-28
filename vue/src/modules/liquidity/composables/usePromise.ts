import { ref, watch } from 'vue'

export function usePromise<T = any>(
	promise: () => Promise<T>,
	{ immediate = true }: { immediate?: boolean } = {}
) {
	const isFinished = ref(false)
	const isPending = ref(false)
	const error = ref<any>()
	const data = ref<T | undefined>()

	const execute = () => {
		isPending.value = true
		isFinished.value = true
		error.value = null

		promise()
			.then((response) => {
				data.value = response
			})
			.catch((promiseError) => {
				error.value = promiseError.message
			})
			.finally(() => {
				isPending.value = false
				isFinished.value = true
			})
	}

	watch(
		() => promise,
		() => {
			if (immediate) {
				execute()
			}
		},
		{ immediate: true }
	)

	return {
		isFinished,
		isPending,
		error,
		data,
		execute
	}
}
