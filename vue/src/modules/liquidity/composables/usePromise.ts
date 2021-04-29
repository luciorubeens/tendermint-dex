import { ref, watch } from 'vue'

type OptionsProps = { lazy?: boolean, once?: boolean }

export function usePromise<T = any>(
	promise: () => Promise<T>,
	options?: OptionsProps
) {
	const isFinished = ref(false)
	const hasExecuted = ref(false)
	const isPending = ref(false)
	const error = ref<string | undefined>()
	const data = ref<T | undefined>()

	const execute = () => {
		hasExecuted.value = true;
		isPending.value = true
		isFinished.value = false
		error.value = undefined

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
			if (options?.lazy) {
				return;
			}

			if (options?.once && hasExecuted.value) {
				return;
			}

			execute()
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
