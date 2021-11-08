
const applicationVersion = '1.0.0';
const applicationContent = [
    'css/bootstrap.min.css',
    'js/bootstrap.bundle.min.js',
    'script.js',
    'contact.html',
    'index.html'
]


self.addEventListener('install', (event) => {
    console.log('[Service Worker] Installing Service Worker ...', event);

    event.waitUntil(
        caches.open(applicationVersion)
            .then((cache) => cache.addAll(applicationContent))
            .then(() => self.skipWaiting())
    );
});

self.addEventListener('activate', (event) => {
    console.log('[Service Worker] Activating Service Worker ....', event);

    event.waitUntil(
        caches.keys()
            .then((keyList) => {
                return Promise.all(keyList.map((key) => {
                    if (key !== applicationVersion) {
                        return caches.delete(key);
                    }
                }));
            })
    );
})


self.addEventListener('fetch', (event) => {
    console.log('[Service Worker] Fetching Service Worker ....', event);

    event.respondWith(
        caches.match(event.request)
            .then((response) => {
                if (response) {
                    return response;
                } else {
                    return fetch(event.request)
                        .then((res) => {
                            return caches.open(applicationVersion)
                                .then((cache) => {
                                    cache.put(event.request.url, res.clone());
                                    return res;
                                })
                        })
                        .catch(() => {
                            return caches.match('contact.html');
                        });
                }
            })
    );
});