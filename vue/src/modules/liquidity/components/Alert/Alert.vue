<template>
	<div :class="['alert', `alert--${props.status}`]">
		<p class="alert__content">
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
	border-radius: 0.375rem;
	padding: 1rem 2rem;
}
.alert--error {
	background-color: #fef2f2;
}
.alert--error .alert__content {
	color: #b91c1c;
}
</style>
