<template>
	<div class="saved-tracks">
		<div class="track-list">
			<v-container class="header" fluid>
				<v-row align="center">
					<v-col md="6" xs="12">
						<p class="text-h5 title">Your Saved Tracks</p>
					</v-col>

					<v-spacer></v-spacer>

					<v-col md="4" xs="12">
						<v-select
							:items="sortedBy"
							v-model="selectedSort"
							color="purple"
							item-color="purple"
							solo
							hide-details
						></v-select>
					</v-col>
				</v-row>
			</v-container>

			<div class="tracks">
				<div v-for="track in sortedTracks" :key="track.uid">
					<div
						class="track"
						v-if="track.preview_url"
						:style="{backgroundImage: `url(${track.album.images[2].url})`}"
						@mouseover="handleMouseOver(track)"
						@mouseout="handleMouseOut"
					></div>
				</div>
			</div>
		</div>

		<div class="track-info" v-if="selectedTrack">
			<img :src="selectedTrack.album.images[0].url" alt="" class="track-img" />

			<p class="track-name text-body-1">{{ selectedTrack.name }}</p>

			<div class="track-authors">
				<span
					class="author text-body-2"
					v-for="(artist, index) in selectedTrack.artists"
					:key="artist.name"
				>
					{{ artist.name }}{{ index !== selectedTrack.artists.length - 1 && ', ' }}
				</span>
			</div>
		</div>
	</div>
</template>

<script>
import _ from 'lodash'

import spotify from '@/utils/spotify'

export default {
	data() {
		return {
			tracks: [],
			selectedTrack: null,
			audio: null,
			selectedSort: 'by_save_date',
			sortedBy: [
				{
					text: 'Sorted by save date',
					value: 'by_save_date',
				},
				{
					text: 'Sorted by artist',
					value: 'by_artist',
				},
				{
					text: 'Sorted by album',
					value: 'by_album',
				},
			],
		}
	},

	computed: {
		sortedTracks() {
			switch (this.selectedSort) {
				case 'by_save_date':
					return _.orderBy(this.tracks, ['added_at'], ['desc'])
				case 'by_artist':
					return _.orderBy(this.tracks, track => track.artists[0].name.toLowerCase())
				case 'by_album':
					return _.orderBy(this.tracks, track => track.album.name.toLowerCase())
				default:
					return this.tracks
			}
		},
	},

	methods: {
		async getSavedTracks() {
			const tracks = await spotify.getSavedTracks({
				offset: this.tracks.length,
			})

			if (tracks.length) {
				this.tracks = this.tracks.concat(tracks)
				this.getSavedTracks()
			}
		},
		handleMouseOver(track) {
			this.audio = new Audio(track.preview_url)
			this.audio.volume = 0.5
			this.audio.play().catch(() => {})

			this.selectedTrack = track
		},
		handleMouseOut() {
			this.audio.pause()
			this.audio = null

			this.selectedTrack = null
		},
	},

	mounted() {
		this.getSavedTracks()
	},
}
</script>

<style lang="scss" scoped>
.saved-tracks {
	display: flex;
	justify-content: flex-start;
	align-items: flex-start;
	width: 100%;

	.track-list {
		width: 704px;
		margin-right: 40px;

		.header {
			margin-bottom: 20px;
			padding: 0;
		}

		.tracks {
			display: flex;
			flex-wrap: wrap;
			line-height: 0;

			.track {
				width: calc(704px / 22);
				height: calc(704px / 22);
				background-repeat: no-repeat;
				background-size: cover;
			}
		}
	}

	.track-info {
		width: 300px;
		display: flex;
		flex-direction: column;
		position: sticky;
		top: 100px;

		.track-img {
			flex: 1;
			margin-bottom: 15px;
		}

		.track-name {
			margin-bottom: 0;
		}
	}
}
</style>
