<template>
	<div class="top-tracks">
		<div class="track-list">
			<div class="header">
				<p class="text-h5 mb-0">Your Top Tracks</p>
			</div>

			<div class="sorting">
				<v-chip-group mandatory active-class="purple--text">
					<v-chip data-value="short_term" @click="handleChangeTimeRange">
						Last Month
					</v-chip>
					<v-chip data-value="medium_term" @click="handleChangeTimeRange">
						Last 6 Month
					</v-chip>
					<v-chip data-value="long_term" @click="handleChangeTimeRange">
						All Time
					</v-chip>
				</v-chip-group>
			</div>

			<div class="tracks">
				<div v-if="loading">
					<v-skeleton-loader
						v-for="index in 24"
						:key="index"
						class="skeleton-loader"
						type="card"
						tile
					></v-skeleton-loader>
				</div>

				<div v-else v-for="track in tracks" :key="track.id">
					<div
						class="track"
						v-if="track.preview_url"
						:style="{backgroundImage: `url(${track.album.images[1].url})`}"
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
import spotify from '@/utils/spotify'
import TrackInfo from '@/components/TrackInfo'

export default {
	components: {
		TrackInfo,
	},
	data() {
		return {
			loading: false,
			tracks: [],
			timeRange: 'short_term',
			selectedTrack: null,
			audio: null,
		}
	},

	methods: {
		async getTopTracks() {
			const tracks = await spotify.getUsersTop({
				type: 'tracks',
				offset: this.tracks.length,
				timeRange: this.timeRange,
			})

			this.loading = false

			if (tracks.length) {
				this.tracks = this.tracks.concat(tracks)
				this.getTopTracks()
			}
		},
		handleChangeTimeRange(e) {
			this.timeRange = e.currentTarget.dataset.value

			this.loading = true
			this.tracks = []
			this.getTopTracks()
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
		this.getTopTracks()
	},
}
</script>

<style lang="scss" scoped>
@import '@/assets/variables.scss';

.top-tracks {
	display: flex;
	align-items: flex-start;
	.track-list {
		width: $list-width;
		margin-right: 40px;

		.header {
			margin-bottom: 10px;
		}

		.sorting {
			margin-bottom: 10px;
		}

		.tracks {
			display: flex;
			flex-wrap: wrap;

			.skeleton-loader {
				width: calc(#{$list-width} / 7);
				height: calc(#{$list-width} / 7);
				display: inline-block;
			}

			.track {
				width: calc(#{$list-width} / 7);
				height: calc(#{$list-width} / 7);
				background-repeat: no-repeat;
				background-size: cover;
			}
		}
	}
}
</style>
