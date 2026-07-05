<template>
  <section class="detail-page">
    <div v-if="loading" class="state-panel">Cargando detalle de operación...</div>

    <div v-else-if="!detail" class="state-panel">
      <strong>No se encontró la operación.</strong>
      <button class="action-btn secondary" type="button" @click="goBack">Volver a operaciones guardadas</button>
    </div>

    <div v-else id="operationReport" class="report-shell">
      <header class="report-header">
        <div>
          <nav class="breadcrumb" aria-label="Breadcrumb">
            <span>Portal</span>
            <span>Detalle de operación</span>
          </nav>
          <h1>Simulación {{ clientName }} - {{ formattedCreatedAt }}</h1>
          <div class="identity-grid">
            <div>
              <span>Cliente principal</span>
              <strong>{{ clientName }}</strong>
            </div>
            <div>
              <span>Perfil del vehículo</span>
              <strong>{{ vehicleLabel }}</strong>
            </div>
            <div>
              <span>Estado</span>
              <strong class="status-text" :class="statusClass">{{ statusLabel }}</strong>
            </div>
          </div>
        </div>

        <div class="header-actions no-print">
          <button class="action-btn secondary" type="button" @click="goBack">
            <svg viewBox="0 0 24 24" aria-hidden="true"><path d="M20 11H7.83l5.59-5.59L12 4l-8 8 8 8 1.42-1.41L7.83 13H20v-2z" fill="currentColor"/></svg>
            Volver
          </button>
          <button class="action-btn secondary" type="button" @click="recalculate">
            <svg viewBox="0 0 24 24" aria-hidden="true"><path d="M17.65 6.35A7.95 7.95 0 0012 4V1L7 6l5 5V6a6 6 0 11-5.65 4H4.26A8 8 0 1017.65 6.35z" fill="currentColor"/></svg>
            Recalcular
          </button>
          <button class="action-btn secondary" type="button" @click="exportPdf">
            <svg viewBox="0 0 24 24" aria-hidden="true"><path d="M5 20h14v-2H5v2zM19 9h-4V3H9v6H5l7 7 7-7z" fill="currentColor"/></svg>
            Exportar PDF
          </button>
          <button v-if="statusValue === 'SAVED'" class="action-btn primary" type="button" @click="openShare">
            <svg viewBox="0 0 24 24" aria-hidden="true"><path d="M18 16a3.99 3.99 0 00-2.86 1.21L8.91 13.5a4.1 4.1 0 000-3l6.23-3.71A4 4 0 1014 4a3.99 3.99 0 00.14 1.06L7.91 8.77a4 4 0 100 6.46l6.23 3.71A4 4 0 1018 16z" fill="currentColor"/></svg>
            Compartir
          </button>
        </div>
      </header>

      <section class="metric-grid top-metrics">
        <article v-for="metric in topMetrics" :key="metric.label" class="metric-card accent">
          <span>{{ metric.label }}</span>
          <strong>{{ metric.value }}</strong>
          <small v-if="metric.note">{{ metric.note }}</small>
        </article>
      </section>

      <section class="metric-grid indicator-metrics">
        <article v-for="metric in indicatorMetrics" :key="metric.label" class="metric-card">
          <span>{{ metric.label }}</span>
          <strong>{{ metric.value }}</strong>
          <small v-if="metric.note">{{ metric.note }}</small>
        </article>
      </section>

      <div class="content-grid">
        <section class="table-card">
          <h2>Cargos iniciales</h2>
          <div class="table-wrap">
            <table>
              <thead>
                <tr>
                  <th>Código</th>
                  <th>Nombre</th>
                  <th>Monto</th>
                  <th>Modo</th>
                  <th>Efecto</th>
                </tr>
              </thead>
              <tbody>
                <tr v-if="initialChargeRows.length === 0">
                  <td colspan="5">No hay cargos iniciales.</td>
                </tr>
                <tr v-for="charge in initialChargeRows" :key="charge.code || charge.label">
                  <td>{{ formatChargeCodeLabel(charge.code) }}</td>
                  <td>{{ charge.label }}</td>
                  <td>
                    <div class="money-stack">
                      <strong>{{ formatMoney(charge.amount, charge.currency || currency) }}</strong>
                      <small v-if="originalAmountLabel(charge)">Original: {{ originalAmountLabel(charge) }}</small>
                    </div>
                  </td>
                  <td>{{ formatFinancingModeLabel(charge.financingMode) }}</td>
                  <td>{{ formatChargeEffectLabel(charge.financingMode) }}</td>
                </tr>
              </tbody>
            </table>
          </div>
        </section>

        <aside class="summary-card">
          <h2>Totales financieros</h2>
          <div v-for="item in payoffSummary" :key="item.label" class="summary-row" :class="{ total: item.total }">
            <span>{{ item.label }}</span>
            <strong>{{ item.value }}</strong>
          </div>
        </aside>
      </div>

      <section class="table-card">
        <h2>Detalle de cargos periódicos</h2>
        <div class="table-wrap">
          <table>
            <thead>
              <tr>
                <th>Código</th>
                <th>Nombre</th>
                <th>Tipo</th>
                <th>Valor</th>
                <th>Base</th>
                <th>Frecuencia</th>
                <th>Rango</th>
              </tr>
            </thead>
            <tbody>
              <tr v-if="periodicChargeRows.length === 0">
                <td colspan="7">No hay cargos periódicos.</td>
              </tr>
              <tr v-for="charge in periodicChargeRows" :key="charge.code || charge.label">
                <td>{{ formatChargeCodeLabel(charge.code) }}</td>
                <td>{{ charge.label }}</td>
                <td>{{ formatChargeTypeLabel(charge.chargeType) }}</td>
                <td>
                  <div class="money-stack">
                    <strong>{{ chargeValue(charge) }}</strong>
                    <small v-if="originalAmountLabel(charge)">Original: {{ originalAmountLabel(charge) }}</small>
                  </div>
                </td>
                <td>{{ formatChargeBaseLabel(charge.rateBase) }}</td>
                <td>{{ formatFrequencyLabel(charge.frequency) }}</td>
                <td>{{ formatInstallmentRangeLabel(charge.fromInstallment, charge.toInstallment) }}</td>
              </tr>
            </tbody>
          </table>
        </div>
      </section>

      <section class="table-card">
        <div class="section-title-row">
          <h2>Cronograma de pagos</h2>
          <span>{{ schedule.length }} cuotas</span>
        </div>
        <div class="table-wrap schedule-wrap">
          <table>
            <thead>
              <tr>
                <th>N.º cuota</th>
                <th>Fecha</th>
                <th>Gracia</th>
                <th>Saldo inicial</th>
                <th>Interés</th>
                <th>Cuota financiera</th>
                <th>Seguros</th>
                <th>Cargos</th>
                <th>Total</th>
                <th>Saldo final</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="row in schedule" :key="row.installmentNumber">
                <td>{{ padInstallment(row.installmentNumber) }}</td>
                <td>{{ formatDate(row.dueDate) }}</td>
                <td>{{ formatGraceTypeLabel(row.graceTypeApplied) }}</td>
                <td>{{ formatMoney(row.openingBalance) }}</td>
                <td>{{ formatMoney(row.interest) }}</td>
                <td>{{ formatMoney(row.baseInstallment) }}</td>
                <td>{{ formatMoney(row.insuranceAmount) }}</td>
                <td>{{ formatMoney(row.periodicChargesAmount ?? row.chargeAmount ?? row.additionalChargeAmount) }}</td>
                <td>{{ formatMoney(row.totalInstallment) }}</td>
                <td>{{ formatMoney(row.closingBalance) }}</td>
              </tr>
            </tbody>
          </table>
        </div>
      </section>
    </div>
  </section>
