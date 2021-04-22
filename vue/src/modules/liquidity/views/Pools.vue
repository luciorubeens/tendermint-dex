<template>
	<div class="container">
		<h1>Pools</h1>

		<template v-if="isPending"> loading... </template>

		<template v-if="error"></template>

		<template v-else>
			<table>
				<thead>
					<tr>
						<th>ID</th>
						<th>Name</th>
						<th>Supply</th>
						<th>Details</th>
					</tr>
				</thead>

				<tbody>
					<tr v-for="pool in pools" :key="pool.name">
						<td>{{ pool.id }}</td>
						<td>{{ pool.name }}</td>
						<td>{{ pool.supplyAmount }}</td>
						<td>
							<router-link :to="{ name: 'liquidity-pool', params: { id: pool.id }}">Open</router-link>
						</td>
					</tr>
				</tbody>
			</table>
		</template>
	</div>
</template>

<script lang="ts">
import { defineComponent } from 'vue'
import { useLiquidityPools } from '../composables'

// TODO: Show loading and error state
export default defineComponent({
	setup() {
		const { isPending, pools, error } = useLiquidityPools()

		return { isPending, pools, error }
	}
})
</script>
