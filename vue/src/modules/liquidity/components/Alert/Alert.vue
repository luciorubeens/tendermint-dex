<template>
	<div :class="['alert', `alert--${props.status}`]">
		<p class='alert__content'>
			{{ props.message }}
		</p>
	</div>
</template>

<script lang="ts">
import { defineComponent } from 'vue'

export default defineComponent({
	props: {
		status: {
			type: String
		},
		message: {
			type: String
		}
	},

	setup(props) {
		return {
			props
		}
	}
})
</script>

<style scoped>
.alert {
	border-radius: .375rem;
	padding: 1rem 2rem;
}
.alert--error {
	background-color: #FEF2F2;
}
.alert--error .alert__content {
	color: #B91C1C;
}
</style>
