<template>
	<div class="container">
		<h1>Pools</h1>

		<table>
			<thead>
				<tr>
					<th>ID</th>
					<th>Name</th>
				</tr>
			</thead>

			<tbody>
				<tr v-for="pool in pools" :key="pool.name">
					<td>{{ pool.id }}</td>
					<td>{{ pool.name }}</td>
				</tr>
			</tbody>
		</table>
	</div>
</template>

<script lang="ts">
import { defineComponent, reactive, computed, onMounted, watch, ref } from 'vue'
import { useStore } from 'vuex'

// TODO: Show loading and error state
export default defineComponent({
	setup() {
		const store = useStore()

		const data = reactive({
			isLoading: false,
			result: null,
			error: null
		})

		const pools = computed(() => {
			const result: any = data.result

			if (!result) {
				return []
			}

			// TODO: Fetch denom supply
			const formattedPools = result.pools.map((pool: any) => ({
				name: pool.reserve_coin_denoms.join('-').toUpperCase(),
				...pool
			}))

			return formattedPools
		})

		const fetchPools = async () => {
			data.isLoading = true
			data.error = null

			try {
				const response = await store.dispatch(
					'tendermint.liquidity.v1beta1/QueryLiquidityPools',
					{}
				)
				data.result = response
			} catch (e) {
				data.error = e.message
				data.result = null
			} finally {
				data.isLoading = false
			}
		}

		onMounted(() => fetchPools())

		return { isLoading: data.isLoading, error: data.error, pools }
	}
})
</script>
