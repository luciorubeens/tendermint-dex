<template>
	<form @submit.prevent="">
		<fieldset>
			<input v-model="poolCoin.amount" name="token-amount" />
			<span>{{ pool.meta.name }}</span>
		</fieldset>

		<SpButton @click="submit">Withdraw</SpButton>
	</form>
</template>

<script lang="ts">
import { computed, defineComponent, reactive, ref, unref } from 'vue'
import { useStore } from 'vuex'
import { useBank, useLiquidityParams, useLiquidityPools, useWallet } from '../../composables'

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
		const { liquidityParams } = useLiquidityParams()

		const pool = findPoolById(props.poolId)

		const walletPoolBalance = balanceByDenom(pool.value!.pool_coin_denom)

		const fee = computed(() => [
			{
				// TODO: hard coded as this appears to be necessary to transmit transactions on the Gravity DEX Testnet
				amount: '200',
				denom: liquidityParams.value?.pool_creation_fee[0].denom
			}
		])

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
					{ value, fee: fee.value }
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
