const IMAGE_CACHE = 'kaiser-component-images-v1';
const CACHE_PREFIX = 'kaiser-component-';

self.addEventListener('install', (event) => {
	event.waitUntil(self.skipWaiting());
});

self.addEventListener('activate', (event) => {
	event.waitUntil(
		caches.keys().then((cacheNames) =>
			Promise.all(
				cacheNames
					.filter((cacheName) => cacheName.startsWith(CACHE_PREFIX) && cacheName !== IMAGE_CACHE)
					.map((cacheName) => caches.delete(cacheName)),
			),
		).then(() => self.clients.claim()),
	);
});

self.addEventListener('fetch', (event) => {
	const request = event.request;

	if (request.method !== 'GET' || request.destination !== 'image') {
		return;
	}

	event.respondWith(
		caches.match(request).then((cachedResponse) => {
			if (cachedResponse) {
				return cachedResponse;
			}

			return fetch(request).then((response) => {
				if (!response.ok && response.type !== 'opaque') {
					return response;
				}

				return caches.open(IMAGE_CACHE)
					.then((cache) => cache.put(request, response.clone()))
					.then(() => response, () => response);
			});
		}),
	);
});
