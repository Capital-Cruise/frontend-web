const DEFAULT_API_BASE = import.meta.env.VITE_API_BASE || 'https://backend-capital-cruise-deploy-482841496133.southamerica-west1.run.app'

class HttpInstance {
    constructor() {
        this.apiBase = DEFAULT_API_BASE
        this.accessToken = localStorage.getItem('cc_access_token') || ''
    }

    setApiBase(baseUrl) {
        this.apiBase = baseUrl.replace(/\/$/, '')
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

        const response = await fetch(`${this.apiBase}${path}`, {
            ...options,
            headers
        })

        const contentType = response.headers.get('content-type') || ''
        let body = null

        if (response.status !== 204) {
            body = contentType.includes('application/json')
                ? await response.json().catch(() => null)
                : await response.text().catch(() => null)
        }

        if (!response.ok) {
            const detail = typeof body === 'string' ? body : JSON.stringify(body, null, 2)
            throw new Error(`${response.status} ${response.statusText}\n${detail || ''}`)
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