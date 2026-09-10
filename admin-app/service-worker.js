const CACHE_NAME =
    "bhrighu-admin-v1";

const APP_FILES = [
    "./",
    "./index.html",
    "./css/app.css",
    "./js/app.js",
    "./manifest.json"
];


/* INSTALL */

self.addEventListener(
    "install",
    function(event) {

        event.waitUntil(
            caches
                .open(CACHE_NAME)
                .then(
                    function(cache) {
                        return cache.addAll(
                            APP_FILES
                        );
                    }
                )
        );

        self.skipWaiting();
    }
);


/* ACTIVATE */

self.addEventListener(
    "activate",
    function(event) {

        event.waitUntil(
            caches
                .keys()
                .then(
                    function(names) {

                        return Promise.all(
                            names
                                .filter(
                                    function(name) {
                                        return (
                                            name !==
                                            CACHE_NAME
                                        );
                                    }
                                )
                                .map(
                                    function(name) {
                                        return caches.delete(
                                            name
                                        );
                                    }
                                )
                        );

                    }
                )
        );

        self.clients.claim();
    }
);


/* FETCH */

self.addEventListener(
    "fetch",
    function(event) {

        if (
            event.request.method !==
            "GET"
        ) {
            return;
        }

        event.respondWith(
            fetch(event.request)
                .catch(
                    function() {
                        return caches.match(
                            event.request
                        );
                    }
                )
        );

    }
);