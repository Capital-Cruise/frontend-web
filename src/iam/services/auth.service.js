import { http } from '../../shared/services/http.instance.js'
import { User } from '../models/user.entity.js'

const REFRESH_TOKEN_KEY = 'cc_refresh_token'
const USER_KEY = 'cc_user'
const REMEMBER_EMAIL_KEY = 'cc_remember_email'
const REMEMBER_DEVICE_KEY = 'cc_remember_device'

class AuthService {
    #refreshPromise = null
    #currentUser = null

    async login(usernameOrEmail, password, rememberDevice = false) {
        const session = await http.post(
            '/api/v1/auth/login',
            { usernameOrEmail: usernameOrEmail.trim(), password },
            { noAuth: true }
        )

        const user = User.fromSession(session)
        this.#persistSession(user, rememberDevice, usernameOrEmail.trim())
        return user
    }

    async logout() {
        const refreshToken = localStorage.getItem(REFRESH_TOKEN_KEY)

        try {
            if (refreshToken) {
                await http.post('/api/v1/auth/logout', { refreshToken }, { noAuth: true })
            }
        } catch {
            // Clear local session even if backend logout fails.
        } finally {
            this.#clearSession()
        }
    }

    async restoreSession() {
        const token = http.getAccessToken()
        if (!token) {
            this.#clearSession()
            return null
        }

        try {
            const profile = await http.get('/api/v1/auth/me')
            let stored = null
            const raw = localStorage.getItem(USER_KEY)
            if (raw) {
                try {
                    stored = JSON.parse(raw)
                } catch {
                    stored = null
                }
            }

            const user = User.fromSession({
                ...(stored || {}),
                accessToken: token,
                refreshToken: localStorage.getItem(REFRESH_TOKEN_KEY) || stored?.refreshToken || '',
                user: profile
            })
            this.#currentUser = user
            localStorage.setItem(USER_KEY, JSON.stringify(user.toStorage()))
            return user
        } catch {
            const refreshed = await this.tryRefreshToken()
            if (refreshed) {
                return this.restoreSession()
            }

            this.#clearSession()
            return null
        }
    }

    async tryRefreshToken() {
        const refreshToken = localStorage.getItem(REFRESH_TOKEN_KEY)
        if (!refreshToken) {
            return false
        }

        if (!this.#refreshPromise) {
            this.#refreshPromise = this.#refreshSession(refreshToken)
                .then((user) => !!user)
                .catch(() => false)
                .finally(() => {
                    this.#refreshPromise = null
                })
        }

        return this.#refreshPromise
    }

    async #refreshSession(refreshToken) {
        const session = await http.post(
            '/api/v1/auth/refresh',
            { refreshToken },
            { noAuth: true }
        )

        const user = User.fromSession(session)
        const rememberDevice = localStorage.getItem(REMEMBER_DEVICE_KEY) === 'true'
        this.#persistSession(user, rememberDevice, user.email || user.username)
        return user
    }

    #persistSession(user, rememberDevice, email) {
        http.setAccessToken(user.accessToken)
        localStorage.setItem(REFRESH_TOKEN_KEY, user.refreshToken)
        localStorage.setItem(USER_KEY, JSON.stringify(user.toStorage()))
        localStorage.setItem(REMEMBER_DEVICE_KEY, rememberDevice ? 'true' : 'false')

        if (rememberDevice && email) {
            localStorage.setItem(REMEMBER_EMAIL_KEY, email)
        } else {
            localStorage.removeItem(REMEMBER_EMAIL_KEY)
        }

        this.#currentUser = user
    }

    #clearSession() {
        http.setAccessToken('')
        localStorage.removeItem(REFRESH_TOKEN_KEY)
        localStorage.removeItem(USER_KEY)
        localStorage.removeItem(REMEMBER_DEVICE_KEY)
        this.#currentUser = null
    }

    getStoredUser() {
        if (this.#currentUser) {
            return this.#currentUser
        }

        const data = localStorage.getItem(USER_KEY)
        if (!data) {
            return null
        }

        try {
            this.#currentUser = User.fromSession(JSON.parse(data))
            return this.#currentUser
        } catch {
            return null
        }
    }

    getRememberedEmail() {
        return localStorage.getItem(REMEMBER_EMAIL_KEY) || ''
    }

    getStoredToken() {
        return http.getAccessToken()
    }

    isAuthenticated() {
        return !!this.getStoredToken()
    }
}

export const authService = new AuthService()
export default authService
