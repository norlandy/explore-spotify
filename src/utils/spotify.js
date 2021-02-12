import callApi from './callApi'

export const LOGIN_URL = `https://accounts.spotify.com/authorize
												?client_id=${process.env.VUE_APP_SPOTIFY_CLIENT_ID}
												&scope=playlist-read-private%20playlist-read-collaborative%20playlist-modify-public%20user-read-recently-played%20playlist-modify-private%20ugc-image-upload%20user-follow-modify%20user-follow-read%20user-library-read%20user-library-modify%20user-read-private%20user-read-email%20user-top-read%20user-read-playback-state
												&response_type=token
												&redirect_uri=${process.env.VUE_APP_SPOTIFY_REDIRECT_URI}`

export const getTokenFromResponse = () => {
	const hash = window.location.hash
		.substring(1)
		.split('&')
		.reduce((initial, item) => {
			var parts = item.split('=')
			initial[parts[0]] = decodeURIComponent(parts[1])

			return initial
		}, {})

	return hash.access_token
}

export const getMe = async () => {
	return callApi.get('/me')
}

export const getSavedTracks = async ({offset = 0, limit = 50}) => {
	const data = await callApi.get(`/me/tracks?offset=${offset}&limit=${limit}&market=US`)

	const tracks = data.items.map(item => ({
		added_at: item.added_at,
		...item.track,
		uid: item.added_at + item.track.id,
	}))

	return tracks
}

export const getUsersTop = async ({type = 'tracks', offset = 0, timeRange = 'short_term'}) => {
	const data = await callApi.get(
		`https://api.spotify.com/v1/me/top/${type}?offset=${offset}&limit=50&time_range=${timeRange}`,
	)

	return data.items
}

export const getFollowedArtists = async ({after}) => {
	let data

	if (after) {
		data = await callApi.get(`/me/following?type=artist&after=${after}&limit=50`)
	} else {
		data = await callApi.get(`/me/following?type=artist&limit=50`)
	}

	return data.artists.items
}
