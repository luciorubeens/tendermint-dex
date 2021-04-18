<template>
	<form @submit.prevent="emitSubmit">
		<fieldset>
			<input v-model="deposit.pair.tokenA.amount" name="token-a-amount" />
			<span>{{ deposit.pair.tokenA.denom }}</span>
		</fieldset>

		<fieldset>
			<input v-model="deposit.pair.tokenB.amount" name="token-b-amount" />
			<span>{{ deposit.pair.tokenB.denom }}</span>
		</fieldset>

		<button>Deposit</button>
	</form>
</template>

<script lang="ts">
import { defineComponent, reactive } from 'vue'
import { useStore } from 'vuex'

// TODO: Handle error state
export default defineComponent({
	name: 'DepositForm',

	props: {
		poolId: {
			type: String,
			required: true
		},
		denoms: {
			type: Array,
			required: true
		}
	},

	setup(props) {
		const store = useStore()

		const pair = reactive({
			tokenA: {
				amount: '',
				denom: props.denoms[0]
			},
			tokenB: {
				amount: '',
				denom: props.denoms[1]
			}
		})

		const deposit = reactive({
			pair,
			fee: []
		})

		const submit = async () => {
			const depositorAddress = store.getters['common/wallet/address']
			const depositCoins = [deposit.pair.tokenA, deposit.pair.tokenB]

			const value = { depositorAddress, poolId: props.poolId, depositCoins }

			try {
				const result = await store.dispatch(
					'tendermint.liquidity.v1beta1/msgDepositWithinBatch',
					{ value, fee: deposit.fee }
				)
				console.log({ result })
			} catch (e) {
				console.error(e)
			}
		}

		return { deposit, submit }
	}
})
</script>
