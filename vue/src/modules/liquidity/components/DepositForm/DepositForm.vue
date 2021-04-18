<template>
	<form @submit.prevent="emitSubmit">
		<fieldset>
			<input v-model="deposits.tokenA.amount" name="token-a-amount" />
			<span>{{deposits.tokenA.denom}}</span>
		</fieldset>

		<fieldset>
			<input v-model="deposits.tokenB.amount" name="token-b-amount" />
			<span>{{deposits.tokenB.denom}}</span>
		</fieldset>

		<button>Deposit</button>
	</form>
</template>

<script lang="ts">
import { defineComponent, reactive } from 'vue'

// TODO: List available remote denoms instead of static
export default defineComponent({
	name: 'DepositForm',

	emits: ['submit'],

	props: {
		denoms: {
			type: Array,
			required: true
		}
	},

	setup(props, { emit }) {
		const deposits = reactive({
			tokenA: {
				amount: '',
				denom: props.denoms[0]
			},
			tokenB: {
				amount: '',
				denom: props.denoms[1]
			}
		})

		const emitSubmit = () => emit('submit', deposits);

		return { deposits, emitSubmit }
	}
})
</script>