</template>

<script setup>
import { computed, onMounted, ref, watch } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { loanService } from '../services/loan.service.js'
import { toastService } from '../../shared/services/toast.service.js'
import { normalizeOperationDetail } from '../utils/operation-detail.util.js'
import {
  formatBooleanLabel,
  formatChargeBaseLabel,
  formatChargeCodeLabel,
  formatChargeEffectLabel,
  formatChargeTypeLabel,
  formatCurrencyLabel,
  formatFinancingModeLabel,
  formatFrequencyLabel,
  formatGraceTypeLabel,
  formatInstallmentRangeLabel,
  formatOperationStatusLabel
} from '../../shared/utils/loan-labels.js'

const route = useRoute()
const router = useRouter()

const detail = ref(null)
const schedule = ref([])
const loading = ref(false)

const operationId = computed(() => route.params.id)

const normalizedDetail = computed(() => normalizeOperationDetail(detail.value || {}))

const currency = computed(() =>
  detail.value?.operationCurrency ||
  detail.value?.currency ||
  detail.value?.vehicleSnapshotCurrency ||
  'USD'
)

const indicator = computed(() => detail.value?.indicator || {})
const statusValue = computed(() => detail.value?.status || 'SAVED')

const clientName = computed(() => detail.value?.clientSnapshotName || 'Cliente sin nombre')
const vehicleLabel = computed(() => detail.value?.vehicleSnapshotLabel || 'Vehículo sin nombre')
const statusLabel = computed(() => formatOperationStatusLabel(statusValue.value))
const statusClass = computed(() => statusValue.value.toLowerCase())

