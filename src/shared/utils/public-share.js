const DEFAULT_PUBLIC_FRONTEND_URL = 'https://frontend-web-delta-rose.vercel.app'

function normalizeBaseUrl(value) {
  if (!value) return DEFAULT_PUBLIC_FRONTEND_URL
  return String(value).replace(/\/+$/, '')
}

export function getPublicFrontendBaseUrl() {
  return normalizeBaseUrl(import.meta.env.VITE_PUBLIC_FRONTEND_URL || DEFAULT_PUBLIC_FRONTEND_URL)
}

export function buildPublicQuoteUrl(share) {
  const token = share?.shareToken || share?.token
  if (!token) return ''
  return `${getPublicFrontendBaseUrl()}/quote/${encodeURIComponent(token)}`
}
