<template>
	<section class="transaction-table">
		<div class="transaction-table__nav">
			<button
				v-for="tab in tabs"
				:key="tab"
				:aria-selected="activeTab === tab"
				role="tab"
				class="transaction-table__nav__item"
				type="button"
				@click="setActiveTab(tab)"
			>
				{{ tab }}
			</button>
		</div>

		<template v-if="isPending"> Loading... </template>

		<template v-else-if="error">
			{{ error }}
		</template>

		<template v-else>
			<p class="transaction-table__empty-msg" v-if="!transactions.length">
				No {{ activeTab }} transactions found.
			</p>

			<table v-else class="transaction-table__table">
				<thead>
					<tr>
						<th>Action</th>
						<th>Account</th>
						<th class="transation-table__table__token">Token Amount</th>
						<th
							v-if="activeTab === 'deposit'"
							class="transation-table__table__token"
						>
							Token Amount
						</th>
						<th>Timestamp</th>
					</tr>
				</thead>

				<tbody>
					<tr v-for="transaction in transactions" :key="transaction">
						<td>
							{{ transaction.action }}
						</td>
						<td>
							{{ transaction.account }}
						</td>
						<td class="transation-table__table__token">
							<div>
								<span>{{ transaction.tokenA.amount }}</span>
								<span>{{ transaction.tokenA.denom }}</span>
							</div>
						</td>
						<td
							v-if="activeTab === 'deposit' && transaction.tokenB"
							class="transation-table__table__token"
						>
							<div>
								<span>{{ transaction.tokenB.amount }}</span>
								<span>{{ transaction.tokenB.denom }}</span>
							</div>
						</td>
						<td class="transation-table__table__timestamp">
							{{ transaction.timestamp }}
						</td>
					</tr>
				</tbody>
			</table>
		</template>
	</section>
</template>

<script lang="ts">
import { computed, defineComponent, ref } from 'vue'
import { usePool, useTransactions } from '../../composables'
import dayjs from 'dayjs'

const tabActionMap = {
	deposit: 'deposit_within_batch',
	withdraw: 'withdraw_within_batch',
	swap: 'swap_within_batch'
}

type TabActionType = keyof typeof tabActionMap

export default defineComponent({
	name: 'TransactionTable',

	props: {
		poolId: {
			required: true,
			type: String
		}
	},

	setup(props) {
		const activeTab = ref<TabActionType>('deposit')
		const setActiveTab = (tabId: TabActionType) => (activeTab.value = tabId)
		const tabs = computed(() => Object.keys(tabActionMap))

		const { pool } = usePool({ poolId: props.poolId })

		const query = computed(() => {
			return {
				[`${tabActionMap[activeTab.value]}.pool_id`]: pool.value!.id
			}
		})

		const { isPending, data, error } = useTransactions({ query })

		const formatRow = (transaction: any) => {
			const message = transaction.tx?.body?.messages?.[0]
			const txType = message?.['@type']

			const row: any = {
				height: transaction.height,
				timestamp: dayjs(transaction.timestamp).format('D MMM, YYYY h:mm A')
			}

			if (txType === '/tendermint.liquidity.v1beta1.MsgDepositWithinBatch') {
				row.action = 'Deposit'
				row.account = message?.depositor_address
				row.tokenA = message?.deposit_coins?.[0]
				row.tokenB = message?.deposit_coins?.[1]
			}

			if (txType === '/tendermint.liquidity.v1beta1.MsgWithdrawWithinBatch') {
				row.action = 'Withdraw'
				row.account = message?.withdrawer_address
				row.tokenA = {
					denom: pool.value!.meta.name,
					amount: message?.pool_coin?.amount
				}
			}

			if (txType === '/tendermint.liquidity.v1beta1.MsgSwapWithinBatch') {
				row.action = 'Swap'
				row.account = message?.swap_requester_address
				row.tokenA = {
					denom: message?.offer_coin?.denom,
					amount: message?.offer_coin?.amount
				}
			}

			return row
		}

		const transactions = computed(() => {
			if (!data.value) {
				return []
			}

			return data.value.tx_responses
				.map((tx: any) => formatRow(tx))
				.sort((a: any, b: any) => (+a.height < +b.height ? 1 : -1))
		})

		return {
			tabs,
			activeTab,
			setActiveTab,
			isPending,
			transactions,
			error
		}
	}
})
</script>

<style scoped>
.transaction-table__nav {
	margin-bottom: 2rem;
}

.transaction-table__nav__item {
	text-transform: capitalize;
	appearance: none;
	border-radius: 0.375rem;
	padding: 0.75rem 1rem;
	border: 0;
	background: #f9fafb;
	margin-left: 0.5rem;
	cursor: pointer;
}

.transaction-table__nav__item:first-child {
	margin-left: 0;
}

.transaction-table__nav__item[aria-selected='true'] {
	font-weight: 600;
	background: #f3f4f6;
}

.transaction-table__table {
	width: 100%;
}

.transaction-table__table th {
	opacity: 0.5;
	padding-bottom: 1rem;
	vertical-align: middle;
	text-transform: uppercase;
}

.transaction-table__table td {
	padding: 0.5rem 0;
	vertical-align: middle;
}

.transation-table__table__token {
	text-align: right;
}

.transation-table__table__timestamp {
	text-align: center;
}
</style>
