<template>
	<form @submit.prevent="">
		<fieldset>
			<input v-model="deposit.pair.tokenA.amount" name="token-a-amount" />
			<span>{{ deposit.pair.tokenA.denom }}</span>
		</fieldset>

		<fieldset>
			<input v-model="deposit.pair.tokenB.amount" name="token-b-amount" />
			<span>{{ deposit.pair.tokenB.denom }}</span>
		</fieldset>

		<SpButton @click="submit">Deposit</SpButton>
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

	emits: ['success'],

	setup(props, { emit }) {
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
					'tendermint.liquidity.v1beta1/sendMsgDepositWithinBatch',
					{ value, fee: deposit.fee }
				)
				console.log({ result })

				if (result.code) {
					throw new Error(result.rawLog)
				}

				pair.tokenA.amount = ''
				pair.tokenB.amount = ''

				emit('success')
			} catch (e) {
				console.error(e)
			}
		}

		return { deposit, submit }
	}
})
</script>
