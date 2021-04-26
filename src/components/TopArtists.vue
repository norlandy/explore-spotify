<template>
	<div class="top-artists">
		<div class="artist-list">
			<div class="header">
				<p class="text-h5 mb-0">Your Top Artists</p>
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
						@mouseover="handleMouseOver(artist)"
						@mouseout="handleMouseOut"
					>
						<v-icon v-if="!artist.images.length" color="purple" x-large>mdi-account</v-icon>
					</div>
				</div>
			</div>
		</div>

		<ArtistInfo v-if="selectedArtist" :artist="selectedArtist" />
	</div>
</template>

<script>
import spotify from '@/utils/spotify'
import ArtistInfo from '@/components/ArtistInfo'

export default {
	components: {
		ArtistInfo,
	},
	data() {
		return {
			loading: true,
			artists: [],
			timeRange: 'short_term',
			selectedArtist: null,
			audio: null,
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
		handleMouseOver(artist) {
			this.selectedArtist = artist

			this.audio = new Audio(artist.track.preview_url)
			this.audio.volume = 0.5
			this.audio.play().catch(() => {})
		},
		handleMouseOut() {
			this.audio.pause()
			this.audio = null

			this.selectedArtist = null
		},
	},

	mounted() {
		this.getTopArtists()
	},
}
</script>

<style lang="scss" scoped>
@import '@/assets/variables.scss';

.top-artists {
	display: flex;
	align-items: flex-start;

	.artist-list {
		width: $list-width;
		margin-right: 40px;

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
}
</style>
