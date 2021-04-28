import { reactive } from 'vue'
import { useBank } from './useBank'
import { useLiquidityPools } from './useLiquidityPools'

import BigNumber from 'bignumber.js'

export function usePool({ poolId }: { poolId: string }) {
	const { findPoolById } = useLiquidityPools()

	const pool = findPoolById(poolId)

	const { allBalances } = useBank({
		address: pool.value.reserve_account_address
	})

	const reserveBalances = reactive({
		tokenA: allBalances.value[0],
		tokenB: allBalances.value[1]
	})

	const calculateShares = ({
		amount,
		supplyAmount
	}: {
		amount: string
		supplyAmount: string
	}) => {
		const result = {
			tokenA: { denom: reserveBalances.tokenA.denom, amount: '0' },
			tokenB: { denom: reserveBalances.tokenB.denom, amount: '0' }
		}

		const sharesPercentage = new BigNumber(amount).dividedBy(
			supplyAmount ?? pool.value.supplyAmount
		)

		result.tokenA.amount = sharesPercentage
			.multipliedBy(reserveBalances.tokenA.amount)
			.toString()
		result.tokenB.amount = sharesPercentage
			.multipliedBy(reserveBalances.tokenB.amount)
			.toString()

		return {
			...result,
			sharesPercentage: sharesPercentage.decimalPlaces(4).toString()
		}
	}

	return { pool, reserveBalances, calculateShares }
}
