<template>
	<div class="followed-artists">
		<div class="header">
			<p class="text-h5 title">Your Followed Artists</p>
		</div>

		<div class="artists">
			<div v-for="artist in artists" :key="artist.id">
				<div
					class="artist"
					:style="{
						backgroundImage: `url(${artist.images.length && artist.images[2].url})`,
						backgroundColor: !artist.images.length && 'red',
					}"
				></div>
			</div>
		</div>
	</div>
</template>

<script>
import {getFollowedArtists} from '../utils/spotify'

export default {
	data() {
		return {
			artists: [],
		}
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
		margin-bottom: 16px;
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
		}
	}
}
</style>
