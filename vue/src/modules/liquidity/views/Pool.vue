<template>
	<div class="container">
		<div v-if="isPending">
			<span>Loading...</span>
		</div>

		<div v-else-if="error">
			<span>{{ error }}</span>
		</div>

		<div v-else-if="!pool">
			<span>Failed to find the pool #{{ poolId }}</span>
		</div>

		<div v-else>
			<div>
				<h1>Pair {{ pool.name }}</h1>

				<div v-if="isLoggedIn">
					<h4>My Balances</h4>
					{{walletPoolBalance}}
				</div>

				<div>
					<h4>Deposit</h4>
					<DepositForm :denoms="pool.reserve_coin_denoms" :poolId="pool.id" @success="updateBalances" />
				</div>

				<div>
					<h4>Withdraw</h4>
					<WithdrawForm :poolId="pool.id" @success="updateBalances" />
				</div>
			</div>
		</div>
	</div>
</template>

<script lang="ts">
import { defineComponent, computed } from 'vue'
import { useRoute } from 'vue-router'
import { useBank, useLiquidityPools, useWallet } from '../composables'
import DepositForm from '../components/DepositForm'
import WithdrawForm from '../components/WithdrawForm'

export default defineComponent({
	name: 'Pool',

	components: {
		DepositForm,
		WithdrawForm
	},

	setup() {
		const route = useRoute()

		const { address, isLoggedIn } = useWallet()
		const { balanceByDenom, updateBalances } = useBank({ address })
		const { isPending, error, findPoolById } = useLiquidityPools()

		const poolId = computed(() => route.params.id as string)

		const pool = findPoolById(poolId)
		const walletPoolBalance = balanceByDenom(pool.value?.pool_coin_denom)

		return {
			updateBalances,
			walletPoolBalance,
			poolId,
			pool,
			isLoggedIn,
			isPending,
			error
		}
	}
})
</script>
