<template>
	<div class="saved-tracks">
		<div class="track-list">
			<div class="header">
				<p class="title">Your Saved Tracks</p>

				<select @change="handleSortChange">
					<option value="by_save_date">Sort by save date</option>
					<option value="by_artist">Sort by artist</option>
					<option value="by_album">Sort by album</option>
				</select>
			</div>

			<div class="tracks">
				<div v-for="track in tracks" :key="track.uid">
					<div
						class="track"
						v-if="track.preview_url"
						:style="{backgroundImage: `url(${track.album.images[2].url})`}"
						@mouseover="handleMouseOver(track)"
						@mouseout="handleMouseOut"
					></div>
				</div>
			</div>
		</div>

		<div class="track-info" v-if="selectedTrack">
			<img :src="selectedTrack.album.images[0].url" alt="" class="track-img" />

			<p class="track-name">{{ selectedTrack.name }}</p>

			<div class="track-authors">
				<span class="author" v-for="(artist, index) in selectedTrack.artists" :key="artist.name">
					{{ artist.name }}{{ index !== selectedTrack.artists.length - 1 && ', ' }}
				</span>
			</div>
		</div>
	</div>
</template>

<script>
import _ from 'lodash'

import {getSavedTracks} from '@/utils/spotify'

export default {
	data() {
		return {
			tracks: [],
			selectedTrack: null,
			audio: null,
		}
	},

	methods: {
		async getSavedTracks() {
			const tracks = await getSavedTracks({
				offset: this.tracks.length,
			})

			if (tracks.length) {
				this.tracks = this.tracks.concat(tracks)
				this.getSavedTracks()
			}
		},
		handleSortChange(e) {
			switch (e.target.value) {
				case 'by_save_date':
					this.tracks = _.sortBy(this.tracks, track => track.added_at)
					break
				case 'by_artist':
					this.tracks = _.sortBy(this.tracks, track => track.artists[0].name)
					break
				case 'by_album':
					this.tracks = _.sortBy(this.tracks, track => track.album.name)
					break
			}
		},
		handleMouseOver(track) {
			this.audio = new Audio(track.preview_url)
			this.audio.volume = 0.5
			this.audio.play()

			this.selectedTrack = track
		},
		handleMouseOut() {
			this.audio.pause()
			this.audio = null

			this.selectedTrack = null
		},
	},

	mounted() {
		this.getSavedTracks()
	},
}
</script>

<style lang="scss" scoped>
.saved-tracks {
	display: flex;
	justify-content: flex-start;
	align-items: flex-start;
	width: 100%;

	.track-list {
		width: 704px;
		margin-right: 40px;

		.header {
			display: flex;
			justify-content: space-between;
			align-items: center;
			margin-bottom: 20px;

			.title {
				font-size: 24px;
			}
		}

		.tracks {
			display: flex;
			flex-wrap: wrap;
			line-height: 0;

			.track {
				width: calc(704px / 22);
				height: calc(704px / 22);
				background-repeat: no-repeat;
				background-size: cover;
			}
		}
	}

	.track-info {
		width: 300px;
		display: flex;
		flex-direction: column;
		position: sticky;
		top: 100px;

		.track-img {
			flex: 1;
			margin-bottom: 20px;
		}

		.track-name {
			font-size: 18px;
			margin-bottom: 2px;
		}

		.track-authors {
			.author {
				font-size: 14px;
			}
		}
	}
}
</style>
