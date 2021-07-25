const CACHE_ELEMENTS = [
    "./",
    "https://unpkg.com/react@17/umd/react.development.js",
    "https://unpkg.com/react-dom@17/umd/react-dom.development.js",
    "https://unpkg.com/@babel/standalone/babel.min.js",
    "./style.css",
    "./components/Contador.js"
];

const CACHE_NAME = "v3_cache_contador_react";

self.addEventListener("install", (e) => {
    e.waitUntil(
        //permite usar cache de dispositivos y poder pasar un nombre que sea, regresa una promesa
        caches.open(CACHE_NAME).then(cache => {
            cache.addAll(CACHE_ELEMENTS).then( () =>{// agrega las rutas que se requieran, regresa promesa
                self.skipWaiting()
            } ).catch(err => console.log(err))
        })
    )
} );


self.addEventListener("activate", (e) => {
    const cacheWhiteList = [CACHE_NAME];

    e.waitUntil(
        caches.keys().then(cachesNames => {
            return Promise.all(cachesNames.map(cacheName => {
                return cacheWhiteList.indexOf(cacheName) === -1  && caches.delete(cacheName)             //el cache no existe 
            }));
        }).then( () => self.clients.claim())
    )
} );

self.addEventListener("fetch", (e) => {   //se dispara cada que se abra el index retornando las respueats en chache, retornando nuevas versiones
    
    
    e.respondWith(
        caches.match(e.request).then(
            (res) => {
                if(res){
                    return res;
                }
                return fetch(e.request);
            }
        )
                    //then(res =>  res ? res : fetch( e.request  ) )  
    )


} )