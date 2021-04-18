<template>
	<div class="container">
		<h1>Create Pool</h1>

		<form @submit.prevent="createPool">
			<fieldset>
				<input v-model="pool.pair.tokenA.amount" name="token-a-amount" />
				<select v-model="pool.pair.tokenA.denom" name="token-a-denom">
					<option value="uatom">uatom</option>
					<option value="uusd">uusd</option>
				</select>
			</fieldset>

			<fieldset>
				<input v-model="pool.pair.tokenB.amount" name="token-b-amount" />
				<select v-model="pool.pair.tokenB.denom" name="token-b-denom">
					<option value="uatom">uatom</option>
					<option value="uusd">uusd</option>
				</select>
			</fieldset>

			<button>Create</button>
		</form>
	</div>
</template>

<script lang="ts">
import { defineComponent, reactive } from 'vue'
import { useStore } from 'vuex'

// TODO: List available remote denoms instead of static
export default defineComponent({
	setup() {
		const store = useStore()

		const pair = reactive({
			tokenA: {
				amount: '',
				denom: ''
			},
			tokenB: {
				amount: '',
				denom: ''
			}
		})

		const pool = reactive({
			pair,
			fee: []
		})

		const createPool = async () => {
			const poolCreatorAddress = store.getters['common/wallet/address']
			const poolTypeId = 1
			const depositCoins = [pair.tokenA, pair.tokenB]

			const value = { poolCreatorAddress, poolTypeId, depositCoins }
			const fee = pool.fee

			try {
				const result = await store.dispatch(
					'tendermint.liquidity.v1beta1/sendMsgCreatePool',
					{ value, fee }
				)
				console.log({ result })
			} catch (e) {
				console.error(e)
			}
		}

		return { pool, createPool }
	}
})
</script>
