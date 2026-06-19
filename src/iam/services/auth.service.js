import { http } from '../../shared/services/http.instance.js'
import { User } from '../models/user.entity.js'

class AuthService {
    async login(usernameOrEmail, password) {
        const data = await http.post('/api/v1/auth/login', { usernameOrEmail, password }, { noAuth: true })
        const user = new User(data)
        http.setAccessToken(user.accessToken)
        localStorage.setItem('cc_refresh_token', user.refreshToken)
        localStorage.setItem('cc_user', JSON.stringify(data))
        return user
    }

    logout() {
        http.setAccessToken('')
        localStorage.removeItem('cc_refresh_token')
        localStorage.removeItem('cc_user')
    }

    getStoredUser() {
        const data = localStorage.getItem('cc_user')
        if (data) {
            try {
                return new User(JSON.parse(data))
            } catch {
                return null
            }
        }
        return null
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