import { computed, ref, watch } from 'vue'
import { useStore } from 'vuex'
import { usePromise } from './usePromise'
import { useSupply } from './useSupply'

const formatPoolName = (denoms: string[]) => denoms.join('-').toUpperCase()

export function useLiquidityPools() {
	const store = useStore()
	const { findSupplyByDenom } = useSupply()

	const initialized = ref(false)

	const { isPending, isFinished, error, execute } = usePromise(
		() =>
			store.dispatch('tendermint.liquidity.v1beta1/QueryLiquidityPools', {
				all: true
			}),
		{
			immediate: false
		}
	)

	const pools = computed(() => {
		const poolsData: { pools: any[] } = store.getters[
			'tendermint.liquidity.v1beta1/getLiquidityPools'
		]()

		if (!poolsData.pools) {
			return []
		}

		return poolsData.pools.map((pool) => {
			const supplyAmount = findSupplyByDenom(pool.pool_coin_denom)
			const name = formatPoolName(pool.reserve_coin_denoms)

			return {
				name,
				supplyAmount,
				...pool
			}
		})
	})

	watch(isPending, () => (initialized.value = true))

	watch(
		pools,
		() => {
			if (!pools.value.length && !initialized.value) {
				execute()
			}
		},
		{ immediate: true }
	)

	return {
		isFinished,
		isPending,
		error,
		pools
	}
}
