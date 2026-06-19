export class Client {
    constructor(data = {}) {
        this.id = data.id || null
        this.clientId = data.clientId || data.id || null
        this.firstName = data.firstName || ''
        this.lastName = data.lastName || ''
        this.fullName = data.fullName || ''
        this.documentType = data.documentType || ''
        this.documentNumber = data.documentNumber || ''
        this.email = data.email || ''
        this.phone = data.phone || ''
        this.monthlyIncome = data.monthlyIncome || 0
        this.address = data.address || ''
        this.notes = data.notes || ''
        this.displayName = data.displayName || ''
    }

    get displayName() {
        return this.fullName ||
            [this.firstName, this.lastName].filter(Boolean).join(' ') ||
            this.email ||
            `Client ${this.id || this.clientId}`
    }

    get identifier() {
        return this.id || this.clientId
    }
}