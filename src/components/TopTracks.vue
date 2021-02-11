<template>
	<div class="top-tracks">
		<div class="sorting">
			<Chip
				label="Last Month"
				value="short_term"
				:active="timeRange === 'short_term'"
				:onClick="handleTimeRangeChange"
			/>
			<Chip
				label="Last 6 Month"
				value="medium_term"
				:active="timeRange === 'medium_term'"
				:onClick="handleTimeRangeChange"
			/>
			<Chip
				label="	All Time"
				value="long_term"
				:active="timeRange === 'long_term'"
				:onClick="handleTimeRangeChange"
			/>
		</div>

		<div class="tracks">
			<div v-for="track in tracks" :key="track.id">
				<div class="track" :style="{backgroundImage: `url(${track.album.images[1].url})`}"></div>
			</div>
		</div>
	</div>
</template>

<script>
import Chip from '@/components/Chip'
import {getUsersTop} from '../utils/spotify'

export default {
	components: {
		Chip,
	},

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
		handleTimeRangeChange(value) {
			this.timeRange = value

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
	.sorting {
		margin-bottom: 20px;
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
