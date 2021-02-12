<template>
	<div class="top-artists">
		<div class="header">
			<p class="text-h5 title">Your Top Artists</p>
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
import {getUsersTop} from '../utils/spotify'

export default {
	data() {
		return {
			artists: [],
		}
	},

	methods: {
		async getTopArtists() {
			const artists = await getUsersTop({type: 'artists'})

			this.artists = artists
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
		margin-bottom: 16px;
	}

	.artists {
		display: flex;
		flex-wrap: wrap;

		.artist {
			width: calc(704px / 7 - 12px);
			height: calc(704px / 7 - 12px);
			background-repeat: no-repeat;
			background-size: cover;
			border-radius: 100%;
			margin: 6px;
		}
	}
}
</style>
