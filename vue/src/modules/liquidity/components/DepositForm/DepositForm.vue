<template>
	<form class="deposit-form" @submit.prevent="">
		<Alert v-if="isFinished && error" status="error" :message="error" />

		<fieldset class="deposit-form__token-a">
			<div class="deposit-form__label-wrapper">
				<label>Input</label>
				<span
					>Available: {{ !isLoggedIn ? '--' : walletBalance.from.amount || "0" }}</span
				>
			</div>
			<div class="deposit-form__input-wrapper">
				<input v-model="deposit.pair.tokenA.amount" name="token-a" />
				<span>{{ deposit.pair.tokenA.denom }}</span>
			</div>
		</fieldset>

		<div type="secondary" class="deposit-form__icon" @click="switchTokens">
			<PlusIcon />
		</div>

		<fieldset class="deposit-form__token-b">
			<div class="deposit-form__label-wrapper">
				<label>Input</label>
				<span
					>Available: {{ !isLoggedIn ? '--' : walletBalance.to.amount || "" }}</span
				>
			</div>
			<div class="deposit-form__input-wrapper">
				<input v-model="deposit.pair.tokenB.amount" name="token-a" />
				<span>{{ deposit.pair.tokenB.denom }}</span>
			</div>
		</fieldset>

		<SpButton :disabled="isPending || !isLoggedIn" :busy="isPending" @click="execute" class="deposit-form__submit">
			{{ isLoggedIn ? 'Deposit' : 'Unlock your wallet' }}
		</SpButton>
	</form>
</template>

<script lang="ts">
import { computed, defineComponent, reactive } from 'vue'
import { useStore } from 'vuex'
import { useBank, useLiquidityParams, usePromise, useWallet } from '../../composables'
import { PlusIcon } from '../Icons'
import Alert from '../Alert/Alert.vue'

// TODO: Handle error state
export default defineComponent({
	name: 'DepositForm',

	components: {
		Alert,
		PlusIcon
	},

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
		const { liquidityParams } = useLiquidityParams()
		const { address, isLoggedIn } = useWallet()
		const { balanceByDenom } = useBank({ address })

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
			fee: [
				{
					// TODO: hard coded as this appears to be necessary to transmit transactions on the Gravity DEX Testnet
					amount: '200',
					denom: liquidityParams.value?.pool_creation_fee[0].denom
				}
			]
		})

		const walletBalance = computed(() => ({
			from: {
				denom: pair.tokenA.denom,
				amount: balanceByDenom(pair.tokenA.denom as string).value || '0'
			},
			to: {
				denom: pair.tokenB.denom,
				amount: balanceByDenom(pair.tokenB.denom as string).value || '0'
			}
		}))

		const submitFn = async () => {
			const depositorAddress = store.getters['common/wallet/address']
			const depositCoins = [deposit.pair.tokenA, deposit.pair.tokenB]

			const value = { depositorAddress, poolId: props.poolId, depositCoins }

			const result = await store.dispatch(
					'tendermint.liquidity.v1beta1/sendMsgDepositWithinBatch',
					{
						value,
						fee: deposit.fee
					}
				)
				console.log({ depositResult: result })

				if (result.code) {
					throw new Error(result.rawLog)
				}

				pair.tokenA.amount = ''
				pair.tokenB.amount = ''

				emit('success')
		}

		const promise = usePromise(submitFn, { lazy: true })

		return { deposit, isLoggedIn, walletBalance, ...promise }
	}
})
</script>

<style scoped>
.deposit-form .alert {
	margin-bottom: 2rem;
}
.deposit-form {
	display: flex;
	flex-direction: column;
}
.deposit-form fieldset {
	appearance: none;
	border: none;
	display: flex;
	flex-direction: column;
	padding: 0;
}
.deposit-form__icon {
	appearance: none;
	margin: 1em auto;
	align-self: center;
}
.deposit-form__icon svg {
	width: 20px;
	height: 20px;
}
.deposit-form__input-wrapper {
	margin-top: 0.5rem;
	display: flex;
	align-items: center;
	width: 100%;
	position: relative;
	border-radius: 0.8rem;
	border: 0.2rem solid rgba(17, 17, 17, 0.1);
	overflow: hidden;
}
.deposit-form__input-wrapper input {
	width: 100%;
	padding-right: 2rem;
	line-height: 2.2rem;
	color: #111;
	padding: 0.9rem 1.2rem;
	border: none;
}
.deposit-form__input-wrapper span {
	text-transform: uppercase;
	position: absolute;
	right: 0;
	padding-right: 0.75rem;
	pointer-events: none;
}
.deposit-form__label-wrapper {
	display: flex;
	align-items: baseline;
	justify-content: space-between;
}
.deposit-form__label-wrapper span {
	opacity: 0.8;
}
.deposit-form__submit {
	margin-top: 2rem;
}
</style>
