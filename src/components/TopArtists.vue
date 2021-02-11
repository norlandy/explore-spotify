<template>
	<div class="top-artists">
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
	display: flex;
	flex-wrap: wrap;
	width: 704px;

	.artist {
		width: calc(704px / 7 - 12px);
		height: calc(704px / 7 - 12px);
		background-repeat: no-repeat;
		background-size: cover;
		border-radius: 100%;
		margin: 6px;
	}
}
</style>
