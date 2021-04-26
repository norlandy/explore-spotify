<template>
	<div class="followed-artists">
		<div class="artists-list">
			<v-container class="header" fluid>
				<v-row align="center">
					<v-col md="6" xs="12">
						<p class="text-h5 mb-0">Your Followed Artists</p>
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

			<div class="artists">
				<div v-if="loading">
					<v-skeleton-loader
						v-for="index in 64"
						:key="index"
						class="skeleton-loader"
						type="card"
						tile
					></v-skeleton-loader>
				</div>

				<div v-else v-for="artist in sortedArtists" :key="artist.id">
					<div
						class="artist"
						:style="{
							backgroundImage: `url(${artist.images.length && artist.images[2].url})`,
						}"
						@mouseover="handleMouseOver(artist)"
						@mouseout="handleMouseOut"
					>
						<v-icon v-if="!artist.images.length" color="purple" large>mdi-account</v-icon>
					</div>
				</div>
			</div>
		</div>

		<ArtistInfo v-if="selectedArtist" :artist="selectedArtist" />
	</div>
</template>

<script>
import _ from 'lodash'

import spotify from '@/utils/spotify'
import ArtistInfo from './ArtistInfo'

export default {
	components: {
		ArtistInfo,
	},
	data() {
		return {
			loading: true,
			artists: [],
			audio: null,
			selectedArtist: null,
			selectedSort: 'by_name',
			sortedBy: [
				{
					text: 'Sorted by name',
					value: 'by_name',
				},
				{
					text: 'Sorted by popularity',
					value: 'by_popularity',
				},
				{
					text: 'Sorted by followers',
					value: 'by_followers',
				},
			],
		}
	},

	computed: {
		sortedArtists() {
			switch (this.selectedSort) {
				case 'by_name':
					return _.orderBy(this.artists, artist => artist.name.toLowerCase())
				case 'by_popularity':
					return _.orderBy(this.artists, ['popularity'], ['desc'])
				case 'by_followers':
					return _.orderBy(this.artists, artist => artist.followers.total, ['desc'])
				default:
					return _.orderBy(this.artists, artist => artist.name.toLowerCase())
			}
		},
	},

	methods: {
		async getFollowedArtists() {
			const artists = await spotify.getFollowedArtists({
				after: this.artists.length ? this.artists[this.artists.length - 1].id : '',
			})

			this.loading = false

			if (artists.length) {
				this.artists = this.artists.concat(artists)
				this.getFollowedArtists()
			}
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
		this.getFollowedArtists()
	},
}
</script>

<style lang="scss" scoped>
@import '@/assets/variables.scss';

.followed-artists {
	display: flex;
	justify-content: flex-start;
	align-items: flex-start;

	.artists-list {
		width: #{$list-width};
		margin-right: 40px;

		.header {
			margin-bottom: 20px;
			padding: 0;
			display: flex;
			justify-content: space-between;
			align-items: center;
		}

		.artists {
			display: flex;
			flex-wrap: wrap;

			.skeleton-loader {
				width: calc(#{$list-width} / 12 - 12px);
				height: calc(#{$list-width} / 12 - 12px);
				display: inline-block;

				border-radius: 100%;
				margin: 6px;
			}

			.artist {
				width: calc(#{$list-width} / 12 - 12px);
				height: calc(#{$list-width} / 12 - 12px);
				background-repeat: no-repeat;
				background-size: cover;
				border-radius: 100%;
				margin: 6px;
				display: flex;
				align-items: center;
				justify-content: center;
			}
		}
	}
}
</style>
