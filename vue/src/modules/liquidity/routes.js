import CreatePool from './views/CreatePool'
import Pools from './views/Pools'
import Pool from './views/Pool'

export default [
	{
		path: '/liquidity/pools/create',
		component: CreatePool
	},
	{
		name: 'liquidity-pool',
		path: '/liquidity/pools/:id',
		component: Pool
	},
	{
		path: '/liquidity',
		component: Pools
	}
]
