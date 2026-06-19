import { http } from '../../shared/services/http.instance.js'
import { Client } from '../models/client.entity.js'

class ClientService {
    async getClients(page = 0, size = 100) {
        const data = await http.get(`/api/v1/clients?page=${page}&size=${size}&sort=createdAt,desc`)
        const content = this.unwrapPage(data)
        return content.map(c => new Client(c))
    }

    async getClientSummary() {
        return await http.get('/api/v1/clients/summary')
    }

    async createClient(clientData) {
        const data = await http.post('/api/v1/clients', clientData)
        return new Client(data)
    }

    unwrapPage(data) {
        if (Array.isArray(data)) return data
        if (Array.isArray(data?.content)) return data.content
        if (Array.isArray(data?.data)) return data.data
        if (Array.isArray(data?.items)) return data.items
        return []
    }
}

export const clientService = new ClientService()
export default clientService