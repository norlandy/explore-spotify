<template>
	<div class="top-tracks">
		<div class="header">
			<p class="text-h5 title">Your Top Tracks</p>
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
			<div v-for="track in tracks" :key="track.id">
				<div class="track" :style="{backgroundImage: `url(${track.album.images[1].url})`}"></div>
			</div>
		</div>
	</div>
</template>

<script>
import {getUsersTop} from '../utils/spotify'

export default {
	data() {
		return {
			tracks: [],
			timeRange: 'short_term',
		}
	},

	methods: {
		async getTopTracks() {
			const tracks = await getUsersTop({
				type: 'tracks',
				offset: this.tracks.length,
				timeRange: this.timeRange,
			})

			if (tracks.length) {
				this.tracks = this.tracks.concat(tracks)
				this.getTopTracks()
			}
		},
		handleChangeTimeRange(e) {
			this.timeRange = e.currentTarget.dataset.value

			this.tracks = []
			this.getTopTracks()
		},
	},

	mounted() {
		this.getTopTracks()
	},
}
</script>

<style lang="scss" scoped>
.top-tracks {
	.header {
		margin-bottom: 12px;
	}

	.sorting {
		margin-bottom: 12px;
	}

	.tracks {
		display: flex;
		flex-wrap: wrap;
		width: 704px;

		.track {
			width: calc(704px / 7);
			height: calc(704px / 7);
			background-repeat: no-repeat;
			background-size: cover;
		}
	}
}
</style>
