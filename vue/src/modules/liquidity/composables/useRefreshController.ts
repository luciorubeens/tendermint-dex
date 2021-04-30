import { computed } from 'vue'
import { useStore } from 'vuex'

export function useRefreshController() {
	const store = useStore()
	const refreshSignal = computed(() => store.state.refreshCount)

	const refresh = () => store.dispatch('refresh')

	return {
		refreshSignal,
		refresh
	}
}
