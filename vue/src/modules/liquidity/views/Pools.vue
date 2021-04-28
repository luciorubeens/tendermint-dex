<template>
	<div class="container">
		<div>
			<h1>Available pool pairs</h1>
			<router-link :to="{ name: 'liquidity-create' }">Create New</router-link>
		</div>

		<template v-if="isPending"> loading... </template>

		<template v-if="error">{{ error }}</template>

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
							<router-link
								:to="{ name: 'liquidity-pool', params: { id: pool.id } }"
								>Open</router-link
							>
						</td>
					</tr>
				</tbody>
			</table>
		</template>
	</div>
</template>

<script lang="ts">
import { defineComponent, onMounted } from 'vue'
import { useLiquidityPools, useSupply } from '../composables'

export default defineComponent({
	setup() {
		const { isPending, pools, error } = useLiquidityPools()
		const { updateSupplies } = useSupply()

		onMounted(updateSupplies)

		return { isPending, pools, error }
	}
})
</script>
