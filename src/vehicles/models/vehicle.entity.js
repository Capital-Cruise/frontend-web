export class Vehicle {
    constructor(data = {}) {
        this.id = data.id || null
        this.vehicleId = data.vehicleId || data.id || null
        this.brand = data.brand || ''
        this.model = data.model || ''
        this.year = data.year || null
        this.vehicleType = data.vehicleType || 'OTHER'
        this.commercialPrice = data.commercialPrice || data.vehiclePrice || data.price || 0
        this.currency = data.currency || 'USD'
        this.description = data.description || ''
        this.imageUrl = data.imageUrl || ''
        this.vehicleLabel = data.vehicleLabel || ''
        this.createdAt = data.createdAt || ''
        this.updatedAt = data.updatedAt || ''
    }

    get cardTitle() {
        return [this.brand, this.model].filter(Boolean).join(' - ') || this.vehicleLabel || `Vehicle ${this.identifier}`
    }

    get typeLabel() {
        const labels = {
            SEDAN: 'Sports Sedan',
            SUV: 'Off-Road SUV',
            PICKUP: 'Pickup Truck',
            HATCHBACK: 'Hatchback',
            VAN: 'Van',
            OTHER: 'Other'
        }
        return labels[this.vehicleType] || this.vehicleType || 'Vehicle'
    }

    get subtitle() {
        return [this.year, this.typeLabel].filter(Boolean).join(' • ')
    }

    get displayName() {
        return [this.brand, this.model, this.year].filter(Boolean).join(' ') ||
            this.vehicleLabel ||
            `Vehicle ${this.id || this.vehicleId}`
    }

    get price() {
        return Number(this.commercialPrice || 0)
    }

    get identifier() {
        return this.id || this.vehicleId
    }
}