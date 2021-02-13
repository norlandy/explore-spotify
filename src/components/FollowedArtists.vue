<template>
	<div class="followed-artists">
		<v-container class="header" fluid>
			<v-row align="center">
				<v-col md="6" xs="12">
					<p class="text-h5 title">Your Followed Artists</p>
				</v-col>

				<v-spacer></v-spacer>

				<v-col md="4" xs="12">
					<v-select
						:items="sortedBy"
						v-model="selectedSort"
						color="purple"
						class="select"
						item-color="purple"
						solo
						hide-details
					></v-select>
				</v-col>
			</v-row>
		</v-container>

		<div class="artists">
			<div v-for="artist in sortedArtists" :key="artist.id">
				<div
					class="artist"
					:style="{
						backgroundImage: `url(${artist.images.length && artist.images[2].url})`,
					}"
				>
					<v-icon v-if="!artist.images.length" color="purple" large>mdi-account</v-icon>
				</div>
			</div>
		</div>
	</div>
</template>

<script>
import _ from 'lodash'

import {getFollowedArtists} from '../utils/spotify'

export default {
	data() {
		return {
			artists: [],
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
			const artists = await getFollowedArtists({
				after: this.artists.length ? this.artists[this.artists.length - 1].id : '',
			})

			if (artists.length) {
				this.artists = this.artists.concat(artists)
				this.getFollowedArtists()
			}
		},
	},

	mounted() {
		this.getFollowedArtists()
	},
}
</script>

<style lang="scss" scoped>
.followed-artists {
	width: 704px;

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

		.artist {
			width: calc(704px / 12 - 12px);
			height: calc(704px / 12 - 12px);
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
</style>
