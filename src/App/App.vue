<template>
	<v-app class="app">
		<Login v-if="!isAuth" />

		<div v-else>
			<Header :user="me" :exit="exit" />

			<v-main>
				<v-container fluid>
					<v-chip-group active-class="purple--text" column mandatory class="navigation">
						<v-chip
							v-for="action in actions"
							@click="handleChangeAction"
							:data-value="action.type"
							:key="action.type"
							>{{ action.label }}
						</v-chip>
					</v-chip-group>

					<div>
						<SavedTracks v-if="actionType === 'saved_tracks'" />

						<FollowedArtists v-if="actionType === 'followed_artists'" />

						<TopTracks v-if="actionType === 'top_tracks'" />

						<TopArtists v-if="actionType === 'top_artists'" />

						<NewReleases v-if="actionType === 'new_releases'" />
					</div>
				</v-container>
			</v-main>

			<Footer />
		</div>
	</v-app>
</template>

<script>
import Header from '@/components/layouts/Header'
import Footer from '@/components/layouts/Footer'
import Login from '@/components/layouts/Login'
import TopTracks from '@/components/TopTracks'
import TopArtists from '@/components/TopArtists'
import SavedTracks from '@/components/SavedTracks'
import FollowedArtists from '@/components/FollowedArtists'
import NewReleases from '@/components/NewReleases'
import spotify from '@/utils/spotify'
import * as auth from '@/utils/auth'

export default {
	components: {
		Header,
		Footer,
		Login,
		SavedTracks,
		FollowedArtists,
		TopTracks,
		TopArtists,
		NewReleases,
	},

	data() {
		return {
			token: localStorage.getItem('token'),
			me: null,
			actionType: 'saved_tracks',
			actions: [
				{
					label: 'Your Saved Tracks',
					type: 'saved_tracks',
				},
				{
					label: 'Your Followed Artists',
					type: 'followed_artists',
				},
				{
					label: 'Your Top Tracks',
					type: 'top_tracks',
				},
				{
					label: 'Your Top Artists',
					type: 'top_artists',
				},
				{
					label: 'New Releases',
					type: 'new_releases',
				},
			],
		}
	},

	computed: {
		isAuth() {
			return this.token
		},
	},

	methods: {
		handleChangeAction(e) {
			this.actionType = e.currentTarget.dataset.value
		},
		exit() {
			const url = auth.LOGOUT_URL
			const spotifyLogoutWindow = window.open(
				url,
				'Spotify Logout',
				'width=700,height=500,top=40,left=40',
			)
			setTimeout(() => {
				spotifyLogoutWindow.close()

				this.token = ''
				this.me = null

				localStorage.removeItem('token')
			}, 2000)
		},
	},

	async mounted() {
		if (this.token) {
			spotify.setAccessToken(this.token)

			const me = await spotify.getMe()

			this.me = me
		} else {
			const token = auth.getTokenFromResponse()

			if (token) {
				spotify.setAccessToken(token)

				this.token = token

				localStorage.setItem('token', token)

				window.location.hash = ''

				const me = await spotify.getMe()

				this.me = me
			}
		}
	},
}
</script>

<style lang="scss">
.app {
	.navigation {
		margin-bottom: 20px;
	}

	.title {
		margin-bottom: 0;
	}
}
</style>
