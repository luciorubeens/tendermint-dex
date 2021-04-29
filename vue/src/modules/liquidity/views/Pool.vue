<template>
	<div class="container">
		<div class="pool__holder">
			<div class="pool__wrapper">
				<div class="pool__wrapper__container">
					<div class="sp-component-title">
						<h3>Pair {{ pool.meta.name }}</h3>
					</div>

					<div class="pool__stats sp-box sp-shadow">
						<div v-if="isLoggedIn">
							<h4>My Balances</h4>
							{{ walletPoolBalance }}
						</div>
						Stats
					</div>

					<div class="pool__transactions">
						<div class="sp-component-title">
							<h3>Transactions</h3>
							<span>|</span>
							<span>A list of recent transactions</span>
						</div>

						<div class="sp-box sp-shadow">
							<TransactionTable :pool-id="pool.id" />
						</div>
					</div>
				</div>

				<div class="pool__wrapper__actions">
					<div class="pool__swap">
						<div class="sp-component-title">
							<h3>Swap</h3>
						</div>

						<div class="sp-box sp-shadow">
							<SwapForm
								:denoms="pool.reserve_coin_denoms"
								:pool-id="pool.id"
								@success="refresh"
							/>
						</div>
					</div>

					<div class="pool__deposit">
						<div class="sp-component-title">
							<h3>Deposit</h3>
						</div>

						<div class="sp-box sp-shadow">
							<DepositForm
								:denoms="pool.reserve_coin_denoms"
								:pool-id="pool.id"
								@success="refresh"
							/>
						</div>
					</div>

					<div class="pool__withdraw">
						<div class="sp-component-title">
							<h3>Withdraw</h3>
						</div>

						<div class="sp-box sp-shadow">
							<WithdrawForm :pool-id="pool.id" @success="refresh" />
						</div>
					</div>
				</div>
			</div>
		</div>
	</div>
</template>

<script lang="ts">
import { defineComponent, computed, watch, ref } from 'vue'
import { useRoute } from 'vue-router'
import {
	useBank,
	useLiquidityPools,
	useSupply,
	useWallet
} from '../composables'
import { useRefreshController } from '../composables/useRefreshController'

import DepositForm from '../components/DepositForm'
import WithdrawForm from '../components/WithdrawForm'
import TransactionTable from '../components/TransactionTable'
import SwapForm from '../components/SwapForm'

export default defineComponent({
	name: 'Pool',

	components: {
		DepositForm,
		WithdrawForm,
		TransactionTable,
		SwapForm
	},

	setup() {
		const route = useRoute()
		const activeTab = ref<string>('deposit')
		const setActiveTab = (tab: string) => (activeTab.value = tab)

		const { address, isLoggedIn } = useWallet()
		const { balanceByDenom, updateBalances } = useBank({ address })
		const { isPending, error, findPoolById } = useLiquidityPools()
		const { signal, refresh } = useRefreshController()
		const { updateSupplies } = useSupply()

		const poolId = computed(() => route.params.id as string)

		const pool = findPoolById(poolId)
		const walletPoolBalance = balanceByDenom(pool.value!.pool_coin_denom)

		watch(signal, () => {
			updateBalances()
			updateSupplies()
		})

		return {
			activeTab,
			setActiveTab,
			refresh,
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

<style scoped>
.pool__wrapper {
	display: flex;
}
.pool__wrapper__container {
	flex: 1 1 0%;
	margin-right: 4rem;
}
.pool__transactions {
	margin-top: 2rem;
}

.pool__deposit {
	margin-top: 2rem;
}

.pool__withdraw {
	margin-top: 2rem;
}
</style>
