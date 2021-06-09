import CreatePool from './views/CreatePool'
import Pools from './views/Pools'
import Pool from './views/Pool'

export default [
	{
		name: 'liquidity-create',
		path: '/liquidity/pools/create',
		component: CreatePool
	},
	{
		name: 'liquidity-pool',
		path: '/liquidity/pools/:id',
		component: Pool
	},
	{
		name: 'liquidity',
		path: '/liquidity',
		component: Pools
	}
]
