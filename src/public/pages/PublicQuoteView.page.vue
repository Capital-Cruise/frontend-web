<template>
  <section class="public-quote">
    <header class="hero card">
      <div>
        <p class="eyebrow">Capital Cruise</p>
        <h1>Cotización de crédito vehicular</h1>
        <p class="subtitle">{{ quote.vehicleLabel || 'Vehículo no disponible' }}</p>
      </div>
      <div class="hero-meta">
        <span class="status-pill">{{ statusLabel }}</span>
        <button class="copy-btn" type="button" @click="copyLink">Copiar enlace</button>
      </div>
    </header>

    <div v-if="loading" class="card state-card">Cargando cotización pública...</div>
    <div v-else-if="error" class="card state-card error">{{ error }}</div>

    <div v-else class="content">
      <section class="card overview-card">
        <div class="overview-grid">
          <div class="info-block">
            <span>Cliente</span>
            <strong>{{ quote.clientName || 'Cliente no disponible' }}</strong>
          </div>
          <div class="info-block">
            <span>Vehículo</span>
            <strong>{{ quote.vehicleLabel }}</strong>
          </div>
          <div class="info-block">
            <span>Fecha</span>
            <strong>{{ formatDateTime(quote.quotedAt) }}</strong>
          </div>
          <div class="info-block">
            <span>Estado</span>
            <strong>{{ statusLabel }}</strong>
          </div>
          <div class="info-block">
            <span>Método</span>
            <strong>Francés vencido ordinario</strong>
          </div>
          <div class="info-block">
            <span>Base</span>
            <strong>Mes comercial 30/360</strong>
          </div>
        </div>
      </section>

      <section class="metrics-grid">
        <article v-for="item in headlineMetrics" :key="item.label" class="card metric-card">
          <span>{{ item.label }}</span>
          <strong>{{ item.value }}</strong>
          <small v-if="item.note">{{ item.note }}</small>
        </article>
      </section>

      <div class="split-grid">
        <section class="card details-card">
          <h2>Configuración financiera</h2>
          <div class="details-grid">
            <div class="detail-row"><span>Tipo de tasa</span><strong>{{ rateTypeLabel }}</strong></div>
            <div class="detail-row"><span>Valor de la tasa</span><strong>{{ formatPercent(quote.rateValue) }}</strong></div>
            <div class="detail-row"><span>Periodo de tasa</span><strong>{{ formatRatePeriodLabel(quote.ratePeriod) }}</strong></div>
            <div class="detail-row"><span>Frecuencia de capitalización</span><strong>{{ capitalizationLabel }}</strong></div>
            <div class="detail-row"><span>TEM</span><strong>{{ formatPercent(quote.monthlyEffectiveRate) }}</strong></div>
            <div class="detail-row"><span>TCEA</span><strong>{{ formatPercent(quote.tcea) }}</strong></div>
            <div class="detail-row"><span>Tipo de gracia</span><strong>{{ formatGraceTypeLabel(quote.graceType) }}</strong></div>
            <div class="detail-row"><span>Periodos de gracia</span><strong>{{ quote.gracePeriods ?? 0 }}</strong></div>
            <div class="detail-row"><span>Plazo</span><strong>{{ quote.termMonths }} meses</strong></div>
            <div class="detail-row"><span>Fecha de inicio</span><strong>{{ formatDate(quote.startDate) }}</strong></div>
          </div>
        </section>

        <aside class="card totals-card">
          <h2>Totales financieros</h2>
          <div v-for="item in totals" :key="item.label" class="total-row" :class="{ emphasis: item.emphasis }">
            <span>{{ item.label }}</span>
            <strong>{{ item.value }}</strong>
          </div>
        </aside>
      </div>

      <section v-if="initialCharges.length > 0" class="card">
        <h2>Cargos iniciales</h2>
        <div class="table-wrap">
          <table>
            <thead>
              <tr>
                <th>Código</th>
                <th>Nombre</th>
                <th>Monto</th>
                <th>Modo</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="charge in initialCharges" :key="`${charge.code}-${charge.label}`">
                <td>{{ formatChargeCodeLabel(charge.code) }}</td>
                <td>{{ charge.label }}</td>
                <td>{{ formatMoney(charge.amount, charge.currency || currency) }}</td>
                <td>{{ formatFinancingModeLabel(charge.financingMode) }}</td>
              </tr>
            </tbody>
          </table>
        </div>
      </section>

      <section v-if="periodicCharges.length > 0" class="card">
        <h2>Cargos periódicos</h2>
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
              <tr v-for="charge in periodicCharges" :key="`${charge.code}-${charge.label}`">
                <td>{{ formatChargeCodeLabel(charge.code) }}</td>
                <td>{{ charge.label }}</td>
                <td>{{ formatChargeTypeLabel(charge.chargeType) }}</td>
                <td>{{ chargeValue(charge) }}</td>
                <td>{{ formatChargeBaseLabel(charge.rateBase) }}</td>
                <td>{{ formatFrequencyLabel(charge.frequency) }}</td>
                <td>{{ formatInstallmentRangeLabel(charge.fromInstallment, charge.toInstallment) }}</td>
              </tr>
            </tbody>
          </table>
        </div>
      </section>

      <section class="card">
        <div class="section-head">
          <h2>Cronograma de pagos</h2>
          <button v-if="hasCollapsedSchedule" class="toggle-btn" type="button" @click="showFullSchedule = !showFullSchedule">
            {{ showFullSchedule ? 'Ver menos' : 'Ver cronograma completo' }}
          </button>
        </div>
        <div class="table-wrap">
          <table>
            <thead>
              <tr>
                <th>N.º cuota</th>
                <th>Fecha</th>
                <th>Saldo inicial</th>
                <th>Interés</th>
                <th>Amortización</th>
                <th>Cuota financiera</th>
                <th>Seguros</th>
                <th>Cargos</th>
                <th>Cuota total</th>
                <th>Saldo final</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="line in visibleSchedule" :key="line.installmentNumber">
                <td>{{ line.installmentNumber }}</td>
                <td>{{ formatDate(line.dueDate) }}</td>
                <td>{{ formatMoney(line.openingBalance) }}</td>
                <td>{{ formatMoney(line.interest) }}</td>
                <td>{{ formatMoney(line.amortization) }}</td>
                <td>{{ formatMoney(line.baseInstallment) }}</td>
                <td>{{ formatMoney(line.insuranceAmount) }}</td>
                <td>{{ formatMoney(line.periodicChargesAmount ?? line.additionalChargeAmount) }}</td>
                <td>{{ formatMoney(line.totalInstallment) }}</td>
                <td>{{ formatMoney(line.closingBalance) }}</td>
              </tr>
            </tbody>
          </table>
        </div>
      </section>

      <section class="card disclaimer-card">
        <p>Esta cotización es referencial y está sujeta a validación final por la entidad financiera.</p>
      </section>
    </div>
  </section>
