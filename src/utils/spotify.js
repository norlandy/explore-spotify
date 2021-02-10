import axios from 'axios'

export const LOGIN_URL = `https://accounts.spotify.com/authorize
												?client_id=${process.env.VUE_APP_SPOTIFY_CLIENT_ID}
												&scope=playlist-read-private%20playlist-read-collaborative%20playlist-modify-public%20user-read-recently-played%20playlist-modify-private%20ugc-image-upload%20user-follow-modify%20user-follow-read%20user-library-read%20user-library-modify%20user-read-private%20user-read-email%20user-top-read%20user-read-playback-state
												&response_type=token
												&redirect_uri=${process.env.VUE_APP_SPOTIFY_REDIRECT_URI}`

export const login = () => {
	window.location.href = LOGIN_URL
}

export const getTokenFromResponse = () => {
	return window.location.hash
		.substring(1)
		.split('&')
		.reduce((initial, item) => {
			var parts = item.split('=')
			initial[parts[0]] = decodeURIComponent(parts[1])

			return initial
		}, {}).access_token
}

export const getMe = async token => {
	const {data} = await axios.get('https://api.spotify.com/v1/me', {
		headers: {
			Authorization: `Bearer ${token}`,
		},
	})

	return data
}

export const getSavedTracks = async ({token, offset = 0, limit = 50}) => {
	const {data} = await axios.get(
		`https://api.spotify.com/v1/me/tracks?offset=${offset}&limit=${limit}&market=US`,
		{
			headers: {
				Authorization: `Bearer ${token}`,
			},
		},
	)

	const tracks = data.items.map(item => item.track)

	return tracks
}
