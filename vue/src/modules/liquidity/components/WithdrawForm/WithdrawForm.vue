<template>
	<form class="withdraw-form" @submit.prevent="">
		<Alert v-if="isFinished && error" status="error" :message="error" />

		<fieldset class="withdraw-form__input">
			<div class="withdraw-form__label-wrapper">
				<label>Amount</label>
				<span
					>Available: {{ !isLoggedIn ? '--' : walletPoolBalance || '0' }}</span
				>
			</div>
			<div class="withdraw-form__input-wrapper">
				<input v-model="poolCoin.amount" name="token-amount" />
				<span>{{ pool.meta.name }}</span>
			</div>
		</fieldset>

		<SpButton
			:disabled="isPending || !isLoggedIn"
			:busy="isPending"
			class="withdraw-form__submit"
			@click="execute"
		>
			{{ isLoggedIn ? 'Withdraw' : 'Unlock your wallet' }}
		</SpButton>
	</form>
</template>

<script lang="ts">
import { computed, defineComponent, reactive, ref, unref } from 'vue'
import { useStore } from 'vuex'
import {
	useBank,
	useLiquidityParams,
	useLiquidityPools,
	usePromise,
	useWallet
} from '../../composables'
import Alert from '../Alert/Alert.vue'

export default defineComponent({
	name: 'WithdrawForm',
	components: {
		Alert
	},
	props: {
		poolId: {
			type: String,
			required: true
		}
	},
	emits: ['success'],
	setup(props, { emit }) {
		const store = useStore()
		const { address, isLoggedIn } = useWallet()
		const { balanceByDenom } = useBank({ address })
		const { findPoolById } = useLiquidityPools()
		const { liquidityParams } = useLiquidityParams()

		const pool = findPoolById(props.poolId)

		const walletPoolBalance = balanceByDenom(pool.value!.pool_coin_denom)

		const fee = computed(() => [
			{
				// TODO: hard coded as this appears to be necessary to transmit transactions on the Gravity DEX Testnet
				amount: process.env.NODE_ENV === 'production' ? '200' : '0',
				denom: liquidityParams.value?.pool_creation_fee[0].denom
			}
		])

		const poolCoin = reactive({
			amount: '',
			denom: pool.value!.pool_coin_denom
		})

		const submitFn = async () => {
			const value = {
				withdrawerAddress: unref(address),
				poolId: props.poolId,
				poolCoin: unref(poolCoin)
			}

			const result = await store.dispatch(
				'tendermint.liquidity.v1beta1/sendMsgWithdrawWithinBatch',
				{ value, fee: fee.value }
			)

			console.log({ withdrawResult: result })

			if (result.code) {
				throw new Error(result.rawLog)
			}

			poolCoin.amount = ''
			emit('success')
		}

		const promise = usePromise(submitFn, { lazy: true })

		return {
			poolCoin,
			walletPoolBalance,
			pool,
			isLoggedIn,
			...promise
		}
	}
})
</script>

<style scoped>
.withdraw-form .alert {
	margin-bottom: 2rem;
}
.withdraw-form {
	display: flex;
	flex-direction: column;
}
.withdraw-form fieldset {
	appearance: none;
	border: none;
	display: flex;
	flex-direction: column;
	padding: 0;
}
.withdraw-form__input-wrapper {
	margin-top: 0.5rem;
	display: flex;
	align-items: center;
	width: 100%;
	position: relative;
	border-radius: 0.8rem;
	border: 0.2rem solid rgba(17, 17, 17, 0.1);
	overflow: hidden;
}
.withdraw-form__input-wrapper input {
	width: 100%;
	padding-right: 2rem;
	line-height: 2.2rem;
	color: #111;
	padding: 0.9rem 1.2rem;
	border: none;
}
.withdraw-form__input-wrapper span {
	text-transform: uppercase;
	position: absolute;
	right: 0;
	padding-right: 0.75rem;
	pointer-events: none;
}
.withdraw-form__label-wrapper {
	display: flex;
	align-items: baseline;
	justify-content: space-between;
}
.withdraw-form__label-wrapper span {
	opacity: 0.8;
}
.withdraw-form__submit {
	margin-top: 2rem;
}
</style>
