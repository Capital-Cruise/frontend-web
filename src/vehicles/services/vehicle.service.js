import { http } from '../../shared/services/http.instance.js'
import { Vehicle } from '../models/vehicle.entity.js'

class VehicleService {
    async getVehiclesPage({ page = 0, size = 12, search = '', brand = '' } = {}) {
        const params = new URLSearchParams({
            page: String(page),
            size: String(size),
            sort: 'createdAt,desc'
        })

        if (search) params.set('search', search)
        if (brand) params.set('brand', brand)

        const data = await http.get(`/api/v1/vehicles?${params.toString()}`)
        const content = this.unwrapPage(data)

        return {
            vehicles: content.map((item) => new Vehicle(item)),
            page: data?.page ?? page,
            size: data?.size ?? size,
            totalElements: data?.totalElements ?? content.length,
            totalPages: data?.totalPages ?? 1
        }
    }

    async getVehicles(page = 0, size = 100) {
        const result = await this.getVehiclesPage({ page, size })
        return result.vehicles
    }

    async getVehicleSummary() {
        return await http.get('/api/v1/vehicles/summary')
    }

    async getVehicleById(vehicleId) {
        const data = await http.get(`/api/v1/vehicles/${vehicleId}`)
        return new Vehicle(data)
    }

    async createVehicle(vehicleData) {
        const data = await http.post('/api/v1/vehicles', this.normalizePayload(vehicleData))
        return new Vehicle(data)
    }

    async updateVehicle(vehicleId, vehicleData) {
        const data = await http.put(`/api/v1/vehicles/${vehicleId}`, this.normalizePayload(vehicleData))
        return new Vehicle(data)
    }

    normalizePayload(vehicleData) {
        return {
            ...vehicleData,
            commercialPrice: vehicleData.commercialPrice ?? 0
        }
    }

    unwrapPage(data) {
        if (Array.isArray(data)) return data
        if (Array.isArray(data?.content)) return data.content
        if (Array.isArray(data?.data)) return data.data
        if (Array.isArray(data?.items)) return data.items
        return []
    }
}

export const vehicleService = new VehicleService()
export default vehicleService
