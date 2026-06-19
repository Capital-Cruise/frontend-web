import { ApiError, parseApiError } from '../utils/api-error.util.js'

const DEFAULT_API_BASE =
    import.meta.env.VITE_API_BASE ??
    (import.meta.env.DEV ? '' : 'https://backend-capital-cruise-deploy-482841496133.southamerica-west1.run.app')

class HttpInstance {
    constructor() {
        this.apiBase = DEFAULT_API_BASE.replace(/\/$/, '')
        this.accessToken = localStorage.getItem('cc_access_token') || ''
        this.onUnauthorized = null
    }

    setApiBase(baseUrl) {
        this.apiBase = (baseUrl || '').replace(/\/$/, '')
    }

    setAccessToken(token) {
        this.accessToken = token
        if (token) {
            localStorage.setItem('cc_access_token', token)
        } else {
            localStorage.removeItem('cc_access_token')
        }
    }

    getAccessToken() {
        return this.accessToken
    }

    async request(path, options = {}) {
        const headers = {
            'Content-Type': 'application/json',
            ...(options.headers || {})
        }

        if (this.accessToken && !options.noAuth) {
            headers.Authorization = `Bearer ${this.accessToken}`
        }

        let response

        try {
            response = await fetch(`${this.apiBase}${path}`, {
                ...options,
                headers
            })
        } catch {
            throw new ApiError('No se pudo conectar con el servidor. Verifique su conexión.', 0)
        }

        const contentType = response.headers.get('content-type') || ''
        let body = null

        if (response.status !== 204) {
            body = contentType.includes('application/json')
                ? await response.json().catch(() => null)
                : await response.text().catch(() => null)
        }

        if (response.status === 401 && !options.noAuth && !options._retry && this.onUnauthorized) {
            const recovered = await this.onUnauthorized()
            if (recovered) {
                return this.request(path, { ...options, _retry: true })
            }
        }

        if (!response.ok) {
            throw new ApiError(parseApiError(body, response.status), response.status, body)
        }

        return body
    }

    get(path, options = {}) {
        return this.request(path, { ...options, method: 'GET' })
    }

    post(path, data, options = {}) {
        return this.request(path, {
            ...options,
            method: 'POST',
            body: JSON.stringify(data)
        })
    }

    put(path, data, options = {}) {
        return this.request(path, {
            ...options,
            method: 'PUT',
            body: JSON.stringify(data)
        })
    }

    delete(path, options = {}) {
        return this.request(path, { ...options, method: 'DELETE' })
    }
}

export const http = new HttpInstance()
export default http
