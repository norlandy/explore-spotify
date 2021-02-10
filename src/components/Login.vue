<template>
	<div class="login">
		<button class="login-button" @click="login">Log in with Spotify</button>
	</div>
</template>

<script>
import {login} from '@/utils/spotify'

export default {
	methods: {
		login,
	},
}
</script>

<style lang="scss" scoped>
.login {
	position: fixed;
	top: 0;
	left: 0;
	background-color: black;
	width: 100%;
	height: 100%;
	border: 1px solid red;
	z-index: 1000;
	display: flex;
	justify-content: center;
	align-items: center;

	.login-button {
		padding: 10px 20px;
		text-transform: uppercase;
		font-size: 20px;
	}
}
</style>
