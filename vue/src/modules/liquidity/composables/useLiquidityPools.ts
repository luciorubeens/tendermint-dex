import { computed, ComputedRef, ref, unref, watch } from 'vue'
import { useStore } from 'vuex'
import { PoolWithMeta, QueryLiquidityPoolsResponse } from '../interfaces'
import { usePromise } from './usePromise'
import { useSupply } from './useSupply'

const formatPoolName = (denoms: string[]) => denoms.join('-').toUpperCase()

export function useLiquidityPools() {
	const store = useStore()
	const { findSupplyByDenom } = useSupply()

	const fetchLiquidityPools = () => {
		return store.dispatch('tendermint.liquidity.v1beta1/QueryLiquidityPools', {
			all: true
		})
	}

	const promise = usePromise(fetchLiquidityPools)

	/*
	 * Format pools response to include utilities fields like `name` and `supplyAmount`
	 */
	const pools = computed<PoolWithMeta[]>(() => {
		const poolsData: QueryLiquidityPoolsResponse = store.getters[
			'tendermint.liquidity.v1beta1/getLiquidityPools'
		]()

		if (!poolsData.pools) {
			return []
		}

		return poolsData.pools.map((pool) => {
			const supplyAmount = findSupplyByDenom(pool.pool_coin_denom)
			const name = formatPoolName(pool.reserve_coin_denoms)

			return {
				meta: {
					name,
					supplyAmount
				},
				...pool
			}
		})
	})

	const findPoolById = (id: string | ComputedRef<string>) =>
		computed(() => pools.value.find((item) => item.id === unref(id)))


	const findPoolByDenoms = (denoms: string[]) =>
		pools.value.find(
			(item) => item.reserve_coin_denoms.sort().join() === denoms.sort().join()
		)

	return {
		...promise,
		pools,
		findPoolById,
		findPoolByDenoms
	}
}
