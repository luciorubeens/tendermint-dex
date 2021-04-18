import CreatePool from './views/CreatePool'
import Pools from './views/Pools'

export default [
	{
		path: '/liquidity/pools/create',
		component: CreatePool
	},
	{
		path: '/liquidity/pools',
		component: Pools
	}
]
