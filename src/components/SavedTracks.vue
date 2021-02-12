<template>
	<div class="saved-tracks">
		<div class="track-list">
			<div class="header">
				<p class="text-h5 title">Your Saved Tracks</p>

				<v-select
					:items="sortedBy"
					color="purple"
					class="select"
					item-color="purple"
					v-model="selectedSort"
					@change="handleChangeSort"
					outlined
					hide-details
				></v-select>
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
			selectedSort: {
				value: 'by_save_date',
			},
			sortedBy: [
				{
					text: 'Sorted by save date',
					value: 'by_save_date',
				},
				{
					text: 'Sorted by artist',
					value: 'by_artist',
				},
				{
					text: 'Sorted by album',
					value: 'by_album',
				},
			],
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
		handleChangeSort(value) {
			switch (value) {
				case 'by_save_date':
					this.tracks = _.orderBy(this.tracks, ['added_at'], ['desc'])
					break
				case 'by_artist':
					this.tracks = _.orderBy(this.tracks, track => track.artists[0].name)
					break
				case 'by_album':
					this.tracks = _.orderBy(this.tracks, track => track.album.name)
					break
			}
		},
		handleMouseOver(track) {
			this.audio = new Audio(track.preview_url)
			this.audio.volume = 0.5
			this.audio.play().catch(() => {})

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
			margin-bottom: 16px;
			display: flex;
			align-items: center;
			justify-content: space-between;

			.title {
				margin-right: 250px;
			}

			.select {
				width: 100px !important;
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
