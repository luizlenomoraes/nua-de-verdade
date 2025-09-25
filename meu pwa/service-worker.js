// Define um nome e versão para o cache. Mude a versão para 'v2', 'v3', etc., quando atualizar os arquivos.
const CACHE_NAME = 'nua-e-de-verdade-v1';

// Lista de todos os arquivos essenciais para o funcionamento offline do aplicativo.
const urlsToCache = [
  '/',
  '/index.html',
  '/manifest.json',
  'https://cdn.tailwindcss.com',
  'https://fonts.googleapis.com/css2?family=Cormorant+Garamond:wght@400;600;700&family=Inter:wght@300;400;500&display=swap',
  'https://unpkg.com/lucide@latest',
  '/icons/icon-192x192.png',
  '/icons/icon-512x512.png'
  // Adicione aqui os caminhos para outros ícones ou imagens importantes que você queira que funcionem offline.
];

// Evento 'install': é acionado quando o service worker é registado pela primeira vez.
self.addEventListener('install', event => {
  // Espera até que o cache seja aberto e todos os arquivos listados sejam armazenados.
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then(cache => {
        console.log('Cache aberto');
        return cache.addAll(urlsToCache);
      })
  );
});

// Evento 'fetch': é acionado sempre que a página faz um pedido (ex: carregar uma imagem, um script).
self.addEventListener('fetch', event => {
  event.respondWith(
    // Procura por uma resposta correspondente no cache.
    caches.match(event.request)
      .then(response => {
        // Se encontrar uma resposta no cache, retorna-a.
        if (response) {
          return response;
        }
        // Se não encontrar, faz o pedido à rede.
        return fetch(event.request);
      }
    )
  );
});

// Evento 'activate': é acionado quando um novo service worker é ativado.
self.addEventListener('activate', event => {
  const cacheWhitelist = [CACHE_NAME];
  event.waitUntil(
    // Pega os nomes de todos os caches.
    caches.keys().then(cacheNames => {
      return Promise.all(
        cacheNames.map(cacheName => {
          // Se um cache existente não estiver na 'whitelist' (ou seja, é um cache antigo), ele é eliminado.
          if (cacheWhitelist.indexOf(cacheName) === -1) {
            return caches.delete(cacheName);
          }
        })
      );
    })
  );
});

