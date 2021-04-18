import CreatePool from './views/CreatePool'
import Deposit from './views/Deposit'
import Pools from './views/Pools'

export default [
	{
		path: '/liquidity/deposit',
		component: Deposit
	},
	{
		path: '/liquidity/pools/create',
		component: CreatePool
	},
	{
		path: '/liquidity/pools',
		component: Pools
	},
]
