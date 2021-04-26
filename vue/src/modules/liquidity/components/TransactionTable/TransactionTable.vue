<template>
	<section>
		<div>
			<button type="button" @click="setActiveTab('swap')">Swap</button>
			<button type="button" @click="setActiveTab('deposit')">Deposit</button>
			<button type="button" @click="setActiveTab('withdraw')">
				Withdraw
			</button>
		</div>

		<template v-if="isPending"> loading... </template>

		<template v-if="error">
			{{ error }}
		</template>

		<template v-else>
			<table>
				<thead>
					<tr>
						<th>Action</th>
						<th>Account</th>
						<th>Token Amount</th>
						<th>Token Amount</th>
						<th>Timestamp</th>
					</tr>
				</thead>

				<tbody>
					<tr v-for="transaction in transactions" :key="transaction">
						<td>
							{{ transaction.action}}
						</td>
						<td>
							{{ transaction.account }}
						</td>
						<td>
							<div>
								<span>{{ transaction.tokenA.amount }}</span>
								<span>{{ transaction.tokenA.denom }}</span>
							</div>
						</td>
						<td>
							<div>
								<span>{{ transaction.tokenB.amount }}</span>
								<span>{{ transaction.tokenB.denom }}</span>
							</div>
						</td>
						<td>
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

const tabActionMap = {
	deposit: 'deposit_within_batch',
	swap: 'swap_within_batch',
	withdraw: 'withdraw_within_batch'
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

		const { pool, calculateSharesFromWithdrawTransactions } = usePool({ poolId: props.poolId })

		const query = computed(() => {
			return {
				[`${tabActionMap[activeTab.value]}.pool_id`]: pool.value.id
			}
		})

		const { isPending, data, error } = useTransactions({ query })

		const formatRow = (transaction: any, index: number) => {
			const message = transaction.tx?.body?.messages?.[0]
			const txType = message?.['@type']

			const row: any = {
				timestamp: transaction.timestamp
			}

			if (txType === '/tendermint.liquidity.v1beta1.MsgDepositWithinBatch') {
				row.action = 'Deposit'
				row.account = message?.depositor_address
				row.tokenA = message?.deposit_coins?.[0]
				row.tokenB = message?.deposit_coins?.[1]
			}

			if (txType === '/tendermint.liquidity.v1beta1.MsgWithdrawWithinBatch') {
				const shares = calculateSharesFromWithdrawTransactions({ transactionIndex: index, transactions: data.value.tx_responses })

				row.action = 'Withdraw'
				row.account = message?.withdrawer_address
				row.tokenA = shares.tokenA
				row.tokenB = shares.tokenB
			}

			return row
		}

		const transactions = computed(() => {
			if (!data.value) {
				return []
			}

			return data.value.tx_responses.map((tx: any, index: number) => formatRow(tx, index))
		})

		return {
			activeTab,
			setActiveTab,
			isPending,
			transactions,
			error
		}
	}
})
</script>