const formattedCreatedAt = computed(() => {
  const value = detail.value?.createdAt || detail.value?.calculatedAt
  if (!value) return 'Sin fecha'

  const date = new Date(value)
  if (Number.isNaN(date.getTime())) return 'Sin fecha'

  return new Intl.DateTimeFormat('es-PE', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  }).format(date)
})

const initialChargeRows = computed(() => normalizedDetail.value.normalizedInitialCharges || [])
const periodicChargeRows = computed(() => normalizedDetail.value.normalizedPeriodicCharges || [])

const topMetrics = computed(() => [
  {
    label: 'Precio del vehículo',
    value: formatMoney(detail.value?.vehiclePrice ?? detail.value?.vehicleSnapshotPrice)
  },
  {
    label: 'Cuota inicial',
    value: formatMoney(detail.value?.downPaymentAmount),
    note: detail.value?.downPaymentPercent != null ? `${formatPercent(detail.value.downPaymentPercent)} del precio del vehículo` : ''
  },
  {
    label: 'Cargos iniciales financiados',
    value: formatMoney(detail.value?.initialChargesFinanced ?? indicator.value.initialChargesFinanced)
  },
  {
    label: 'Principal financiado',
    value: formatMoney(indicator.value.financedAmount)
  },
  {
    label: 'Cuota balloon',
    value: formatMoney(detail.value?.calculatedBalloonAmount ?? indicator.value.balloonAmount ?? detail.value?.balloonAmount),
    note: detail.value?.balloonPercent != null ? `${formatPercent(detail.value.balloonPercent)} del precio del vehículo` : ''
  },
  {
    label: 'Cuota financiera base',
    value: formatMoney(indicator.value.baseInstallment)
  },
  {
    label: 'Cuota mensual estimada',
    value: formatMoney(firstMonthlyPayment.value)
  },
  {
    label: 'Total a pagar',
    value: formatMoney(indicator.value.totalPayable),
    note: `Valor residual en el mes ${detail.value?.termMonths || schedule.value.length || '--'}`
  }
])

