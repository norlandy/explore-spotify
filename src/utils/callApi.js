import axios from 'axios'

const request = axios.create({
	baseURL: 'https://api.spotify.com/v1',
	headers: {
		Authorization: `Bearer ${localStorage.getItem('token') || ''}`,
	},
})

request.interceptors.request.use(
	config => {
		config.headers.Authorization = `Bearer ${localStorage.getItem('token') || ''}`

		return config
	},
	error => console.log(error),
)

const callApi = async (endpoint, options = {}) => {
	try {
		const {data} = await request(endpoint, options)

		return data
	} catch (error) {
		console.log(error)
	}
}

callApi.get = async (endpoint, options = {}) => {
	try {
		const {data} = await request.get(endpoint, options)

		return data
	} catch (error) {
		console.log(error)
	}
}

callApi.post = async (endpoint, payload, options = {}) => {
	try {
		const {data} = await request.post(endpoint, payload, options)

		return data
	} catch (error) {
		console.log(error)
	}
}

callApi.put = async (endpoint, payload, options = {}) => {
	try {
		const {data} = await request.put(endpoint, payload, options)

		return data
	} catch (error) {
		console.log(error)
	}
}

callApi.delete = async (endpoint, options = {}) => {
	try {
		const {data} = await request.delete(endpoint, options)

		return data
	} catch (error) {
		console.log(error)
	}
}

export {request as axiosInstance}

export default callApi
