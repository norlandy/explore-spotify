import axios from 'axios'

import {getNewAccessToken} from '../auth'

let accessToken = ''

const request = axios.create({
	baseURL: 'https://api.spotify.com/v1',
})

request.interceptors.request.use(
	config => {
		config.headers.Authorization = `Bearer ${accessToken}`

		return config
	},
	err => {
		Promise.reject(err)
	},
)
request.interceptors.response.use(
	response => {
		return response
	},
	async err => {
		const originalRequest = err.config

		if (err.response.status === 401 && !originalRequest._retry) {
			originalRequest._retry = true

			accessToken = await getNewAccessToken()

			axios.defaults.headers.common['Authorization'] = `Bearer ${accessToken}`

			return request(originalRequest)
		}

		return Promise.reject(err)
	},
)

const callApi = async (endpoint, options = {}) => {
	try {
		const {data} = await request(endpoint, options)

		return data
	} catch (err) {
		console.log(err)
	}
}

callApi.setAccessToken = token => {
	accessToken = token
}

callApi.get = async (endpoint, options = {}) => {
	try {
		const {data} = await request.get(endpoint, options)

		return data
	} catch (err) {
		console.log(err)
	}
}

callApi.post = async (endpoint, payload, options = {}) => {
	try {
		const {data} = await request.post(endpoint, payload, options)

		return data
	} catch (err) {
		console.log(err)
	}
}

callApi.put = async (endpoint, payload, options = {}) => {
	try {
		const {data} = await request.put(endpoint, payload, options)

		return data
	} catch (err) {
		console.log(err)
	}
}

callApi.delete = async (endpoint, options = {}) => {
	try {
		const {data} = await request.delete(endpoint, options)

		return data
	} catch (err) {
		console.log(err)
	}
}

export default callApi
