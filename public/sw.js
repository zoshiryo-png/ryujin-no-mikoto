// 龍神の命 - 最小限のService Worker
// 静的アセットを軽くキャッシュして、オフラインでも一度開いたページは見れる状態にする

const CACHE_NAME = 'ryujin-mikoto-v1'

self.addEventListener('install', (event) => {
  // 新しいSWを即座に有効化
  self.skipWaiting()
})

self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((keys) =>
      Promise.all(
        keys
          .filter((k) => k !== CACHE_NAME)
          .map((k) => caches.delete(k))
      )
    )
  )
  self.clients.claim()
})

self.addEventListener('fetch', (event) => {
  // GET以外はスルー
  if (event.request.method !== 'GET') return

  // ナビゲーション（HTMLリクエスト）はネットワーク優先＋オフライン時はキャッシュ
  if (event.request.mode === 'navigate') {
    event.respondWith(
      fetch(event.request)
        .then((res) => {
          const copy = res.clone()
          caches.open(CACHE_NAME).then((cache) => cache.put('/', copy))
          return res
        })
        .catch(() => caches.match('/'))
    )
    return
  }

  // 静的アセットはキャッシュ優先
  event.respondWith(
    caches.match(event.request).then((cached) => {
      return (
        cached ||
        fetch(event.request).then((res) => {
          if (res.ok && (event.request.url.includes('/dragons/') || event.request.url.includes('/icons/'))) {
            const copy = res.clone()
            caches.open(CACHE_NAME).then((cache) => cache.put(event.request, copy))
          }
          return res
        })
      )
    })
  )
})
