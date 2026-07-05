function firstArray(...candidates) {
  for (const candidate of candidates) {
    if (Array.isArray(candidate) && candidate.length > 0) {
      return candidate
    }
  }
  for (const candidate of candidates) {
    if (Array.isArray(candidate)) {
      return candidate
    }
  }
  return []
}

function normalizeInitialCharge(charge = {}) {
  return {
    ...charge,
    code: charge.code || charge.chargeCode || charge.initialChargeCode || '',
    label: charge.label || charge.name || '',
    amount: charge.amount ?? charge.value ?? null,
    currency: charge.currency ?? charge.operationCurrency ?? null,
    financingMode: charge.financingMode || charge.mode || 'FINANCED',
    taxable: charge.taxable ?? charge.affectTax ?? false
  }
}

function normalizePeriodicCharge(charge = {}) {
  return {
    ...charge,
    code: charge.code || charge.chargeCode || charge.periodicChargeCode || '',
    label: charge.label || charge.name || '',
    chargeType: charge.chargeType || charge.type || 'FIXED_AMOUNT',
    amount: charge.amount ?? charge.value ?? null,
    currency: charge.currency ?? charge.operationCurrency ?? null,
    originalAmount: charge.originalAmount ?? null,
    originalCurrency: charge.originalCurrency ?? null,
    ratePercent: charge.ratePercent ?? charge.percent ?? null,
    rateBase: charge.rateBase ?? charge.base ?? null,
    frequency: charge.frequency || charge.periodicity || 'MONTHLY',
    appliesDuringGrace: charge.appliesDuringGrace ?? charge.appliesInGrace ?? false,
    fromInstallment: charge.fromInstallment ?? charge.startMonth ?? null,
    toInstallment: charge.toInstallment ?? charge.endMonth ?? null
  }
}

export function normalizeOperationDetail(detail = {}) {
  const initialCharges = firstArray(
    detail.initialCharges,
    detail.initialCargos,
    detail.operationInitialCharges,
    detail.additionalCharges?.initialCharges,
    detail.calculation?.initialCharges
  ).map(normalizeInitialCharge)

  const periodicCharges = firstArray(
    detail.periodicCharges,
    detail.periodicCargos,
    detail.operationPeriodicCharges,
    detail.additionalCharges?.periodicCharges,
    detail.calculation?.periodicCharges
  ).map(normalizePeriodicCharge)

  const schedule = firstArray(
    detail.schedule,
    detail.operationSchedule,
    detail.calculation?.schedule
  )

  return {
    ...detail,
    normalizedInitialCharges: initialCharges,
    normalizedPeriodicCharges: periodicCharges,
    normalizedSchedule: schedule
  }
}
