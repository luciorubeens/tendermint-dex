import { computed } from "vue";
import { useStore } from "vuex";
import { QueryLiquidityParamsResponse } from "../types";
import { usePromise } from "./usePromise";

export function useLiquidityParams() {
	const store = useStore()
	const liquidityParams = computed<QueryLiquidityParamsResponse | undefined>(() => store.getters['tendermint.liquidity.v1beta1/getParams']()?.params)

	const { isPending, execute  } = usePromise(() => store.dispatch('tendermint.liquidity.v1beta1/QueryParams', { all: true }), { immediate: true })

	return {
		liquidityParams,
		isPending,
		fetchParams: execute
	};
}
