export type { Transactions, RawTransactionResponse } from '@starport/vue/src/utils/interfaces'

export interface Coin {
	denom: string
	amount: string
}

export interface TokenPair {
	tokenA: Coin
	tokenB: Coin
}

export interface QueryLiquidityParamsResponse {
	init_pool_coin_mint_amount: string
	max_order_amount_ratio: string
	max_reserve_coin_amount: string
	min_init_deposit_amount: string
	pool_creation_fee: Coin[]
	swap_fee_rate: string
	unit_batch_height: number
	withdraw_fee_rate: string
}

export interface QueryBankSupplyResponse {
	supply: Coin[]
}

export interface PoolResponse {
	id: string,
	type_id: number;
	reserve_coin_denoms: string[],
	reserve_account_address: string,
	pool_coin_denom: string
}

export type PoolWithMeta = {
	meta: {
		name: string,
		supplyAmount?: string
	}
} & PoolResponse

export interface QueryLiquidityPoolsResponse {
	pools: PoolResponse[]
}
