const IMAGE_CACHE_NAME = 'capital-cruise-image-cache-v1'
const objectUrlBySource = new Map()

function supportsPersistentCache() {
  return typeof window !== 'undefined' && 'caches' in window
}

function revokePreviousObjectUrl(source) {
  const current = objectUrlBySource.get(source)
  if (!current) return

  URL.revokeObjectURL(current)
  objectUrlBySource.delete(source)
}

async function responseToObjectUrl(source, response) {
  const blob = await response.blob()
  revokePreviousObjectUrl(source)

  const objectUrl = URL.createObjectURL(blob)
  objectUrlBySource.set(source, objectUrl)
  return objectUrl
}

export async function resolveCachedImageUrl(source) {
  if (!source) return ''

  if (objectUrlBySource.has(source)) {
    return objectUrlBySource.get(source)
  }

  if (!supportsPersistentCache()) {
    return source
  }

  try {
    const cache = await caches.open(IMAGE_CACHE_NAME)
    const cached = await cache.match(source)
    if (cached) {
      return await responseToObjectUrl(source, cached)
    }

    const response = await fetch(source, {
      mode: 'cors',
      credentials: 'omit'
    })

    if (!response.ok) {
      return source
    }

    await cache.put(source, response.clone())
    return await responseToObjectUrl(source, response)
  } catch {
    return source
  }
}

export async function warmImageCache(sources = []) {
  const uniqueSources = [...new Set(sources.filter(Boolean))]
  await Promise.all(uniqueSources.map((source) => resolveCachedImageUrl(source)))
}

