<template>
	<header class="header">
		<div class="logo">
			<div class="logo-circle"></div>

			<p class="title">Explore Spotify</p>
		</div>

		<div class="profile" v-if="user">
			<p class="username">{{ user.display_name }}</p>

			<div
				class="avatar"
				:style="{
					backgroundImage: `url(${user.images[0].url})`,
					border: menu ? '2px solid red' : 'none',
				}"
				@click="menu = !menu"
				data-avatar="true"
			></div>

			<div class="menu" v-if="menu">
				<ul>
					<li @click="exit">Logout</li>
				</ul>
			</div>
		</div>
	</header>
</template>

<script>
export default {
	props: ['user', 'exit'],

	data() {
		return {
			menu: false,
		}
	},

	methods: {
		handleClick(e) {
			if (!e.target.dataset.avatar) {
				this.menu = false
			}
		},
	},

	mounted() {
		document.addEventListener('click', this.handleClick)
	},

	beforeDestroy() {
		document.removeEventListener('click', this.handleClick)
	},
}
</script>

<style lang="scss" scoped>
.header {
	padding: 20px;
	border: 1px solid red;
	display: flex;
	justify-content: space-between;
	align-items: center;

	.logo {
		display: flex;
		align-items: center;

		.logo-circle {
			width: 30px;
			height: 30px;
			margin-right: 15px;
			border-radius: 100px;
			background-image: linear-gradient(rgb(140, 19, 221), rgb(4, 77, 172));
		}

		.title {
			font-size: 38px;
		}
	}

	.profile {
		display: flex;
		align-items: center;
		position: relative;
		position: relative;

		.menu {
			position: absolute;
			right: 0;
			top: 0;
			transform: translateY(40px);
			width: 200px;
			border: 1px solid red;
			z-index: 200;
			background-color: black;

			ul {
				li {
					list-style: none;
					cursor: pointer;
					padding: 10px;
				}
			}
		}

		.username {
			margin-right: 10px;
		}

		.avatar {
			width: 30px;
			height: 30px;
			border-radius: 100px;
			background-color: red;
			background-repeat: no-repeat;
			background-size: cover;
			cursor: pointer;
		}
	}
}
</style>
