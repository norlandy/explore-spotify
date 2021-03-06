<template>
	<div class="album-info">
		<img :src="album.images[1].url" alt="" class="album-img" />

		<div class="track-info">
			<p class="text-body-1 mb-0">{{ album.track.name }}</p>

			<div class="track-authors">
				<span
					class="author text-body-2"
					v-for="(person, index) in album.track.artists"
					:key="person.name"
				>
					{{ person.name }}{{ index !== album.track.artists.length - 1 ? ', ' : '' }}
				</span>
			</div>
		</div>

		<div class="album-info">
			<p class="text-body-1 mb-0">The top track on Spotify for:</p>
			<p class="text-h5">{{ album.name }}</p>
		</div>
	</div>
</template>

<script>
export default {
	props: ['album'],
}
</script>

<style lang="scss" scoped>
@import '@/assets/variables.scss';

.album-info {
	width: $info-width;
	display: flex;
	flex-direction: column;
	position: sticky;
	top: 100px;

	.album-img {
		flex: 1;
		margin-bottom: 15px;
	}

	.track-info {
		margin-bottom: 10px;
	}
}
</style>
