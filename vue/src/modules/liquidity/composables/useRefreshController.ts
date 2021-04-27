import { computed, watch } from "vue";
import { useStore } from "vuex";

export function useRefreshController() {
	const store = useStore()
	const signal = computed(() => store.state.refreshCount)

	const refresh = () => store.dispatch('refresh')

	return {
		signal,
		refresh
	}
}
