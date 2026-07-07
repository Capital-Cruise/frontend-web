<template>
  <div>
    <div class="card result-header">
      <div>
        <h2 id="resultTitle">Simulación</h2>
        <p id="resultSubtitle">{{ subtitle }}</p>
      </div>
      <div class="button-row">
        <button class="secondary" type="button" @click="$emit('back')">Volver al formulario</button>
        <button class="primary" type="button" :disabled="saving" @click="$emit('save')">
          {{ saving ? 'Guardando...' : 'Guardar operación' }}
        </button>
      </div>
    </div>

    <div id="resultCards" class="grid cards-4">
      <article v-for="(item, idx) in summaryCards" :key="idx" class="card metric">
        <span>{{ item.label }}</span>
        <strong>{{ item.value }}</strong>
        <small v-if="item.note">{{ item.note }}</small>
      </article>
    </div>

    <div v-if="indicatorCards.length" id="indicatorCards" class="grid cards-4 indicator-grid">
      <article v-for="(item, idx) in indicatorCards" :key="idx" class="card metric">
        <span>{{ item.label }}</span>
        <strong>{{ item.value }}</strong>
      </article>
    </div>

    <div class="split result-split">
      <section class="card">
        <h2>Cargos iniciales</h2>
        <div v-if="initialCharges.length === 0">No hay cargos iniciales.</div>
        <div class="mini-table" v-else>
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
              <tr v-for="(charge, i) in initialCharges" :key="i">
                <td>{{ formatChargeCodeLabel(charge.code) }}</td>
                <td>{{ charge.label }}</td>
                <td>{{ formatAmountValue(charge.amount, charge.currency || currency) }}</td>
                <td>{{ formatFinancingModeLabel(charge.financingMode) }}</td>
                <td>{{ effectOfFinancing(charge.financingMode) }}</td>
              </tr>
            </tbody>
          </table>
        </div>
      </section>

      <section class="card">
        <h2>Totales financieros</h2>
        <div class="list">
          <div v-for="(item, idx) in totals" :key="idx" class="list-item">
            <span class="meta">{{ item.label }}</span>
            <strong :class="{ 'danger-text': item.danger }">{{ item.value }}</strong>
          </div>
        </div>
      </section>
    </div>

    <section class="card">
      <h2>Detalle de cargos periódicos</h2>
      <div v-if="periodicCharges.length === 0">No hay cargos periódicos.</div>
      <div class="mini-table" v-else>
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
            <tr v-for="(charge, i) in periodicCharges" :key="i">
              <td>{{ formatChargeCodeLabel(charge.code) }}</td>
              <td>{{ charge.label }}</td>
              <td>{{ formatChargeTypeLabel(charge.chargeType) }}</td>
              <td>{{ charge.chargeType === 'FIXED_AMOUNT' ? formatAmountValue(charge.amount, charge.currency || currency) : formatPercentValue(charge.ratePercent) }}</td>
              <td>{{ formatChargeBaseLabel(charge.rateBase) }}</td>
              <td>{{ formatFrequencyLabel(charge.frequency) }}</td>
              <td>{{ formatInstallmentRangeLabel(charge.fromInstallment, charge.toInstallment) }}</td>
            </tr>
          </tbody>
        </table>
      </div>
    </section>

    <section class="card">
      <h2>Cronograma de pagos</h2>
      <div v-if="schedule.length === 0">No hay datos de cronograma.</div>
      <div class="mini-table" v-else>
        <table>
          <thead>
            <tr>
              <th>N.º</th>
              <th>Fecha</th>
              <th>Gracia</th>
              <th>Saldo inicial</th>
              <th>Interés</th>
              <th>Cuota financiera</th>
              <th>Seguros</th>
              <th>Cargos</th>
              <th>Balloon</th>
              <th>Total</th>
              <th>Saldo final</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="(row, idx) in schedule.slice(0, 60)" :key="idx">
              <td>{{ row.installmentNumber }}</td>
              <td>{{ row.dueDate }}</td>
              <td>{{ formatGraceTypeLabel(row.graceTypeApplied) }}</td>
              <td>{{ formatAmountValue(row.openingBalance, currency) }}</td>
              <td>{{ formatAmountValue(row.interest, currency) }}</td>
              <td>{{ formatAmountValue(row.baseInstallment, currency) }}</td>
              <td>{{ formatAmountValue(row.insuranceAmount, currency) }}</td>
              <td>{{ formatAmountValue(row.additionalChargeAmount, currency) }}</td>
              <td>{{ formatAmountValue(row.balloonPortion, currency) }}</td>
              <td>{{ formatAmountValue(row.totalInstallment, currency) }}</td>
              <td>{{ formatAmountValue(row.closingBalance, currency) }}</td>
            </tr>
          </tbody>
        </table>
        <p v-if="schedule.length > 60" class="hint">Mostrando los primeros 60 de {{ schedule.length }} periodos.</p>
      </div>
    </section>
  </div>
