<template>
	<div class="login">
		<v-btn color="purple" rounded dark x-large @click="login">Log in with Spotify</v-btn>
	</div>
</template>

<script>
import {LOGIN_URL} from '@/utils/spotify'

export default {
	data() {
		return {
			LOGIN_URL,
		}
	},

	methods: {
		login() {
			window.location.href = LOGIN_URL
		},
	},
}
</script>

<style lang="scss" scoped>
.login {
	position: fixed;
	top: 0;
	left: 0;
	width: 100%;
	height: 100%;
	z-index: 1000;
	display: flex;
	justify-content: center;
	align-items: center;
}
</style>
