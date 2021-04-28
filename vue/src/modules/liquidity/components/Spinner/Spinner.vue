<template>
	<svg
		class="spinner"
		xmlns="http://www.w3.org/2000/svg"
		fill="none"
		viewBox="0 0 24 24"
	>
		<circle
			class="spinner__stroke"
			cx="12"
			cy="12"
			r="10"
			stroke="currentColor"
			stroke-width="4"
		/>
		<path
			class="spinner__progress"
			fill="currentColor"
			d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
		/>
	</svg>
</template>

<style scoped>
.spinner {
	animation: spin 1s linear infinite;
	width: 1.5rem;
	height: 1.5rem;
	color: white;
}
.spinner__stroke {
	opacity: 0.25;
}
.spinner__progress {
	opacity: 0.75;
}

@keyframes spin {
	from {
		transform: rotate(0deg);
	}
	to {
		transform: rotate(360deg);
	}
}
</style>
