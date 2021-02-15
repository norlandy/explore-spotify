<template>
	<div class="top-artists">
		<div class="header">
			<p class="text-h5 title">Your Top Artists</p>
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

		<div class="artists">
			<div v-if="loading">
				<v-skeleton-loader
					v-for="index in 24"
					:key="index"
					class="skeleton-loader"
					type="card"
					tile
				></v-skeleton-loader>
			</div>

			<div v-else v-for="artist in artists" :key="artist.id">
				<div
					class="artist"
					:style="{
						backgroundImage: `url(${artist.images.length && artist.images[2].url})`,
					}"
				>
					<v-icon v-if="!artist.images.length" color="purple" x-large>mdi-account</v-icon>
				</div>
			</div>
		</div>
	</div>
</template>

<script>
import spotify from '@/utils/spotify'

export default {
	data() {
		return {
			loading: false,
			artists: [],
			timeRange: 'short_term',
		}
	},

	methods: {
		async getTopArtists() {
			const artists = await spotify.getUsersTop({
				type: 'artists',
				offset: this.artists.length,
				timeRange: this.timeRange,
			})

			this.loading = false

			if (artists.length) {
				this.artists = this.artists.concat(artists)
				this.getTopArtists()
			}
		},
		handleChangeTimeRange(e) {
			this.timeRange = e.currentTarget.dataset.value

			this.loading = true
			this.artists = []
			this.getTopArtists()
		},
	},

	mounted() {
		this.getTopArtists()
	},
}
</script>

<style lang="scss" scoped>
.top-artists {
	width: 704px;

	.header {
		margin-bottom: 10px;
	}

	.sorting {
		margin-bottom: 10px;
	}

	.artists {
		display: flex;
		flex-wrap: wrap;

		.skeleton-loader {
			width: calc(704px / 7 - 12px);
			height: calc(704px / 7 - 12px);
			border-radius: 100%;
			margin: 6px;
			display: inline-block;
		}

		.artist {
			width: calc(704px / 7 - 12px);
			height: calc(704px / 7 - 12px);
			background-repeat: no-repeat;
			background-size: cover;
			border-radius: 100%;
			margin: 6px;
			display: flex;
			justify-content: center;
			align-items: center;
		}
	}
}
</style>
