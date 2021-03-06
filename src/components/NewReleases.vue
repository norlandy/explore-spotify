<template>
	<div class="new-releases">
		<div class="new-releases-list">
			<v-container class="header" fluid>
				<v-row align="center">
					<v-col md="6" xs="12">
						<p class="text-h5 mb-0">New Releases</p>
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

			<div class="sorting">
				<v-chip-group mandatory active-class="purple--text">
					<v-chip data-value="all" @click="handleChangeViewType">
						All
					</v-chip>
					<v-chip data-value="albums" @click="handleChangeViewType">
						Albums
					</v-chip>
					<v-chip data-value="singles" @click="handleChangeViewType">
						Singles
					</v-chip>
					<v-chip data-value="compilations" @click="handleChangeViewType">
						Compilations
					</v-chip>
				</v-chip-group>
			</div>

			<div class="albums">
				<div v-for="album in sortedAlbums" :key="album.id">
					<div
						v-if="album.track.preview_url"
						class="album"
						:style="{backgroundImage: `url(${album.images[1].url})`}"
						@mouseenter="handleMouseOver(album)"
						@mouseout="handleMouseOut"
					></div>
				</div>
			</div>
		</div>

		<AlbumInfo v-if="selectedAlbum" :album="selectedAlbum" />
	</div>
</template>

<script>
import _ from 'lodash'
import moment from 'moment'

import spotify from '@/utils/spotify'
import AlbumInfo from '@/components/AlbumInfo'

export default {
	components: {
		AlbumInfo,
	},

	data() {
		return {
			albums: [],
			selectedAlbum: null,
			audio: null,
			viewType: 'all',
			sortedBy: [
				{
					text: 'Sorted by artist',
					value: 'by_artist',
				},
				{
					text: 'Sorted by album',
					value: 'by_album',
				},
				{
					text: 'Sorted by release date',
					value: 'by_release_date',
				},
			],
			selectedSort: 'by_release_date',
		}
	},

	computed: {
		sortedAlbums() {
			let albums = []

			switch (this.viewType) {
				case 'all':
					albums = this.albums
					break
				case 'albums':
					albums = this.albums.filter(album => album.album_type === 'album')
					break
				case 'singles':
					albums = this.albums.filter(album => album.album_type === 'single')
					break
				case 'compilations':
					albums = this.albums.filter(album => album.album_type === 'compilation')
					break
				default:
					albums = this.albums
			}

			switch (this.selectedSort) {
				case 'by_artist':
					albums = _.orderBy(albums, album => album.artists[0].name.toLowerCase())
					break
				case 'by_album':
					albums = _.orderBy(albums, album => album.name.toLowerCase())
					break
				case 'by_release_date':
					albums = _.orderBy(albums, album => moment(album.release_date).unix(), ['desc'])
					break
				default:
					albums = _.orderBy(albums, album => moment(album.release_date).unix(), ['desc'])
			}

			return albums
		},
	},

	methods: {
		async getNewReleases() {
			const albums = await spotify.getNewReleases({offset: this.albums.length})

			if (albums.length) {
				this.albums = this.albums.concat(albums)
				this.getNewReleases()
			}
		},
		handleChangeViewType(e) {
			this.viewType = e.currentTarget.dataset.value
		},
		async handleMouseOver(album) {
			this.audio = new Audio(album.track.preview_url)
			this.audio.volume = 0.5
			this.audio.play().catch(() => {})

			this.selectedAlbum = album
		},
		handleMouseOut() {
			this.audio.pause()
			this.audio = null

			this.selectedAlbum = null
		},
	},

	mounted() {
		this.getNewReleases()
	},
}
</script>

<style lang="scss" scoped>
@import '@/assets/variables.scss';

.new-releases {
	display: flex;
	align-items: flex-start;

	.new-releases-list {
		width: $list-width;
		margin-right: 40px;

		.header {
			margin-bottom: 10px;
			padding: 0;
		}

		.sorting {
			margin-bottom: 10px;
		}

		.albums {
			display: flex;
			flex-wrap: wrap;

			.album {
				width: calc(#{$list-width} / 10);
				height: calc(#{$list-width} / 10);
				background-repeat: no-repeat;
				background-size: cover;
			}
		}
	}
}
</style>
