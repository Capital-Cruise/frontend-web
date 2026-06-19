export class User {
    constructor(data = {}) {
        this.id = data.id || null
        this.email = data.email || ''
        this.username = data.username || ''
        this.firstName = data.firstName || ''
        this.lastName = data.lastName || ''
        this.roles = data.roles || []
        this.accessToken = data.accessToken || data.token || data.access_token || ''
        this.refreshToken = data.refreshToken || data.refresh_token || ''
    }

    get fullName() {
        return [this.firstName, this.lastName].filter(Boolean).join(' ') || this.username || this.email
    }

    isAuthenticated() {
        return !!this.accessToken
    }
}