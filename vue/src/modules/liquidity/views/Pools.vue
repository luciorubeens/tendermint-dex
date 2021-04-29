<template>
	<div class="container">
		<div class="pools__holder">
			<div class="sp-component pools">
				<div class="sp-component-title">
					<h3>Pools list</h3>
					<span>|</span>
					<span>Available pool pairs</span>
				</div>

				<div class="sp-box sp-shadow">
					<template v-if="isPending">
						<span class="pools__msg"> Loading... </span>
					</template>

					<template v-else-if="error">
						<span class="pools__msg">
							No pools available yet. Create a new one.
						</span>
					</template>

					<template v-else>
						<table class="pools__table">
							<thead>
								<tr>
									<th class="pools__table__id">ID</th>
									<th class="pools__table__name">Name</th>
									<th class="pools__table__reserve-account">Reserve Account</th>
									<th class="pools__table__supply">Supply</th>
									<th class="pools__table__details">Details</th>
								</tr>
							</thead>

							<tbody>
								<tr v-for="pool in pools" :key="pool.name">
									<td class="pools__table__id">{{ pool.id }}</td>
									<td class="pools__table__name">{{ pool.meta.name }}</td>
									<td class="pools__table__reserve-account">
										{{ pool.reserve_account_address }}
									</td>
									<td class="pools__table__supply">
										{{ pool.meta.supplyAmount }}
									</td>
									<td class="pools__table__details">
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
			</div>

			<div class="sp-component pools__add">
				<div class="sp-component-title">
					<h3>Add a pool</h3>
				</div>

				<SpButton class="pools__header__create-button" @click="openCreatePage">
					Create New
				</SpButton>
			</div>
		</div>
	</div>
</template>

<script lang="ts">
import { defineComponent, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { useLiquidityPools, useSupply } from '../composables'

export default defineComponent({
	setup() {
		const { isPending, pools, error, isFinished } = useLiquidityPools()
		const { updateSupplies } = useSupply()
		const router = useRouter()

		const openCreatePage = () => router.push({ name: 'liquidity-create' })

		onMounted(updateSupplies)

		return { isPending, pools, error, openCreatePage, isFinished }
	}
})
</script>

<style scoped>
.pools__msg {
	opacity: 0.4;
}

.pools__holder {
	display: flex;
	justify-content: space-between;
	flex-direction: column;
}

.pools__table {
	width: 100%;
}

.pools__table th {
	opacity: 0.5;
	padding-bottom: 1rem;
	vertical-align: middle;
	text-transform: uppercase;
}

.pools__table td {
	padding: 1rem 0;
	vertical-align: middle;
}

.pools__table__id {
	width: 5%;
	text-align: left;
}

.pools__table__name {
	text-align: left;
	font-weight: 500;
}

.pools__table__reserve-account {
	text-align: center;
}

.pools__table__supply {
	text-align: right;
}

.pools__table__details {
	text-align: center;
}

@media only screen and (min-width: 1366px) {
	.pools__holder {
		flex-direction: row;
	}
	.pools__add {
		flex-basis: 28%;
		width: 28%;
	}
	.pools {
		flex-basis: 72%;
		width: 72%;
		padding-right: 2rem;
	}
}

.pools__holder .pools__add {
	display: flex;
	flex-direction: column;
}
</style>
