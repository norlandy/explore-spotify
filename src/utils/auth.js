import axios from 'axios'

export const LOGIN_URL = `https://accounts.spotify.com/authorize
													?client_id=${process.env.VUE_APP_CLIENT_ID}
													&response_type=code
													&redirect_uri=${process.env.VUE_APP_REDIRECT_URI}
													&scope=playlist-read-private%20playlist-read-collaborative%20playlist-modify-public%20user-read-recently-played%20playlist-modify-private%20ugc-image-upload%20user-follow-modify%20user-follow-read%20user-library-read%20user-library-modify%20user-read-private%20user-read-email%20user-top-read%20user-read-playback-state`

export const LOGOUT_URL = 'https://www.spotify.com/logout'

export const getCodeFromURL = () => {
	const data = window.location.search
		.substring(1)
		.split('&')
		.reduce((initial, item) => {
			var parts = item.split('=')
			initial[parts[0]] = decodeURIComponent(parts[1])

			return initial
		}, {})

	return data.code
}

export const getAccessToken = async code => {
	const params = new URLSearchParams()
	params.append('code', code)
	params.append('grant_type', 'authorization_code')
	params.append('redirect_uri', process.env.VUE_APP_REDIRECT_URI)
	params.append('client_id', process.env.VUE_APP_CLIENT_ID)
	params.append('client_secret', process.env.VUE_APP_CLIENT_SECRET)

	const {data} = await axios.post('https://accounts.spotify.com/api/token', params)

	localStorage.setItem('token', data.access_token)
	localStorage.setItem('refresh_token', data.refresh_token)

	return data.access_token
}

export const getNewAccessToken = async () => {
	const params = new URLSearchParams()
	params.append('grant_type', 'refresh_token')
	params.append('refresh_token', localStorage.getItem('refresh_token'))
	params.append('client_id', process.env.VUE_APP_CLIENT_ID)
	params.append('client_secret', process.env.VUE_APP_CLIENT_SECRET)

	const {data} = await axios.post('https://accounts.spotify.com/api/token', params)

	localStorage.setItem('token', data.access_token)

	return data.access_token
}
