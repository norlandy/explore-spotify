<template>
	<button @click="onClick(value)" :class="['chip', active ? 'active' : '']">
		{{ label }}
	</button>
</template>

<script>
export default {
	props: ['label', 'value', 'active', 'onClick'],
}
</script>

<style lang="scss" scoped>
.chip {
	background-color: black;
	border: 1px solid red;
	outline: none;
	color: red;
	padding: 5px 10px;
	cursor: pointer;
	border-radius: 50px;
	margin: 4px;

	&.active {
		background-color: red;
		color: black;
	}

	&:last-child {
		margin-right: 0;
	}
}
</style>
