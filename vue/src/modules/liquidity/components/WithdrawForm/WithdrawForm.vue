<template>
	<form @submit.prevent="submit">
		<fieldset>
			<input v-model="poolCoin.amount" name="token-amount" />
			<span>{{ pool.name }}</span>
		</fieldset>

		<button>Withdraw</button>
	</form>
</template>

<script lang="ts">
import { defineComponent, reactive, ref, unref } from 'vue'
import { useStore } from 'vuex'
import { useBank, useLiquidityPools, useWallet } from '../../composables'

export default defineComponent({
	name: 'WithdrawForm',
	props: {
		poolId: {
			type: String,
			required: true
		}
	},
	emits: ['success'],
	setup(props, { emit }) {
		const store = useStore()
		const { address } = useWallet()
		const { balanceByDenom } = useBank({ address })
		const { findPoolById } = useLiquidityPools()

		const pool = findPoolById(props.poolId)

		const walletPoolBalance = balanceByDenom(pool.value!.pool_coin_denom)

		const poolCoin = reactive({
			amount: '',
			denom: pool.value!.pool_coin_denom
		})

		const submit = async () => {
			const value = {
				withdrawerAddress: unref(address),
				poolId: props.poolId,
				poolCoin: unref(poolCoin)
			}

			try {
				const result = await store.dispatch(
					'tendermint.liquidity.v1beta1/sendMsgWithdrawWithinBatch',
					{ value }
				)
				poolCoin.amount = ''
				console.log({ result })
				emit('success')
			} catch (e) {
				console.error(e)
			}
		}

		return {
			poolCoin,
			walletPoolBalance,
			submit,
			pool
		}
	}
})
</script>
