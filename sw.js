'use strict';
const SCOPE=new URL(self.registration.scope);
const PREFIX='lollo-ricettario:'+SCOPE.href+':';
const CACHE=PREFIX+'v2.2.0';
const FILES=['./index.html','./turni.html','./data-guard.js','./unified.js','./app.js','./appearance.js','./shopping.js','./community-shopping.js','./menu-calendar.js','./exports.js','./style.css','./features.css','./data.js','./recipes.json','./manifest.webmanifest','./icon.svg','./icon-192.png','./icon-512.png'];
const ASSETS=new Set(FILES.map(p=>new URL(p,SCOPE).href));
self.addEventListener('install',event=>event.waitUntil(caches.open(CACHE).then(cache=>cache.addAll(FILES))));
self.addEventListener('activate',event=>event.waitUntil(caches.keys().then(keys=>Promise.all(keys.filter(key=>key.startsWith(PREFIX)&&key!==CACHE).map(key=>caches.delete(key)))).then(()=>self.clients.claim())));
self.addEventListener('fetch',event=>{
 const url=new URL(event.request.url);
 if(event.request.method!=='GET'||url.origin!==SCOPE.origin||!url.pathname.startsWith(SCOPE.pathname))return;
 const asset=new URL(url.pathname,url.origin).href;
 const target=url.pathname===SCOPE.pathname?new URL('index.html',SCOPE).href:asset;
 if(!ASSETS.has(target))return;
 // Keep HTML and scripts from the same installed version, including offline.
 event.respondWith(caches.open(CACHE).then(async cache=>(await cache.match(target))||fetch(event.request)));
});
