<template>
	<div id="root">
		<Login v-if="!isAuth" />

		<div class="page-wrapper" v-else>
			<Header :user="me" :exit="exit" />

			<main class="content">
				<div class="actions">
					<button @click="handleSelect" data-action="saved_tracks">Your Saved Tracks</button>
				</div>

				<div class="tracks">
					<div class="track-list">
						<p v-if="loadingTracks">Loading...</p>

						<div v-else v-for="track in tracks" :key="track.id">
							<div
								class="track"
								v-if="track.preview_url"
								:style="{backgroundImage: `url(${track.album.images[2].url})`}"
								@mouseover="handleMouseOver(track)"
								@mouseout="handleMouseOut"
							></div>
						</div>
					</div>

					<div class="track-info" v-if="selectedTrack">
						<img :src="selectedTrack.album.images[0].url" alt="" class="track-img" />

						<p class="track-name">{{ selectedTrack.name }}</p>

						<div class="track-authors">
							<span
								class="author"
								v-for="(artist, index) in selectedTrack.artists"
								:key="artist.name"
							>
								{{ artist.name }}{{ index !== selectedTrack.artists.length - 1 && ', ' }}
							</span>
						</div>
					</div>
				</div>
			</main>
		</div>
	</div>
</template>

<script>
import Header from '@/components/Header'
import Login from '@/components/Login'
import * as spotify from '@/utils/spotify'

export default {
	components: {
		Header,
		Login,
	},

	data() {
		return {
			token: localStorage.getItem('token') || '',
			me: null,
			tracks: [],
			selectedTrack: null,
			audio: null,
			loadingTracks: false,
		}
	},

	computed: {
		isAuth() {
			return this.token
		},
	},

	methods: {
		login: spotify.login,
		async getSavedTracks() {
			this.loadingTracks = true

			const tracks = await spotify.getSavedTracks({
				token: this.token,
				offset: this.tracks.length,
			})

			if (tracks.length) {
				this.tracks = this.tracks.concat(tracks)
				this.getSavedTracks()
			} else {
				this.loadingTracks = false
			}
		},
		handleMouseOver(track) {
			this.audio = new Audio(track.preview_url)
			this.audio.volume = 0.5
			this.audio.play()
			this.selectedTrack = track
		},
		handleMouseOut() {
			this.audio.pause()
			this.audio = null
			this.selectedTrack = null
		},
		handleSelect(e) {
			e.target.classList.add('active')

			if (e.target.dataset.action) {
				switch (e.target.dataset.action) {
					case 'saved_tracks':
						this.getSavedTracks()
				}
			}
		},
		exit() {
			this.token = ''
			this.me = null

			localStorage.removeItem('token')
		},
	},

	async mounted() {
		if (this.token) {
			const me = await spotify.getMe(this.token)

			this.me = me
		} else {
			const token = spotify.getTokenFromResponse()

			if (token) {
				this.token = token

				localStorage.setItem('token', token)

				window.location.hash = ''

				const me = await spotify.getMe(token)

				this.me = me
			}
		}
	},
}
</script>

<style lang="scss" src="./App.scss"></style>