const indicatorMetrics = computed(() => [
  { label: 'VAN', value: formatMoney(indicator.value.npv) },
  { label: 'TIR mensual', value: formatPercent(indicator.value.irrMonthly) },
  { label: 'TIR anual', value: formatPercent(indicator.value.irrAnnual), note: 'Nominal' },
  { label: 'TCEA', value: formatPercent(indicator.value.effectiveAnnualCost) },
  { label: 'COK', value: formatPercent(detail.value?.discountRate) },
  { label: 'TIR calculada', value: formatBooleanLabel(indicator.value.irrConverged) }
])

const firstMonthlyPayment = computed(() => {
  const payableRow = schedule.value.find((row) => Number(row.totalInstallment || 0) > 0)
  return payableRow?.totalInstallment ?? null
})

const payoffSummary = computed(() => [
  { label: 'Principal', value: formatMoney(indicator.value.financedAmount) },
  { label: 'Interés', value: formatMoney(indicator.value.totalInterest) },
  { label: 'Cargos periódicos', value: formatMoney(indicator.value.totalPeriodicCharges) },
  { label: 'Seguros', value: formatMoney(indicator.value.totalInsurance) },
  { label: 'Balloon', value: formatMoney(indicator.value.balloonAmount) },
  { label: 'Total a pagar', value: formatMoney(indicator.value.totalPayable), total: true }
])

async function loadDetail() {
  if (!operationId.value) {
    toastService.warning('El ID de la operación es obligatorio.')
    return
  }

  loading.value = true
  try {
    const detailData = await loanService.getOperationDetail(operationId.value)
    detail.value = detailData
    schedule.value = Array.isArray(detailData?.schedule) ? detailData.schedule : []

    if (schedule.value.length === 0) {
      const scheduleData = await loanService.getOperationSchedule(operationId.value)
      schedule.value = Array.isArray(scheduleData) ? scheduleData : loanService.unwrapPage(scheduleData)
    }
  } catch (err) {
    detail.value = null
    toastService.error(err.message)
  } finally {
    loading.value = false
  }
}

function goBack() {
  router.push('/operations')
}

function recalculate() {
  router.push('/simulation')
}

function openShare() {
  if (!operationId.value) return
  router.push({ name: 'operation-share', params: { id: operationId.value } })
}

function exportPdf() {
  document.title = `Capital Cruise Operación ${operationId.value}`
  window.print()
}

function formatMoney(value, displayCurrency = currency.value) {
  if (value === null || value === undefined || value === '') return `${formatDisplayCurrency(displayCurrency)} --`
  const n = Number(value)
  if (Number.isNaN(n)) return `${formatDisplayCurrency(displayCurrency)} --`

  return `${formatDisplayCurrency(displayCurrency)} ${n.toLocaleString('es-PE', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2
  })}`
}

function formatDisplayCurrency(value) {
  if (value === 'PEN') return 'S/'
  if (value === 'USD') return 'USD'
  return formatCurrencyLabel(value)
}

function formatPercent(value) {
  if (value === null || value === undefined || value === '') return '--'
  const n = Number(value)
  if (Number.isNaN(n)) return '--'
  const normalized = Math.abs(n) <= 1 ? n * 100 : n
  return `${normalized.toLocaleString('es-PE', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2
  })}%`
}

function formatDate(value) {
  if (!value) return '--'
  const date = new Date(value)
  if (Number.isNaN(date.getTime())) return String(value)

  return new Intl.DateTimeFormat('es-PE', {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit'
  }).format(date)
}

function padInstallment(value) {
  return String(value ?? '--').padStart(2, '0')
}

function chargeValue(charge) {
  if (charge.chargeType === 'FIXED_AMOUNT') {
    return formatMoney(charge.amount, charge.currency || currency.value)
  }

  return formatPercent(charge.ratePercent)
}

function originalAmountLabel(charge) {
  if (!charge || charge.originalAmount === null || charge.originalAmount === undefined || !charge.originalCurrency) {
    return ''
  }

  const displayCurrency = charge.currency || currency.value
  if (String(charge.originalCurrency) === String(displayCurrency)) {
    return ''
  }

  return formatMoney(charge.originalAmount, charge.originalCurrency)
}

