<template>
	<div class="artist-info">
		<img :src="artist.images[1].url" alt="" class="artist-img" />

		<div class="track-info">
			<p class="text-body-1 mb-0">{{ artist.track.name }}</p>

			<div class="track-authors">
				<span
					class="author text-body-2"
					v-for="(person, index) in artist.track.artists"
					:key="person.name"
				>
					{{ person.name }}{{ index !== artist.track.artists.length - 1 ? ', ' : '' }}
				</span>
			</div>
		</div>

		<div class="artist-info">
			<p class="text-body-1 mb-0">The top track on Spotify for:</p>
			<p class="text-h5">{{ artist.name }}</p>
		</div>
	</div>
</template>

<script>
export default {
	props: ['artist'],
}
</script>

<style lang="scss" scoped>
@import '@/assets/variables.scss';

.artist-info {
	width: $info-width;
	display: flex;
	flex-direction: column;
	position: sticky;
	top: 100px;

	.artist-img {
		flex: 1;
		margin-bottom: 15px;
	}

	.track-info {
		margin-bottom: 10px;
	}
}
</style>
