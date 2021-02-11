<template>
	<div id="root">
		<Login v-if="!isAuth" />

		<div class="page-wrapper" v-else>
			<Header :user="me" :exit="exit" />

			<main class="content">
				<div class="actions">
					<Chip
						label="Your Saved Tracks"
						value="saved_tracks"
						:active="actionType === 'saved_tracks'"
						:onClick="handleActionChange"
					/>
					<Chip
						label="Your Followed Artists"
						value="followed_artists"
						:active="actionType === 'followed_artists'"
						:onClick="handleActionChange"
					/>
					<Chip
						label="Your Top Tracks"
						value="top_tracks"
						:active="actionType === 'top_tracks'"
						:onClick="handleActionChange"
					/>
					<Chip
						label="Your Top Artists"
						value="top_artists"
						:active="actionType === 'top_artists'"
						:onClick="handleActionChange"
					/>
				</div>

				<div class="data">
					<SavedTracks v-if="actionType === 'saved_tracks'" />

					<TopTracks v-if="actionType === 'top_tracks'" />

					<TopArtists v-if="actionType === 'top_artists'" />

					<FollowedArtists v-if="actionType === 'followed_artists'" />
				</div>
			</main>
		</div>
	</div>
</template>

<script>
import Header from '@/components/layouts/Header'
import Login from '@/components/layouts/Login'
import SavedTracks from '@/components/SavedTracks'
import TopTracks from '@/components/TopTracks'
import TopArtists from '@/components/TopArtists'
import FollowedArtists from '@/components/FollowedArtists'
import Chip from '@/components/Chip'
import * as spotify from '@/utils/spotify'

export default {
	components: {
		Header,
		Login,
		SavedTracks,
		TopTracks,
		TopArtists,
		FollowedArtists,
		Chip,
	},

	data() {
		return {
			token: localStorage.getItem('token') || '',
			me: null,
			actionType: '',
		}
	},

	computed: {
		isAuth() {
			return this.token
		},
	},

	methods: {
		login: spotify.login,
		handleActionChange(value) {
			this.actionType = value
		},
		exit() {
			this.token = ''
			this.me = null

			localStorage.removeItem('token')
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

<style lang="scss" src="./App.scss"></style>
