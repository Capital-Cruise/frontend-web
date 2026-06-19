export class LoanQuoteRequest {
    constructor(data = {}) {
        this.client = data.client || null
        this.vehicle = data.vehicle || null
        this.loan = data.loan || {}
        this.rate = data.rate || {}
        this.grace = data.grace || { graceType: 'NONE', gracePeriods: 0 }
        this.balloon = data.balloon || { enabled: false }
        this.additionalCharges = data.additionalCharges || { initialCharges: [], periodicCharges: [] }
        this.financialEvaluation = data.financialEvaluation || {}
        this.exchangeRate = data.exchangeRate || { mode: 'MANUAL', value: 0 }
    }

    toJSON() {
        return {
            client: this.client,
            vehicle: this.vehicle,
            loan: this.loan,
            rate: this.rate,
            grace: this.grace,
            balloon: this.balloon,
            additionalCharges: this.additionalCharges,
            financialEvaluation: this.financialEvaluation,
            exchangeRate: this.exchangeRate
        }
    }
}