const CURRENCY_LABELS = {
  PEN: 'Soles',
  USD: 'Dólares'
}

const OPERATION_STATUS_LABELS = {
  DRAFT: 'Borrador',
  CALCULATED: 'Calculada',
  SAVED: 'Guardada',
  CANCELLED: 'Cancelada'
}

const CHARGE_CODE_LABELS = {
  NOTARY_FEES: 'Gastos notariales',
  REGISTRATION_FEES: 'Gastos registrales',
  STUDY_COMMISSION: 'Comisión de estudio',
  APPRAISAL: 'Tasación',
  GPS: 'GPS',
  SOAT: 'SOAT',
  OTHER: 'Otro cargo inicial',
  POSTAGE: 'Porte',
  ADMIN_FEE: 'Gasto administrativo',
  LIFE_INSURANCE: 'Seguro de desgravamen',
  VEHICLE_INSURANCE: 'Seguro vehicular todo riesgo',
  PERIODIC_COMMISSION: 'Comisión periódica',
  GPS_MONTHLY: 'GPS mensual'
}

const FINANCING_MODE_LABELS = {
  FINANCED: 'Financiado',
  PAID_UPFRONT: 'Pagado al contado',
  WITHHELD: 'Retenido del desembolso'
}

const CHARGE_TYPE_LABELS = {
  FIXED_AMOUNT: 'Monto fijo',
  RATE: 'Tasa',
  PERCENTAGE: 'Porcentaje'
}

const CHARGE_BASE_LABELS = {
  OPENING_BALANCE: 'Saldo inicial',
  VEHICLE_PRICE: 'Precio del vehículo',
  PRINCIPAL: 'Principal financiado',
  PRINCIPAL_FINANCED: 'Principal financiado',
  FINANCED_AMOUNT: 'Monto financiado',
  TOTAL_INSTALLMENT: 'Cuota total',
  BALLOON: 'Balloon',
  NONE: 'No aplica'
}

const FREQUENCY_LABELS = {
  MONTHLY: 'Mensual',
  BIMONTHLY: 'Bimestral',
  QUARTERLY: 'Trimestral',
  SEMIANNUAL: 'Semestral',
  SEMI_ANNUAL: 'Semestral',
  ANNUAL: 'Anual',
  ONE_TIME: 'Una sola vez',
  ANNUAL_PRORATED_MONTHLY: 'Anual prorrateado mensualmente',
  DAILY: 'Diaria',
  Mensual: 'Mensual'
}

const GRACE_TYPE_LABELS = {
  NONE: 'Sin gracia',
  PARTIAL: 'Gracia parcial',
  TOTAL: 'Gracia total',
  S: 'Sin gracia',
  P: 'Gracia parcial',
  T: 'Gracia total'
}

const RATE_TYPE_LABELS = {
  EFFECTIVE: 'Efectiva',
  NOMINAL: 'Nominal'
}

const BOOLEAN_LABELS = {
  true: 'Sí',
  false: 'No'
}

export const INITIAL_CHARGE_CODES = ['NOTARY_FEES', 'REGISTRATION_FEES', 'STUDY_COMMISSION', 'APPRAISAL', 'GPS', 'SOAT', 'OTHER']
export const PERIODIC_CHARGE_CODES = ['POSTAGE', 'ADMIN_FEE', 'LIFE_INSURANCE', 'VEHICLE_INSURANCE', 'PERIODIC_COMMISSION', 'GPS_MONTHLY', 'OTHER']
export const FINANCING_MODES = ['FINANCED', 'PAID_UPFRONT', 'WITHHELD']
export const CHARGE_TYPES = ['FIXED_AMOUNT', 'RATE', 'PERCENTAGE']
export const CHARGE_BASES = ['OPENING_BALANCE', 'VEHICLE_PRICE', 'PRINCIPAL', 'FINANCED_AMOUNT', 'TOTAL_INSTALLMENT', 'BALLOON', 'NONE']
export const FREQUENCIES = ['MONTHLY', 'BIMONTHLY', 'QUARTERLY', 'SEMIANNUAL', 'ANNUAL', 'ONE_TIME', 'ANNUAL_PRORATED_MONTHLY']
export const OPERATION_STATUSES = ['DRAFT', 'CALCULATED', 'SAVED', 'CANCELLED']
export const RATE_TYPES = ['EFFECTIVE', 'NOMINAL']
export const GRACE_TYPES = ['NONE', 'PARTIAL', 'TOTAL']
export const CURRENCIES = ['PEN', 'USD']

export function formatChargeCodeLabel(value) {
  return CHARGE_CODE_LABELS[value] || value || '---'
}

export function formatFinancingModeLabel(value) {
  return FINANCING_MODE_LABELS[value] || value || '---'
}

export function formatChargeTypeLabel(value) {
  return CHARGE_TYPE_LABELS[value] || value || '---'
}

export function formatChargeBaseLabel(value) {
  return CHARGE_BASE_LABELS[value] || value || 'No aplica'
}

export function formatFrequencyLabel(value) {
  return FREQUENCY_LABELS[value] || value || '---'
}

export function formatOperationStatusLabel(value) {
  return OPERATION_STATUS_LABELS[value] || value || 'Pendiente'
}

export function formatCurrencyLabel(value) {
  return CURRENCY_LABELS[value] || value || '---'
}

export function formatBooleanLabel(value) {
  return BOOLEAN_LABELS[String(Boolean(value))] || 'No'
}

export function formatGraceTypeLabel(value) {
  return GRACE_TYPE_LABELS[value] || value || '---'
}

export function formatRateTypeLabel(value) {
  return RATE_TYPE_LABELS[value] || value || '---'
}

export function formatChargeEffectLabel(mode) {
  if (mode === 'FINANCED') return 'Se suma al principal'
  if (mode === 'PAID_UPFRONT') return 'Pagado al contado'
  if (mode === 'WITHHELD') return 'Retenido del desembolso'
  return 'Sin efecto financiero directo'
}

export function formatInstallmentRangeLabel(from, to) {
  if (from === null || from === undefined || to === null || to === undefined) return '---'
  return `Meses ${from}-${to}`
}
