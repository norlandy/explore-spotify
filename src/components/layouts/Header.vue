<template>
	<v-app-bar app class="header" height="70" hide-on-scroll>
		<div class="logo-circle"></div>

		<v-toolbar-title class="text-h4">Explore Spotify</v-toolbar-title>

		<v-spacer></v-spacer>

		<div class="profile" v-if="user">
			<span class="username">{{ user.display_name }}</span>

			<v-menu bottom min-width="200px" rounded offset-y>
				<template v-slot:activator="{on}">
					<v-btn icon v-on="on" color="purple">
						<v-avatar size="40">
							<img :src="user.images[0].url" alt="" />
						</v-avatar>
					</v-btn>
				</template>

				<v-list>
					<v-list-item link @click="exit">
						<v-list-item-title>Log out of Spotify</v-list-item-title>
					</v-list-item>
				</v-list>
			</v-menu>
		</div>
	</v-app-bar>
</template>

<script>
export default {
	props: ['user', 'exit'],
}
</script>

<style lang="scss" scoped>
.header {
	.logo-circle {
		width: 30px;
		height: 30px;
		margin-right: 15px;
		border-radius: 100px;
		background-image: linear-gradient(rgb(140, 19, 221), rgb(4, 77, 172));
	}

	.profile {
		display: flex;
		align-items: center;

		.username {
			margin-right: 10px;
		}
	}
}
</style>
