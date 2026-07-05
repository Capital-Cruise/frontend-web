import { normalizeOperationDetail } from './operation-detail.util.js'

export function mapOperationDetailToSimulationRequest(detail = {}) {
  const normalized = normalizeOperationDetail(detail)
  const operationCurrency = detail.operationCurrency || detail.currency || 'USD'
  const balloonAmount = detail.calculatedBalloonAmount ?? detail.balloonAmount ?? null
  const balloonPercent = detail.balloonPercent ?? null
  const balloonEnabled = Number(balloonAmount || 0) > 0 || Number(balloonPercent || 0) > 0

  return {
    client: {
      clientId: detail.clientId,
      displayName: detail.clientSnapshotName
    },
    vehicle: {
      vehicleId: detail.vehicleId,
      vehiclePrice: Number(detail.vehiclePrice ?? detail.vehicleSnapshotPrice ?? 0),
      currency: operationCurrency
    },
    loan: {
      operationCurrency,
      downPaymentAmount: detail.downPaymentAmount ?? null,
      downPaymentPercent: detail.downPaymentPercent ?? null,
      termMonths: Number(detail.termMonths || 0),
      startDate: detail.startDate || null
    },
    rate: {
      rateType: detail.rateType || 'EFFECTIVE',
      ratePeriod: detail.ratePeriod || 'ANNUAL',
      rateValue: Number(detail.rateValue || 0),
      capitalizationFrequency: detail.capitalizationFrequency || null
    },
    grace: {
      graceType: detail.graceType || 'NONE',
      gracePeriods: Number(detail.gracePeriods || 0)
    },
    balloon: {
      enabled: balloonEnabled,
      balloonAmount: balloonAmount ?? null,
      balloonPercent: balloonPercent ?? null,
      balloonBase: 'VEHICLE_PRICE',
      dueInstallment: Number(detail.termMonths || 0)
    },
    additionalCharges: {
      initialCharges: normalized.normalizedInitialCharges.map((charge) => ({
        code: charge.code,
        label: charge.label,
        amount: Number(charge.originalAmount ?? charge.amount ?? 0),
        currency: charge.originalCurrency || charge.currency || operationCurrency,
        financingMode: charge.financingMode,
        taxable: Boolean(charge.taxable)
      })),
      periodicCharges: normalized.normalizedPeriodicCharges.map((charge) => ({
        code: charge.code,
        label: charge.label,
        chargeType: charge.chargeType,
        amount: charge.chargeType === 'FIXED_AMOUNT' ? Number(charge.originalAmount ?? charge.amount ?? 0) : null,
        currency: charge.chargeType === 'FIXED_AMOUNT' ? (charge.originalCurrency || charge.currency || operationCurrency) : null,
        ratePercent: charge.chargeType === 'FIXED_AMOUNT' ? null : Number(charge.ratePercent ?? 0),
        rateBase: charge.rateBase || null,
        frequency: charge.frequency || 'MONTHLY',
        appliesDuringGrace: Boolean(charge.appliesDuringGrace),
        fromInstallment: Number(charge.fromInstallment || 1),
        toInstallment: Number(charge.toInstallment || detail.termMonths || 1)
      }))
    },
    financialEvaluation: {
      discountRateType: detail.rateType || 'EFFECTIVE',
      discountRatePeriod: detail.ratePeriod || 'ANNUAL',
      discountRateValue: Number(detail.discountRate || 0)
    },
    exchangeRate: {
      mode: detail.exchangeRateMode || 'MANUAL',
      value: Number(detail.exchangeRateValue || 0)
    }
  }
}
