import { http } from '../../shared/services/http.instance.js'
import { Vehicle } from '../models/vehicle.entity.js'

class VehicleService {
    async getVehicles(page = 0, size = 100) {
        const data = await http.get(`/api/v1/vehicles?page=${page}&size=${size}&sort=createdAt,desc`)
        const content = this.unwrapPage(data)
        return content.map(v => new Vehicle(v))
    }

    async getVehicleSummary() {
        return await http.get('/api/v1/vehicles/summary')
    }

    async createVehicle(vehicleData) {
        const data = await http.post('/api/v1/vehicles', vehicleData)
        return new Vehicle(data)
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