import CreatePool from './views/CreatePool'
import Pools from './views/Pools'
import Pool from './views/Pool'

export default [
	{
		path: '/liquidity/pools/create',
		component: CreatePool
	},
	{
		path: '/liquidity/pool/:id',
		component: Pool
	},
	{
		path: '/liquidity/pools',
		component: Pools
	},
]
