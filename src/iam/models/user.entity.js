export class User {
    constructor(data = {}) {
        const profile = data.user || data

        this.id = profile.id ?? data.id ?? null
        this.email = profile.email || data.email || ''
        this.username = profile.username || data.username || ''
        this.firstName = profile.firstName || data.firstName || ''
        this.lastName = profile.lastName || data.lastName || ''
        this.roles = profile.roles || data.roles || []
        this.accessToken = data.accessToken || data.token || data.access_token || ''
        this.refreshToken = data.refreshToken || data.refresh_token || ''
        this.expiresIn = data.expiresIn ?? data.expires_in ?? null
    }

    static fromSession(session) {
        return new User(session)
    }

    toStorage() {
        return {
            accessToken: this.accessToken,
            refreshToken: this.refreshToken,
            expiresIn: this.expiresIn,
            user: {
                id: this.id,
                username: this.username,
                email: this.email,
                roles: this.roles
            }
        }
    }

    get fullName() {
        return [this.firstName, this.lastName].filter(Boolean).join(' ') || this.username || this.email
    }

    isAuthenticated() {
        return !!this.accessToken
    }
}