watch(
  () => route.params.id,
  () => loadDetail()
)

onMounted(loadDetail)
</script>

<style scoped>
.detail-page {
  display: grid;
  gap: 24px;
}

.report-shell {
  display: grid;
  gap: 24px;
}

.report-header {
  display: flex;
  justify-content: space-between;
  gap: 24px;
  align-items: flex-start;
  padding: 24px;
  background: #ffffff;
  border: 1px solid #edf1f6;
  border-radius: 8px;
  box-shadow: 0 8px 22px rgba(8, 38, 74, 0.04);
}

.breadcrumb {
  display: flex;
  align-items: center;
  gap: 8px;
  color: #6f7d8f;
  font-size: 12px;
  font-weight: 800;
  margin-bottom: 8px;
}

.breadcrumb span + span {
  color: #08264a;
}

.breadcrumb span + span::before {
  content: "/";
  color: #a6b0be;
  margin-right: 8px;
}

.report-header h1 {
  margin: 0;
  color: #08264a;
  font-size: 24px;
  line-height: 1.25;
}

.identity-grid {
  display: grid;
  grid-template-columns: repeat(3, minmax(130px, 1fr));
  gap: 18px;
  margin-top: 18px;
  max-width: 720px;
}

.identity-grid div {
  display: grid;
  gap: 4px;
}

.identity-grid span,
.metric-card span,
.summary-row span {
  color: #526173;
  font-size: 11px;
  font-weight: 900;
  letter-spacing: 0.08em;
  text-transform: uppercase;
}

.identity-grid strong {
  color: #1d2632;
  font-size: 14px;
}

.status-text.saved {
  color: #166534;
}

.status-text.calculated,
.status-text.draft {
  color: #92400e;
}

.header-actions {
  display: flex;
  gap: 10px;
  flex-wrap: wrap;
  justify-content: flex-end;
}

.action-btn {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  min-height: 42px;
  border: 0;
  border-radius: 8px;
  padding: 0 16px;
  font: inherit;
  font-size: 13px;
  font-weight: 800;
  cursor: pointer;
}

.action-btn svg {
  width: 16px;
  height: 16px;
}

.action-btn.secondary {
  background: #e8ecf1;
  color: #26394e;
}

.action-btn.primary {
  background: #08264a;
  color: #ffffff;
}

.metric-grid {
  display: grid;
  gap: 16px;
}

.top-metrics {
  grid-template-columns: repeat(4, minmax(0, 1fr));
}

.indicator-metrics {
  grid-template-columns: repeat(3, minmax(0, 1fr));
}

.metric-card,
.table-card,
.summary-card,
.state-panel {
  background: #ffffff;
  border: 1px solid #edf1f6;
  border-radius: 8px;
  box-shadow: 0 8px 22px rgba(8, 38, 74, 0.04);
}

.metric-card {
  min-height: 86px;
  padding: 18px 20px;
}

.metric-card.accent {
  border-left: 3px solid #9bbcff;
}

.metric-card strong {
  display: block;
  margin-top: 8px;
  color: #0b1f3a;
  font-size: 24px;
  line-height: 1.05;
}

.metric-card small {
  display: block;
  margin-top: 6px;
  color: #6f7d8f;
  font-size: 12px;
  font-weight: 700;
}

.content-grid {
  display: grid;
  grid-template-columns: 1.4fr 0.6fr;
  gap: 24px;
  align-items: start;
}

.table-card {
  padding: 22px;
}

.table-card h2,
.section-title-row h2 {
  margin: 0 0 18px;
  color: #1d2632;
  font-size: 17px;
}

.section-title-row {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 16px;
}

.section-title-row span {
  color: #6f7d8f;
  font-size: 12px;
  font-weight: 800;
}

