<template>
	<div class="container">
		<div v-if="isLoading">
			<span>Loading...</span>
		</div>

		<div v-else-if="error">
			<span>{{error}}</span>
		</div>

		<div v-else-if="pool">
			<div>
				<h1>Pair {{ pool.name }}</h1>

				<div>
					<h4>Add Liquidity</h4>
					<DepositForm :denoms="pool.reserve_coin_denoms" :poolId="pool.id" />
				</div>
			</div>
		</div>
	</div>
</template>

<script lang="ts">
import { defineComponent, reactive, onMounted, computed, ref } from 'vue'
import { useRoute } from 'vue-router'
import { useStore } from 'vuex'
import DepositForm from '../components/DepositForm/DepositForm.vue'

export default defineComponent({
	name: 'Pool',

	components: {
		DepositForm
	},

	setup() {
		const route = useRoute()
		const store = useStore()

		const { id: poolId } = route.params

		const data = reactive({
			isLoading: true,
			result: null,
			error: null
		})

		const fetchPool = async () => {
			data.isLoading = true
			data.error = null

			try {
				const response = await store.dispatch(
					'tendermint.liquidity.v1beta1/QueryLiquidityPool',
					{ params: { pool_id: poolId } }
				)
				data.result = response
			} catch (e) {
				data.error = e.message
				data.result = null
			} finally {
				data.isLoading = false
			}
		}

		const pool = computed(() => {
			const result: any = data.result

			if (!result) {
				return
			}

			const name = result.pool.reserve_coin_denoms.join('-').toUpperCase()

			return { name, ...result.pool }
		})

		onMounted(() => fetchPool())

		return {
			pool,
			isLoading: computed(() => data.isLoading),
			error: computed(() => data.error)
		}
	}
})
</script>