</template>

<script setup>
import { computed } from 'vue'
import {
  formatAmountValue,
  formatBooleanValue,
  formatPercentValue
} from '../../shared/utils/financial-format.js'
import {
  formatChargeBaseLabel,
  formatChargeCodeLabel,
  formatChargeTypeLabel,
  formatFinancingModeLabel,
  formatFrequencyLabel,
  formatGraceTypeLabel,
  formatInstallmentRangeLabel
} from '../../shared/utils/loan-labels.js'

defineEmits(['back', 'save'])

const props = defineProps({
  calculation: { type: Object, default: null },
  request: { type: Object, default: null },
  saving: { type: Boolean, default: false }
})

const calc = computed(() => props.calculation?.calculation || props.calculation || {})
const summary = computed(() => calc.value?.summary || props.calculation?.summary || {})
const indicators = computed(() => calc.value?.indicators || props.calculation?.indicators || {})
const schedule = computed(() => calc.value?.schedule || props.calculation?.schedule || [])

const currency = computed(() =>
  props.request?.loan?.operationCurrency ||
  summary.value.currency ||
  summary.value.operationCurrency ||
  'USD'
)

const subtitle = computed(() => {
  const req = props.request
  if (req) {
    return `${req.client?.displayName || 'Cliente'} · ${req.vehicle?.brand || ''} ${req.vehicle?.model || ''}`.trim()
  }
  return 'No hay una simulación cargada.'
})

const initialCharges = computed(() => props.request?.additionalCharges?.initialCharges || [])
const periodicCharges = computed(() => props.request?.additionalCharges?.periodicCharges || [])

const summaryCards = computed(() => [
  { label: 'Precio del vehículo', value: formatAmountValue(summary.value.vehiclePrice ?? props.request?.vehicle?.vehiclePrice, currency.value) },
  { label: 'Cuota inicial', value: formatAmountValue(summary.value.downPaymentAmount, currency.value) },
  { label: 'Cargos iniciales financiados', value: formatAmountValue(summary.value.initialChargesFinanced, currency.value) },
  { label: 'Principal financiado', value: formatAmountValue(summary.value.principalFinanced, currency.value) },
  { label: 'Cuota balloon', value: formatAmountValue(summary.value.balloonAmount, currency.value) },
  { label: 'Cuota base', value: formatAmountValue(summary.value.baseInstallment, currency.value) },
  { label: 'Total a pagar', value: formatAmountValue(summary.value.totalPayable, currency.value) },
  { label: 'TCEA', value: formatPercentValue(indicators.value.effectiveAnnualCost) }
])

const indicatorCards = computed(() => {
  const cards = [
    { label: 'VAN', value: formatAmountValue(indicators.value.npv, currency.value) },
    { label: 'TIR mensual', value: formatPercentValue(indicators.value.irrMonthly) },
    { label: 'TIR anual', value: formatPercentValue(indicators.value.irrAnnual) },
    { label: 'TIR calculada', value: formatBooleanValue(indicators.value.irrConverged) }
  ]

  const cokValue = indicators.value.cok ?? indicators.value.discountRate ?? indicators.value.costOfCapital
  if (cokValue !== null && cokValue !== undefined && cokValue !== '') {
    cards.splice(3, 0, { label: 'COK', value: formatPercentValue(cokValue) })
  }

  return cards
})

