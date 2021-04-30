<template>
	<form class="swap-form" @submit.prevent="">
		<Alert v-if="isFinished && error" status="error" :message="error" />

		<fieldset class="swap-form__sell">
			<div class="swap-form__label-wrapper">
				<label>Sell</label>
				<span
					>Available: {{ !isLoggedIn ? '--' : walletBalance.from.amount }}</span
				>
			</div>
			<div class="swap__input-wrapper">
				<input v-model="pair.from.amount" name="token-from" />
				<span>{{ pair.from.denom }}</span>
			</div>
		</fieldset>

		<SpButton type="secondary" class="swap-form__switch" @click="switchTokens">
			<SwitchIcon />
		</SpButton>

		<fieldset class="swap-form__buy">
			<label>Buy (Estimated)</label>
			<div class="swap__input-wrapper">
				<input v-model="pair.to.amount" name="token-to" readonly />
				<span>{{ pair.to.denom }}</span>
			</div>
		</fieldset>

		<div v-if="pair.from.amount" class="swap__details">
			<div class="swap__details__item">
				<span>Price</span>
				<span
					>1 {{ pair.from.denom }} = {{ swapPrice }} {{ pair.to.denom }}</span
				>
			</div>
			<div class="swap__details__item">
				<span>Fee</span>
				<span>{{ offerFee }} {{ pair.from.denom }}</span>
			</div>
		</div>

		<SpButton :disabled="isPending" :busy="isPending" @click="execute" class="swap-form__submit">
			{{ isLoggedIn ? 'Swap' : 'Unlock your wallet' }}
		</SpButton>
	</form>
</template>

<script lang="ts">
import { computed, defineComponent, reactive, ref, watch } from 'vue'
import { useStore } from 'vuex'
import {
	useBank,
	useLiquidityParams,
	usePool,
	usePromise,
	useWallet
} from '../../composables'

import BigNumber from 'bignumber.js'
import { SwitchIcon } from '../Icons'
import Alert from '../Alert/Alert.vue'

// TODO: Handle error state
export default defineComponent({
	components: { SwitchIcon, Alert },
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
		const { liquidityParams } = useLiquidityParams()
		const { reserveBalances } = usePool({ poolId: props.poolId })
		const { address, isLoggedIn } = useWallet()
		const { balanceByDenom } = useBank({ address })

		const fee = computed(() => [
			{
				// TODO: hard coded as this appears to be necessary to transmit transactions on the Gravity DEX Testnet
				amount: '200',
				denom: liquidityParams.value?.pool_creation_fee[0].denom
			}
		])

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

		const walletBalance = reactive({
			from: {
				denom: pair.from.denom,
				amount: balanceByDenom(pair.from.denom as string).value || '0'
			},
			to: {
				denom: pair.to.denom,
				amount: balanceByDenom(pair.to.denom as string).value || '0'
			}
		})

		const poolReserveBalance = computed(() => ({
			from: reserveBalances.value?.[pair.from.denom as string],
			to: reserveBalances.value?.[pair.to.denom as string]
		}))

		const switchTokens = () => {
			const oldFrom = ref(pair.from)
			pair.from = pair.to
			pair.to = oldFrom.value
		}

		const swapPrice = computed<string>(() => {
			if (!pair.from.amount) {
				return '0'
			}

			return new BigNumber(1)
				.dividedBy(
					new BigNumber(pair.from.amount)
						.multipliedBy(2)
						.plus(poolReserveBalance.value.from!.amount)
						.dividedBy(poolReserveBalance.value.to!.amount)
				)
				.decimalPlaces(5)
				.toString()
		})

		const offerFee = computed<string>(() => {
			if (!pair.from.amount) {
				return '0'
			}

			return new BigNumber(pair.from.amount)
				.multipliedBy(
					new BigNumber(liquidityParams.value!.swap_fee_rate).dividedBy(2)
				)
				.decimalPlaces(4)
				.toString()
		})

		const estimatedAmount = computed<string>(() => {
			if (!pair.from.amount) {
				return '0'
			}

			return new BigNumber(pair.from.amount)
				.multipliedBy(swapPrice.value)
				.minus(offerFee.value)
				.toFixed(0)
		})

		watch(
			swapPrice,
			() => {
				if (!pair.from.amount) {
					pair.to.amount = ''
				} else {
					pair.to.amount = estimatedAmount.value
				}
			},
			{ immediate: true }
		)

		const submitFn = async () => {
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
				orderPrice: new BigNumber(swapPrice.value)
					.multipliedBy(1e18)
					.toFixed(0),
				offerCoinFee: {
					amount: new BigNumber(offerFee.value).decimalPlaces(0).toString(),
					denom: pair.from.denom
				}
			}

			const result = await store.dispatch(
				'tendermint.liquidity.v1beta1/sendMsgSwapWithinBatch',
				{
					value,
					fee: fee.value
				}
			)
			console.log({ result })

			if (result.code) {
				throw new Error(result.rawLog)
			}

			pair.from.amount = ''
			pair.to.amount = ''

			emit('success')
		}

		const promise = usePromise(submitFn, { lazy: true })

		return {
			...promise,
			pair,
			switchTokens,
			walletBalance,
			swapPrice,
			offerFee,
			isLoggedIn
		}
	}
})
</script>

<style scoped>
.swap-form .alert {
	margin-bottom: 2rem;
}
.swap-form {
	display: flex;
	flex-direction: column;
}
.swap-form fieldset {
	appearance: none;
	border: none;
	display: flex;
	flex-direction: column;
	padding: 0;
}
.swap-form__switch {
	appearance: none;
	margin: 1em auto;
	align-self: center;
}
.swap-form__switch svg {
	width: 20px;
	height: 20px;
}
.swap__input-wrapper {
	margin-top: 0.5rem;
	display: flex;
	align-items: center;
	width: 100%;
	position: relative;
	border-radius: 0.8rem;
	border: 0.2rem solid rgba(17, 17, 17, 0.1);
	overflow: hidden;
}
.swap__input-wrapper input {
	width: 100%;
	padding-right: 2rem;
	line-height: 2.2rem;
	color: #111;
	padding: 0.9rem 1.2rem;
	border: none;
	background: transparent;
}
.swap__input-wrapper span {
	text-transform: uppercase;
	position: absolute;
	right: 0;
	padding-right: 0.75rem;
	pointer-events: none;
}
.swap__details {
	border-radius: 0.2rem;
	margin-top: 1rem;
	display: flex;
	flex-direction: column;
	padding: 1rem;
	background: #f9fafb;
}
.swap__details__item {
	display: flex;
	justify-content: space-between;
	margin-bottom: 0.75rem;
}
.swap__details__item span:first-child {
	font-weight: 500;
}
.swap__details__item span:last-child {
	text-transform: uppercase;
}
.swap-form__label-wrapper {
	display: flex;
	align-items: baseline;
	justify-content: space-between;
}
.swap-form__label-wrapper span {
	opacity: 0.8;
}
.swap-form__submit {
	margin-top: 2rem;
}
.swap-form__buy .swap__input-wrapper {
	background: #f9fafb;
}
</style>
