<template>
	<form @submit.prevent="submit">
		<fieldset>
			<input v-model="pair.from.amount" name="token-from" />
			<span>{{ pair.from.denom }}</span>
		</fieldset>

		<fieldset>
			<input v-model="pair.to.amount" name="token-to" readonly />
			<span>{{ pair.to.denom }}</span>
		</fieldset>

		<button type="button" @click="switchTokens">Switch Tokens</button>
		<button>Swap</button>
	</form>
</template>

<script lang="ts">
import { defineComponent, reactive, ref } from 'vue'
import { useStore } from 'vuex'
import BigNumber from "bignumber.js"

// TODO: Handle error state
export default defineComponent({
	name: 'SwapForm',

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
			from: {
				amount: '',
				denom: props.denoms[0]
			},
			to: {
				amount: '',
				denom: props.denoms[1]
			}
		})

		const switchTokens = () => {
			const oldFromDenom = ref(pair.from.denom)
			pair.from.denom = pair.to.denom
			pair.to.denom = oldFromDenom
		}

		const submit = async () => {
			const swapRequesterAddress = store.getters['common/wallet/address']

			const value = {
				swapRequesterAddress,
				poolId: props.poolId,
				swapTypeId: 1,
				offerCoin: {
					amount: pair.from.amount,
					denom: pair.from.denom
				},
				demandCoinDenom: pair.to.denom,
				// TODO: Price from exchange
				orderPrice: "190000000000000002",
				offerCoinFee: {
					amount: new BigNumber(pair.from.amount).multipliedBy("0.0015").toFixed(0),
					denom: pair.from.denom
				}
			}

			try {
				const result = await store.dispatch(
					'tendermint.liquidity.v1beta1/sendMsgSwapWithinBatch',
					{ value }
				)
				console.log({ result })

				if (result.code) {
					throw new Error(result.rawLog)
				}

				pair.from.amount = ''
				pair.to.amount = ''

				emit('success')
			} catch (e) {
				console.error(e)
			}
		}

		return { pair, submit, switchTokens }
	}
})
</script>