</template>

<script setup>
import { computed, onMounted, ref } from 'vue'
import { loanService } from '../../loans/services/loan.service.js'
import {
  formatChargeBaseLabel,
  formatChargeCodeLabel,
  formatChargeTypeLabel,
  formatCurrencyLabel,
  formatFinancingModeLabel,
  formatFrequencyLabel,
  formatGraceTypeLabel,
  formatInstallmentRangeLabel,
  formatOperationStatusLabel,
  formatRateTypeLabel
} from '../../shared/utils/loan-labels.js'

const props = defineProps({
  shareToken: { type: String, required: true }
})

const loading = ref(true)
const error = ref('')
const quote = ref({})
const showFullSchedule = ref(false)

const statusLabel = computed(() => formatOperationStatusLabel(quote.value?.status || 'SAVED'))
const currency = computed(() => quote.value?.currency || 'USD')
const initialCharges = computed(() => quote.value?.initialCharges || [])
const periodicCharges = computed(() => quote.value?.periodicCharges || [])
const rateTypeLabel = computed(() => formatRateTypeLabel(quote.value?.rateType))
const capitalizationLabel = computed(() => {
  const value = quote.value?.capitalizationFrequency
  if (!value) return 'No aplica'
  if (value === 'SEMI_ANNUAL') return 'Semestral'
  if (value === 'ANNUAL') return 'Anual'
  if (value === 'QUARTERLY') return 'Trimestral'
  if (value === 'MONTHLY') return 'Mensual'
  if (value === 'DAILY') return 'Diaria'
  return value
})

