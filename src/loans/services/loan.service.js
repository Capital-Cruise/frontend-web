import { http } from '../../shared/services/http.instance.js'
import { Operation } from '../models/operation.entity.js'

class LoanService {
    async calculateQuote(request) {
        return await http.post('/api/v1/loan-quotes/calculate', request)
    }

    async saveOperation(request) {
        const data = await http.post('/api/v1/operations', request)
        return new Operation(data)
    }

    async getOperations(status = '', currency = '', page = 0, size = 100) {
        const params = new URLSearchParams({ page, size, sort: 'createdAt,desc' })
        if (status) params.set('status', status)
        if (currency) params.set('currency', currency)
        const data = await http.get(`/api/v1/operations?${params.toString()}`)
        const content = this.unwrapPage(data)
        return content.map(o => new Operation(o))
    }

    async getOperationDetail(operationId) {
        return await http.get(`/api/v1/operations/${operationId}`)
    }

    async getOperationSchedule(operationId) {
        return await http.get(`/api/v1/operations/${operationId}/schedule`)
    }

    async getOperationIndicators(operationId) {
        return await http.get(`/api/v1/operations/${operationId}/indicators`)
    }

    async createPublicShare(operationId) {
        return await http.post(`/api/v1/operations/${operationId}/public-share`, { expiresAt: null })
    }

    async getPublicQuote(token) {
        return await http.get(`/api/v1/public/quotes/${encodeURIComponent(token)}`, { noAuth: true })
    }

    async getSummary() {
        return await http.get('/api/v1/operations/summary')
    }

    async getCurrentExchangeRate(base = 'USD', quote = 'PEN') {
        const params = new URLSearchParams({ base, quote })
        return await http.get(`/api/v1/reference/exchange-rate/current?${params.toString()}`)
    }

    unwrapPage(data) {
        if (Array.isArray(data)) return data
        if (Array.isArray(data?.content)) return data.content
        if (Array.isArray(data?.data)) return data.data
        if (Array.isArray(data?.items)) return data.items
        return []
    }
}

export const loanService = new LoanService()
export default loanService
