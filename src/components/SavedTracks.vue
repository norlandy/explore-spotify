<template>
	<div class="saved-tracks">
		<div class="track-list">
			<v-container class="header" fluid>
				<v-row align="center">
					<v-col md="6" xs="12">
						<p class="text-h5 mb-0">Your Saved Tracks</p>
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
				<div v-if="loading">
					<v-skeleton-loader
						v-for="index in 104"
						:key="index"
						class="skeleton-loader"
						type="card"
						tile
					></v-skeleton-loader>
				</div>

				<div v-else v-for="track in sortedTracks" :key="track.uid">
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

		<TrackInfo v-if="selectedTrack" :track="selectedTrack" />
	</div>
</template>

<script>
import _ from 'lodash'

import spotify from '@/utils/spotify'
import TrackInfo from './TrackInfo'

export default {
	components: {
		TrackInfo,
	},
	data() {
		return {
			loading: true,
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

			this.loading = false

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
@import '@/assets/variables.scss';

.saved-tracks {
	display: flex;
	justify-content: flex-start;
	align-items: flex-start;

	.track-list {
		width: $list-width;
		margin-right: 40px;

		.header {
			margin-bottom: 20px;
			padding: 0;
		}

		.tracks {
			display: flex;
			flex-wrap: wrap;
			line-height: 0;

			.skeleton-loader {
				width: calc(#{$list-width} / 22);
				height: calc(#{$list-width} / 22);
				display: inline-block;
			}

			.track {
				width: calc(#{$list-width} / 22);
				height: calc(#{$list-width} / 22);
				background-repeat: no-repeat;
				background-size: cover;
			}
		}
	}
}
</style>