const headlineMetrics = computed(() => [
  { label: 'Precio del vehículo', value: formatMoney(quote.value.vehiclePrice) },
  { label: 'Cuota inicial', value: formatMoney(quote.value.downPaymentAmount), note: percentNote(quote.value.downPaymentPercent) },
  { label: 'Monto financiado', value: formatMoney(quote.value.principalFinanced) },
  { label: 'Plazo', value: `${quote.value.termMonths ?? '--'} meses` },
  { label: 'Cuota mensual estimada', value: formatMoney(quote.value.estimatedMonthlyPayment) },
  { label: 'Cuota balloon', value: formatMoney(quote.value.balloonAmount), note: percentNote(quote.value.balloonPercent) },
  { label: 'Total a pagar', value: formatMoney(quote.value.totalPayable) },
  { label: 'TCEA', value: formatPercent(quote.value.tcea) }
])

const totals = computed(() => [
  { label: 'Total de intereses', value: formatMoney(quote.value.totalInterest) },
  { label: 'Seguros', value: formatMoney(quote.value.totalInsurance) },
  { label: 'Cargos periódicos', value: formatMoney(quote.value.totalPeriodicCharges) },
  { label: 'Cargos iniciales financiados', value: formatMoney(quote.value.initialChargesFinanced) },
  { label: 'Desembolso neto', value: formatMoney(quote.value.cashAtSigning) },
  { label: 'VAN', value: formatMoney(quote.value.npv) },
  { label: 'TIR mensual', value: formatPercent(quote.value.irrMonthly) },
  { label: 'TIR anual', value: formatPercent(quote.value.irrAnnual) },
  { label: 'Total a pagar', value: formatMoney(quote.value.totalPayable), emphasis: true }
])

const hasCollapsedSchedule = computed(() => Array.isArray(quote.value.schedule) && quote.value.schedule.length > 9)
const visibleSchedule = computed(() => {
  const schedule = Array.isArray(quote.value.schedule) ? quote.value.schedule : []
  if (showFullSchedule.value || schedule.length <= 9) return schedule
  return [...schedule.slice(0, 6), ...schedule.slice(-3)]
})

async function loadQuote() {
  loading.value = true
  error.value = ''

  try {
    quote.value = await loanService.getPublicQuote(props.shareToken)
  } catch (err) {
    error.value = err.message || 'No se pudo cargar la cotización compartida.'
  } finally {
    loading.value = false
  }
}

async function copyLink() {
  await navigator.clipboard.writeText(window.location.href)
}

function formatMoney(value, displayCurrency = currency.value) {
  if (value === null || value === undefined || value === '') return '--'
  const n = Number(value)
  if (Number.isNaN(n)) return '--'
  if (displayCurrency === 'PEN') {
    return `S/ ${n.toLocaleString('es-PE', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`
  }
  if (displayCurrency === 'USD') {
    return `USD ${n.toLocaleString('es-PE', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`
  }
  return `${formatCurrencyLabel(displayCurrency)} ${n.toLocaleString('es-PE', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`
}

function formatPercent(value) {
  if (value === null || value === undefined || value === '') return '--'
  const n = Number(value)
  if (Number.isNaN(n)) return '--'
  const normalized = Math.abs(n) <= 1 ? n * 100 : n
  return `${normalized.toLocaleString('es-PE', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}%`
}

function formatDate(value) {
  if (!value) return '--'
  const date = new Date(value)
  if (Number.isNaN(date.getTime())) return String(value)
  return new Intl.DateTimeFormat('es-PE', { day: '2-digit', month: '2-digit', year: 'numeric' }).format(date)
}

function formatDateTime(value) {
  if (!value) return '--'
  const date = new Date(value)
  if (Number.isNaN(date.getTime())) return String(value)
  return new Intl.DateTimeFormat('es-PE', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  }).format(date)
}

function formatRatePeriodLabel(value) {
  if (value === 'MONTHLY') return 'Mensual'
  if (value === 'ANNUAL') return 'Anual'
  return value || '--'
}

function percentNote(value) {
  if (value === null || value === undefined || value === '') return ''
  return `${formatPercent(value)} del precio del vehículo`
}

