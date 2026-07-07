function formatCurrencyDisplay(currency) {
  if (currency === 'PEN') return 'S/'
  if (currency === 'USD') return 'USD'
  return currency || '--'
}

export function formatAmountValue(value, currency = 'USD') {
  if (value === null || value === undefined || value === '') return '--'

  const numeric = Number(value)
  if (Number.isNaN(numeric)) return '--'

  return `${formatCurrencyDisplay(currency)} ${numeric.toLocaleString('es-PE', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2
  })}`
}

export function formatPercentValue(value) {
  if (value === null || value === undefined || value === '') return '--'

  const numeric = Number(value)
  if (Number.isNaN(numeric)) return '--'

  const normalized = Math.abs(numeric) < 1 ? numeric * 100 : numeric
  return `${normalized.toLocaleString('es-PE', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2
  })}%`
}

export function formatBooleanValue(value) {
  if (value === null || value === undefined || value === '') return '--'
  return value ? 'Sí' : 'No'
}
