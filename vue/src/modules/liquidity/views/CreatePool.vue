<template>
	<div class="create-pool container">
		<div class="sp-token-send__holder">
			<div class="sp-token-send">
				<div class="sp-token-send__header sp-component-title">
					<h3>Create Liquidity Pool</h3>
				</div>

				<div class="sp-token-send__main sp-box sp-shadow">
					<template v-if="!isLoggedIn">
						<p class="create-pool__wallet-msg">
							Access a wallet to create a pool
						</p>
					</template>

					<template v-else>
						<Alert v-if="isFinished && error" status="error" :message="error" />

						<form
							@submit.prevent=""
							class="sp-token-send__main__form create-pool__form"
						>
							<InputTokenPair @change="setPair" />

							<div class="create-pool__form__footer">
								<SpButton
									type="submit"
									class="create-pool__form__submit"
									:disabled="isPending"
									:busy="isPending"
									@click="submit"
								>
									Create Pool
								</SpButton>
							</div>
						</form>
					</template>
				</div>
			</div>
		</div>
	</div>
</template>

<script lang="ts">
import { computed, defineComponent, reactive, ref } from 'vue'
import { useStore } from 'vuex'
import { useRouter } from 'vue-router'
import { BigNumber } from 'bignumber.js'

import Alert from '../components/Alert'
import InputTokenPair from '../components/InputTokenPair'

import {
	usePromise,
	useLiquidityParams,
	useLiquidityPools,
	useWallet
} from '../composables'

import { RawTransactionResponse, TokenPair } from '../interfaces'

export default defineComponent({
	components: {
		Alert,
		InputTokenPair
	},

	setup() {
		const store = useStore()
		const router = useRouter()
		const { liquidityParams } = useLiquidityParams()
		const { findPoolByDenoms } = useLiquidityPools()
		const { isLoggedIn } = useWallet()

		const pair = ref<TokenPair | undefined>(undefined)
		const setPair = (value: TokenPair) => (pair.value = value)

		const pool = reactive({
			pair
		})

		const fee = computed(() => [
			{
				// TODO: hard coded as this appears to be necessary to transmit transactions on the Gravity DEX Testnet
				amount: process.env.NODE_ENV === 'production' ? '200' : '0',
				denom: liquidityParams.value?.pool_creation_fee[0].denom
			}
		])

		const submitFn = async () => {
			if (!validate()) {
				return
			}

			const poolCreatorAddress = store.getters['common/wallet/address']
			const poolTypeId = 1
			const depositCoins = [pair.value?.tokenA, pair.value?.tokenB]

			const value = { poolCreatorAddress, poolTypeId, depositCoins }

			const result: RawTransactionResponse = await store.dispatch(
				'tendermint.liquidity.v1beta1/sendMsgCreatePool',
				{ value, fee: fee.value }
			)

			console.log({ createPoolResult: result, value, fee: fee.value })

			if (result.code) {
				throw new Error(result.rawLog)
			}

			router.push({ name: 'liquidity' })
		}

		const {
			error,
			isPending,
			isFinished,
			data: result,
			execute: submit
		} = usePromise(submitFn, { lazy: true })

		const validate = () => {
			const minDepositAmount = new BigNumber(
				liquidityParams.value!.min_init_deposit_amount
			)

			if (
				minDepositAmount.isGreaterThan(pool.pair?.tokenA.amount || 0) ||
				minDepositAmount.isGreaterThan(pool.pair?.tokenB.amount || 0)
			) {
				error.value = `You should deposit a minimum initial amount of ${
					liquidityParams.value!.min_init_deposit_amount
				} tokens.`
				return false
			}

			if (
				pool.pair &&
				findPoolByDenoms([pool.pair.tokenA.denom, pool.pair.tokenB.denom])
			) {
				error.value = `A pool with this pair already exists.`
				return false
			}

			return true
		}

		return {
			isLoggedIn,
			setPair,
			pool,
			error,
			submit,
			result,
			isPending,
			isFinished
		}
	}
})
</script>

<style scoped>
.create-pool__wallet-msg {
	opacity: 0.4;
}
.create-pool__form__footer {
	display: flex;
	justify-content: flex-end;
}
.create-pool__form__submit {
	margin-top: 1rem;
	margin-bottom: 1rem;
}
</style>
