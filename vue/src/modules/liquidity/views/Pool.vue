<template>
	<div class="container">
		<div class="pool__holder">
			<div class="pool__wrapper">
				<template v-if="!pool && isPending"> Loading... </template>

				<template v-else-if="error"> Not found </template>

				<template v-else>
					<div class="pool__wrapper__container">
						<div class="sp-component-title">
							<h3 class="truncate">Pair {{ pool.meta.name }}</h3>
						</div>

						<dl class="pool__stats sp-box sp-shadow">
							<div class="pool__stats__item pool__stats__wallet" v-if="isLoggedIn">
								<dd>{{ walletPoolBalance }}</dd>
								<dt>Your balance</dt>
							</div>

							<div class="pool__stats__item pool__stats__wallet" v-if="isLoggedIn">
								<dd>{{ shares || "0" }}%</dd>
								<dt>Your share</dt>
							</div>

							<div class="pool__stats__item" v-if="reserveBalances[0]">
								<dd class="pool__stats__reserve">
									<span>{{ reserveBalances[0].amount }}{{ reserveBalances[0].denom }}</span>
									<span>{{ reserveBalances[1].amount }}{{ reserveBalances[1].denom }}</span>
								</dd>
								<dt>Reserve balance</dt>
							</div>

							<div class="pool__stats__item">
								<dd>{{ poolSupply }}</dd>
								<dt>Supply</dt>
							</div>
						</dl>

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
				</template>
			</div>
		</div>
	</div>
</template>

<script lang="ts">
import { defineComponent, computed, watch, ref } from 'vue'
import { useRoute } from 'vue-router'
import { useBank, usePool, useSupply, useWallet } from '../composables'
import { useRefreshController } from '../composables/useRefreshController'

import DepositForm from '../components/DepositForm'
import WithdrawForm from '../components/WithdrawForm'
import TransactionTable from '../components/TransactionTable'
import SwapForm from '../components/SwapForm'
import BigNumber from 'bignumber.js'

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
		const { refreshSignal, refresh } = useRefreshController()
		const { updateSupplies, findSupplyByDenom } = useSupply()

		const poolId = computed(() => route.params.id as string)
		const { isPending, pool, error, reserveBalances, calculateShares } = usePool({ poolId: poolId.value })

		const walletPoolBalance = computed(() => {
			if (!pool.value) {
				return '0'
			}
			return balanceByDenom(pool.value.pool_coin_denom).value || "0"
		})

		const poolSupply = computed(() => {
			if (!pool.value) {
				return '0'
			}
			return findSupplyByDenom(pool.value.pool_coin_denom)
		})

		const shares = computed(() => {
			if (!pool.value) {
				return '0'
			}
			// @ts-ignore
			const valueString = calculateShares({ amount: walletPoolBalance.value })?.percentage
			return valueString ? new BigNumber(valueString).multipliedBy(100).decimalPlaces(4).toString() : "0"
		})

		watch(refreshSignal, () => {
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
			error,
			poolSupply,
			shares,
			reserveBalances: computed(() => Object.values(reserveBalances.value || {}))
		}
	}
})
</script>

<style scoped>
.pool__wrapper {
	display: flex;
	margin-bottom: 2rem;
}
.pool__stats {
	display: flex;
	justify-content: center;
}
.pool__stats__reserve {
	display: flex;
	flex-direction: column;
}
.pool__stats__item {
	display: flex;
	flex-direction: column;
	justify-content: center;
	align-items: center;
	margin-right: 2rem;
}
.pool__stats__item dt {
	margin-top: 0.5rem;
	font-size: 1.5rem;
	font-weight: 500;
	opacity: .7;
}
.pool__stats__item dd {
	flex: 1 1 0%;
	margin: 0;
	font-size: 2rem;
	font-weight: 700;
	text-align: center;
	display: flex;
	align-items: center;
}
.pool__wrapper__container {
	flex: 1 1 0%;
	margin-right: 4rem;
}
.pool__wrapper__actions {
	width: 30%;
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
