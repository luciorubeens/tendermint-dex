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
