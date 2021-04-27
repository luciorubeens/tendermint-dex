import { computed, onMounted } from "vue";
import { useStore } from "vuex";
import { usePromise } from "./usePromise";

export function useLiquidityParams() {
	const store = useStore()
	const liquidityParams = computed(() => store.getters['tendermint.liquidity.v1beta1/getParams'])

	const { isPending, execute } = usePromise(() => store.dispatch('tendermint.liquidity.v1beta1/QueryParams'), { immediate: true })

	return {
		liquidityParams,
		isPending,
		fetchParams: execute
	};
}
