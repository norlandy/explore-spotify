<template>
	<v-app class="app">
		<Login v-if="!isAuth" />

		<div v-else>
			<Header :user="me" :exit="exit" />

			<v-main>
				<v-container fluid>
					<v-chip-group active-class="purple--text" column mandatory class="navigation">
						<v-chip @click="handleChangeAction" data-action="saved_tracks"
							>Your Saved Tracks</v-chip
						>
						<v-chip @click="handleChangeAction" data-action="followed_artists"
							>Your Followed Artists</v-chip
						>
						<v-chip @click="handleChangeAction" data-action="top_tracks">Your Top Tracks</v-chip>
						<v-chip @click="handleChangeAction" data-action="top_artists">Your Top Artists</v-chip>
					</v-chip-group>

					<div>
						<SavedTracks v-if="actionType === 'saved_tracks'" />

						<FollowedArtists v-if="actionType === 'followed_artists'" />

						<TopTracks v-if="actionType === 'top_tracks'" />

						<TopArtists v-if="actionType === 'top_artists'" />
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
import * as spotify from '@/utils/spotify'

export default {
	components: {
		Header,
		Footer,
		Login,
		SavedTracks,
		FollowedArtists,
		TopTracks,
		TopArtists,
	},

	data() {
		return {
			token: localStorage.getItem('token') || '',
			me: null,
			actionType: 'saved_tracks',
		}
	},

	computed: {
		isAuth() {
			return this.token
		},
	},

	methods: {
		handleChangeAction(e) {
			this.actionType = e.currentTarget.dataset.action
		},
		exit() {
			const url = 'https://www.spotify.com/logout/'
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
			const me = await spotify.getMe()

			this.me = me
		} else {
			const token = spotify.getTokenFromResponse()

			if (token) {
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