function chargeValue(charge) {
  if (charge.chargeType === 'FIXED_AMOUNT') {
    return formatMoney(charge.amount, charge.currency || currency.value)
  }
  return formatPercent(charge.ratePercent)
}

onMounted(loadQuote)
</script>

<style scoped>
.public-quote {
  display: grid;
  gap: 24px;
}

.card {
  background: #fff;
  border: 1px solid #edf1f6;
  border-radius: 16px;
  padding: 24px;
  box-shadow: 0 12px 30px rgba(8, 38, 74, 0.08);
}

.hero {
  display: flex;
  justify-content: space-between;
  gap: 24px;
  align-items: flex-start;
}

.eyebrow {
  margin: 0 0 8px;
  color: #6f7d8f;
  font-size: 12px;
  font-weight: 800;
  text-transform: uppercase;
  letter-spacing: 0.08em;
}

h1,
h2 {
  margin: 0;
  color: #08264a;
}

h1 {
  font-size: 34px;
}

.subtitle {
  margin: 8px 0 0;
  color: #4a5568;
  font-size: 17px;
}

.hero-meta {
  display: grid;
  gap: 12px;
  justify-items: end;
}

.status-pill {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  border-radius: 999px;
  background: #e7f8eb;
  color: #166534;
  padding: 8px 12px;
  font-weight: 800;
}

.copy-btn,
.toggle-btn {
  border: 0;
  border-radius: 10px;
  background: #08264a;
  color: #fff;
  padding: 12px 18px;
  font-weight: 700;
  cursor: pointer;
}

.content {
  display: grid;
  gap: 24px;
}

.overview-grid,
.details-grid,
.metrics-grid {
  display: grid;
  gap: 16px;
}

.overview-grid {
  grid-template-columns: repeat(3, minmax(0, 1fr));
}

.metrics-grid {
  grid-template-columns: repeat(4, minmax(0, 1fr));
}

.split-grid {
  display: grid;
  grid-template-columns: 1.2fr 0.8fr;
  gap: 24px;
}

.info-block,
.detail-row,
.total-row {
  display: flex;
  justify-content: space-between;
  gap: 16px;
}

.info-block,
.detail-row {
  flex-direction: column;
}

.info-block span,
.metric-card span,
.detail-row span,
.total-row span {
  color: #6f7d8f;
  font-size: 12px;
  font-weight: 800;
  text-transform: uppercase;
  letter-spacing: 0.08em;
}

.info-block strong,
.detail-row strong,
.total-row strong,
.metric-card strong {
  color: #0b1f3a;
}

.metric-card strong {
  display: block;
  margin-top: 8px;
  font-size: 28px;
}

.metric-card small {
  display: block;
  margin-top: 6px;
  color: #6f7d8f;
}

.details-grid {
  grid-template-columns: repeat(2, minmax(0, 1fr));
}

.totals-card {
  display: grid;
  gap: 14px;
}

.total-row {
  align-items: center;
  border-bottom: 1px solid #edf1f6;
  padding-bottom: 12px;
}

.total-row.emphasis strong {
  color: #8f1521;
}

.section-head {
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 16px;
  margin-bottom: 16px;
}

.table-wrap {
  overflow: auto;
}

table {
  width: 100%;
  min-width: 920px;
  border-collapse: collapse;
}

th,
td {
  padding: 12px 14px;
  border-bottom: 1px solid #edf1f6;
  text-align: left;
  vertical-align: top;
}

th {
  background: #eef3f8;
  color: #526173;
  font-size: 11px;
  text-transform: uppercase;
  letter-spacing: 0.08em;
}

.disclaimer-card p,
.state-card {
  margin: 0;
  color: #4a5568;
}

.state-card {
  text-align: center;
}

.state-card.error {
  color: #8f1521;
}

@media (max-width: 1120px) {
  .overview-grid,
  .metrics-grid,
  .split-grid,
  .details-grid {
    grid-template-columns: repeat(2, minmax(0, 1fr));
  }
}

@media (max-width: 760px) {
  .hero,
  .overview-grid,
  .metrics-grid,
  .split-grid,
  .details-grid {
    grid-template-columns: 1fr;
  }

  .hero {
    display: grid;
  }

  .hero-meta {
    justify-items: start;
  }
}
</style>
