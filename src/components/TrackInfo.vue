<template>
	<div class="track-info">
		<img :src="track.album.images[0].url" alt="" class="track-img" />

		<p class="text-body-1 mb-0">{{ track.name }}</p>

		<div class="track-authors">
			<span class="author text-body-2" v-for="(artist, index) in track.artists" :key="artist.name">
				{{ artist.name }}{{ index !== track.artists.length - 1 ? ', ' : '' }}
			</span>
		</div>
	</div>
</template>

<script>
export default {
	props: ['track'],
}
</script>

<style lang="scss" scoped>
@import '@/assets/variables.scss';

.track-info {
	width: $info-width;
	display: flex;
	flex-direction: column;
	position: sticky;
	top: 100px;

	.track-img {
		flex: 1;
		margin-bottom: 15px;
	}
}
</style>
