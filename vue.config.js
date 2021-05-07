module.exports = {
	transpileDependencies: ['vuetify'],

	pwa: {
		workboxOptions: {
			clientsClaim: true,
			runtimeCaching: [
				// static resources
				{
					handler: 'StaleWhileRevalidate',
					urlPattern: ({request}) =>
						request.destination === 'style' ||
						request.destination === 'script' ||
						request.destination === 'worker',
					options: {
						cacheName: 'static-resources',
						cacheableResponse: {
							statuses: [0, 200],
						},
					},
				},
				// google fonts
				{
					handler: 'StaleWhileRevalidate',
					urlPattern: ({url}) => url.origin === 'https://fonts.googleapis.com',
					options: {
						cacheName: 'google-fonts-stylesheets',
					},
				},
				{
					handler: 'CacheFirst',
					urlPattern: ({url}) => url.origin === 'https://fonts.gstatic.com',
					options: {
						cacheName: 'google-fonts-webfonts',
						cacheableResponse: {
							statuses: [0, 200],
						},
						expiration: {
							maxEntries: 30,
							maxAgeSeconds: 60 * 60 * 24 * 365, // 1 year
						},
					},
				},
			],
		},

		// to <head/> meta-tags
		name: 'Explore Spotify',
		appleMobileWebAppCapable: 'yes',
		themeColor: '#9C27B0',
		msTileColor: '#9C27B0',
		iconPaths: {
			favicon32: 'img/icons/favicon-32x32.png',
			favicon16: 'img/icons/favicon-16x16.png',
			appleTouchIcon: 'img/icons/apple-touch-icon.png',
			maskIcon: 'img/icons/safari-pinned-tab.svg',
			msTileImage: 'img/icons/mstile-150x150.png',
		},
	},
}
