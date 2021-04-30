import { computed, reactive, watch } from 'vue'
import { useBank } from './useBank'
import { useLiquidityPools } from './useLiquidityPools'

import BigNumber from 'bignumber.js'

type Props = { poolId: string }

export function usePool({ poolId }: Props) {
	const { findPoolById, isPending, error } = useLiquidityPools()
	const pool = findPoolById(poolId)

	const { allBalances } = useBank({
		address: pool.value?.reserve_account_address || ''
	})

	const reserveBalances = computed(() => {
		if (!allBalances.value.length) {
			return undefined
		}
		return {
			[allBalances.value[0].denom]: allBalances.value[0],
			[allBalances.value[1].denom]: allBalances.value[1],
		}
	})

	const calculateShares = ({
		amount,
		supplyAmount
	}: {
		amount: string
		supplyAmount: string
	}) => {
		if (!allBalances.value.length) {
			return undefined
		}

		const denoms = Object.keys(reserveBalances.value!);
		const result = {
			[denoms[0]]: { denom: denoms[0], amount: '0' },
			[denoms[1]]: { denom: denoms[1], amount: '0' }
		}

		const sharesPercentage = new BigNumber(amount).dividedBy(
			supplyAmount || pool.value?.meta.supplyAmount || 0
		)

		result[denoms[0]].amount = sharesPercentage
			.multipliedBy(reserveBalances.value![denoms[0]].amount)
			.toString()

		result[denoms[1]].amount = sharesPercentage
			.multipliedBy(reserveBalances.value![denoms[1]].amount)
			.toString()

		return {
			...result,
			sharesPercentage: sharesPercentage.toString()
		}
	}

	return { isPending, error, pool, reserveBalances, calculateShares }
}
