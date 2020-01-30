const cacheName         = 'baze-cache-v1';
let paths
let pageLocation        = location;
let origin              = pageLocation.origin;
let pathname            = pageLocation.pathname.split('/')[1];
let stagingFrontend     = 'https://frontend.suitdev.com';
let local               = 'localhost';
let frontendFolder      = '_frontend';
let locationHref        = pageLocation.href;

if(origin === stagingFrontend) {
    paths = origin + '/' + pathname
} else if (origin.includes(local)) {
    let localPath = locationHref.split(frontendFolder)[0] + frontendFolder
    paths = localPath
} else {
    paths = '.'
}

const offlinePageUrl    = `${paths}/offline.html`
const precacheResources = [
    offlinePageUrl,
    `${paths}/assets/css/offline.css`,
    `${paths}/assets/img/site-logo.png`
];

self.addEventListener('install', event => {
    console.log('Service worker install event!');
    event.waitUntil(
        caches.open(cacheName)
        .then(cache => {
            return cache.addAll(precacheResources);
        })
    );
});

self.addEventListener('activate', event => {
    console.log('Service worker activate event!');
});

self.addEventListener('fetch', event => {
    // console.log('Fetch intercepted for:', event.request.url);
    if (event.request.mode === 'navigate' || (event.request.method === 'GET' && event.request.headers.get('accept').includes('text/html'))) {
        event.respondWith (
            fetch(event.request.url).catch(error => {
                // Return the offline page
                return caches.match(offlinePageUrl);
            })
        );
    } else {
        // Respond with everything else if we can
        event.respondWith (
            caches.match(event.request)
            .then(cachedResponse => {
                if (cachedResponse) {
                    return cachedResponse;
                }
                return fetch(event.request);
            })
        );
    }
});