.table-wrap {
  overflow-x: auto;
}

table {
  width: 100%;
  border-collapse: collapse;
  min-width: 720px;
}

th {
  background: #e6eaef;
  color: #526173;
  font-size: 10px;
  font-weight: 900;
  letter-spacing: 0.08em;
  text-transform: uppercase;
}

th,
td {
  padding: 14px 16px;
  text-align: left;
  border-bottom: 1px solid #edf1f6;
  vertical-align: top;
}

td {
  color: #1d2632;
  font-size: 13px;
  font-weight: 600;
}

.money-stack {
  display: grid;
  gap: 4px;
}

.money-stack strong {
  color: #0b1f3a;
  font-size: 13px;
  font-weight: 800;
}

.money-stack small {
  color: #6f7d8f;
  font-size: 11px;
  font-weight: 700;
  line-height: 1.3;
}

.schedule-wrap {
  max-height: 540px;
  overflow: auto;
}

.schedule-wrap thead {
  position: sticky;
  top: 0;
  z-index: 1;
}

.summary-card {
  display: grid;
  gap: 0;
  padding: 22px;
}

.summary-card h2 {
  margin: 0 0 18px;
  color: #1d2632;
  font-size: 20px;
}

.summary-row {
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 18px;
  border-bottom: 1px solid #e3e8ef;
  padding: 12px 0;
}

.summary-row:first-of-type {
  padding-top: 0;
}

.summary-row strong {
  color: #0b1f3a;
  font-size: 18px;
  white-space: nowrap;
}

.summary-row span {
  color: #6f7d8f;
  font-size: 13px;
  font-weight: 500;
  letter-spacing: 0;
  text-transform: none;
}

.summary-row.total strong {
  color: #8f1521;
}

.state-panel {
  display: grid;
  place-items: center;
  gap: 12px;
  min-height: 260px;
  color: #6f7d8f;
  text-align: center;
  padding: 32px;
}

.state-panel strong {
  color: #0b1f3a;
}

@media (max-width: 1180px) {
  .report-header,
  .content-grid {
    grid-template-columns: 1fr;
  }

  .report-header {
    flex-direction: column;
  }

  .header-actions {
    justify-content: flex-start;
  }

  .top-metrics,
  .indicator-metrics {
    grid-template-columns: repeat(2, minmax(0, 1fr));
  }

  .content-grid {
    display: grid;
  }
}

@media (max-width: 760px) {
  .report-header {
    padding: 18px;
  }

  .report-header h1 {
    font-size: 21px;
  }

  .identity-grid,
  .top-metrics,
  .indicator-metrics {
    grid-template-columns: 1fr;
  }

  .header-actions {
    display: grid;
    width: 100%;
  }

  .action-btn {
    width: 100%;
  }

  .table-card {
    padding: 16px;
  }
}

@media print {
  :global(body) {
    background: #ffffff !important;
  }

  :global(.sidebar),
  :global(.topbar),
  .no-print {
    display: none !important;
  }

  :global(.app) {
    display: block !important;
  }

  :global(.main) {
    padding: 0 !important;
    overflow: visible !important;
  }

  .detail-page,
  .report-shell {
    display: block;
  }

  .report-header,
  .metric-card,
  .table-card,
  .summary-card {
    box-shadow: none;
    break-inside: avoid;
  }

  .report-header {
    margin-bottom: 16px;
  }

  .metric-grid,
  .content-grid {
    margin-bottom: 16px;
  }

  .top-metrics {
    grid-template-columns: repeat(4, 1fr);
  }

  .indicator-metrics {
    grid-template-columns: repeat(3, 1fr);
  }

  .content-grid {
    grid-template-columns: 1fr 170px;
  }

  .schedule-wrap {
    max-height: none;
    overflow: visible;
  }

  table {
    min-width: 0;
    page-break-inside: auto;
  }

  tr {
    break-inside: avoid;
  }
}
</style>
