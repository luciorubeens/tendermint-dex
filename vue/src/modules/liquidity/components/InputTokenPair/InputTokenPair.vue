<template>
	<div class="input-token-pair">
		<SpAmountSelect
			v-model="pair.tokenA"
			:available="availableBalances"
			:index="0"
			:selected="[pair.tokenB.denom]"
			:last="true"
			class="input-token-pair__a"
		/>

		<div class="input-token-pair__divider">
			<slot name="divider" />
		</div>

		<SpAmountSelect
			v-model="pair.tokenB"
			:available="availableBalances"
			:index="1"
			:selected="[pair.tokenA.denom]"
			:last="true"
			class="input-token-pair__b"
		/>
	</div>
</template>

<script lang="ts">
import { computed, defineComponent, reactive, ref, watch } from 'vue'
import { useBank, useWallet } from '../../composables'

export default defineComponent({
	name: 'InputTokenPair',

	emits: ['change'],

	setup(_, { emit }) {
		const { address } = useWallet()
		const { allBalances } = useBank({ address })

		const availableBalances = computed(() =>
			allBalances.value.filter(
				(item) => !item.denom.toLowerCase().startsWith('pool')
			)
		)

		const pair = reactive({
			tokenA: {
				amount: '',
				denom: availableBalances.value[0]?.denom
			},
			tokenB: {
				amount: '',
				denom: availableBalances?.value[1]?.denom
			}
		})

		const emitChange = () => {
			emit('change', pair)
		}

		watch(pair, emitChange, { immediate: true })

		return {
			pair,
			availableBalances
		}
	}
})
</script>