const totals = computed(() => {
  return [
    { label: 'Principal', value: formatAmountValue(summary.value.principalFinanced, currency.value) },
    { label: 'Interés', value: formatAmountValue(summary.value.totalInterest, currency.value) },
    { label: 'Cargos periódicos', value: formatAmountValue(summary.value.totalPeriodicCharges, currency.value) },
    { label: 'Seguros', value: formatAmountValue(summary.value.totalInsurance, currency.value) },
    { label: 'Balloon', value: formatAmountValue(summary.value.balloonAmount, currency.value) },
    { label: 'Total a pagar', value: formatAmountValue(summary.value.totalPayable, currency.value), danger: true }
  ]
})

function effectOfFinancing(mode) {
  if (mode === 'FINANCED') return 'Se suma al principal'
  if (mode === 'PAID_UPFRONT') return 'Pagado al contado'
  if (mode === 'WITHHELD') return 'Retenido del desembolso'
  return 'Sin efecto financiero directo'
}
</script>

<style scoped>
.card {
  background: #ffffff;
  border-radius: 12px;
  padding: 24px;
  box-shadow: 0 12px 30px rgba(8, 38, 74, 0.08);
  border: 1px solid #edf1f6;
  margin-bottom: 22px;
}
.card h2 {
  font-size: 20px;
  margin-bottom: 18px;
}
.result-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 18px;
}
.result-header h2 {
  margin: 0;
}
.result-header p {
  margin: 4px 0 0;
  color: #4a5568;
}
.grid {
  display: grid;
  gap: 16px;
}
.cards-4 {
  grid-template-columns: repeat(4, minmax(0, 1fr));
}
.indicator-grid {
  margin-top: 16px;
}
.metric {
  border-left: 3px solid #a9c9ff;
}
.metric span {
  color: #6f7d8f;
  font-size: 12px;
  text-transform: uppercase;
  font-weight: 800;
  letter-spacing: 0.08em;
}
.metric strong {
  display: block;
  margin-top: 8px;
  font-size: 20px;
}
.metric small {
  display: block;
  margin-top: 4px;
  color: #6f7d8f;
}
.split {
  display: grid;
  gap: 24px;
  align-items: start;
}
.result-split {
  grid-template-columns: 1.4fr 0.6fr;
}
.button-row {
  display: flex;
  gap: 12px;
  flex-wrap: wrap;
  align-items: center;
}
.primary {
  background: #08264a;
  color: white;
  border: 0;
  border-radius: 8px;
  padding: 12px 18px;
  font-weight: 700;
  letter-spacing: 0.03em;
  cursor: pointer;
}
.primary:disabled {
  opacity: 0.6;
  cursor: not-allowed;
}
.secondary {
  background: #e2e7ed;
  color: #26394e;
  border: 0;
  border-radius: 8px;
  padding: 12px 18px;
  font-weight: 700;
  letter-spacing: 0.03em;
  cursor: pointer;
}
.mini-table table {
  width: 100%;
  border-collapse: collapse;
}
.mini-table th,
.mini-table td {
  padding: 12px 10px;
  border-bottom: 1px solid #e3e8ef;
  text-align: left;
  vertical-align: top;
  font-size: 13px;
}
.mini-table th {
  background: #e7ebf0;
  color: #455466;
  font-size: 11px;
  text-transform: uppercase;
  letter-spacing: 0.08em;
}
.list {
  display: grid;
  gap: 10px;
}
.list-item {
  display: flex;
  justify-content: space-between;
  border-bottom: 1px solid #e3e8ef;
  padding: 8px 0;
  gap: 16px;
}
.meta {
  color: #6f7d8f;
  font-size: 13px;
}
.danger-text {
  color: #8f1521;
}
.hint {
  font-size: 13px;
  color: #6f7d8f;
  margin-top: 8px;
}
@media (max-width: 1180px) {
  .result-split {
    grid-template-columns: 1fr;
  }
}
@media (max-width: 760px) {
  .cards-4 {
    grid-template-columns: repeat(2, minmax(0, 1fr));
  }
  .result-header {
    flex-direction: column;
    align-items: stretch;
  }
}
</style>
