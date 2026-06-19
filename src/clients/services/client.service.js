import { http } from '../../shared/services/http.instance.js'
import { Client } from '../models/client.entity.js'

class ClientService {
    async getClientsPage(page = 0, size = 5) {
        const data = await http.get(`/api/v1/clients?page=${page}&size=${size}&sort=createdAt,desc`)
        const content = this.unwrapPage(data)
        return {
            clients: content.map((item) => new Client(item)),
            page: data?.page ?? page,
            size: data?.size ?? size,
            totalElements: data?.totalElements ?? content.length,
            totalPages: data?.totalPages ?? 1
        }
    }

    async getClients(page = 0, size = 100) {
        const result = await this.getClientsPage(page, size)
        return result.clients
    }

    async getClientSummary() {
        return await http.get('/api/v1/clients/summary')
    }

    async createClient(clientData) {
        const data = await http.post('/api/v1/clients', this.normalizePayload(clientData))
        return new Client(data)
    }

    async getClientById(clientId) {
        const data = await http.get(`/api/v1/clients/${clientId}`)
        return new Client(data)
    }

    async updateClient(clientId, clientData) {
        const data = await http.put(`/api/v1/clients/${clientId}`, this.normalizePayload(clientData))
        return new Client(data)
    }

    normalizePayload(clientData) {
        return {
            ...clientData,
            monthlyIncome: clientData.monthlyIncome ?? 0
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

export const clientService = new ClientService()
export default clientService
