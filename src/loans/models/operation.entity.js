export class Operation {
    constructor(data = {}) {
        this.id = data.id || null
        this.operationId = data.operationId || data.id || null
        this.status = data.status || ''
        this.currency = data.currency || data.operationCurrency || ''
        this.vehicleLabel = data.vehicleLabel || ''
        this.vehicleBrand = data.vehicleBrand || ''
        this.vehicleModel = data.vehicleModel || ''
        this.clientName = data.clientName || ''
        this.clientId = data.clientId || ''
        this.createdAt = data.createdAt || ''
        this.calculation = data.calculation || null
    }

    get identifier() {
        return this.id || this.operationId
    }

    get title() {
        return this.vehicleLabel ||
            [this.vehicleBrand, this.vehicleModel].filter(Boolean).join(' ') ||
            `Operation ${this.identifier}`
    }

    get displayClient() {
        return this.clientName || `Client ${this.clientId}`
    }
}