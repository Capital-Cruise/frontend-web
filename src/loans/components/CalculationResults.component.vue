<template>
  <div>
    <div class="card result-header">
      <div>
        <h2 id="resultTitle">Simulation</h2>
        <p id="resultSubtitle">{{ subtitle }}</p>
      </div>
      <div class="button-row">
        <button class="secondary" @click="$emit('back')">Back to Form</button>
        <button class="primary" @click="$emit('save')">Save Operation</button>
        <button class="secondary" @click="$emit('share')">Share Saved Operation</button>
      </div>
    </div>

    <div id="resultCards" class="grid cards-4">
      <article v-for="(item, idx) in summaryCards" :key="idx" class="card metric">
        <span>{{ item.label }}</span>
        <strong>{{ item.value }}</strong>
      </article>
    </div>

    <div class="split result-split">
      <section class="card">
        <h2>Initial Charges</h2>
        <div v-if="initialCharges.length === 0">No initial charges.</div>
        <div class="mini-table" v-else>
          <table>
            <thead><tr><th>Code</th><th>Label</th><th>Amount</th><th>Mode</th><th>Effect</th></tr></thead>
            <tbody>
            <tr v-for="(c, i) in initialCharges" :key="i">
              <td>{{ c.code }}</td>
              <td>{{ c.label }}</td>
              <td>{{ formatMoney(c.amount, c.currency) }}</td>
              <td>{{ c.financingMode }}</td>
              <td>{{ effectOfFinancing(c.financingMode) }}</td>
            </tr>
            </tbody>
          </table>
        </div>
      </section>
      <section class="card">
        <h2>Financial Totals</h2>
        <div class="list">
          <div v-for="(item, idx) in totals" :key="idx" class="list-item">
            <span class="meta">{{ item.label }}</span>
            <strong :class="{ 'danger-text': item.danger }">{{ item.value }}</strong>
          </div>
        </div>
      </section>
    </div>

    <section class="card">
      <h2>Periodic Charges Detail</h2>
      <div v-if="periodicCharges.length === 0">No periodic charges.</div>
      <div class="mini-table" v-else>
        <table>
          <thead><tr><th>Code</th><th>Label</th><th>Type</th><th>Value</th><th>Base</th><th>Frequency</th><th>Range</th></tr></thead>
          <tbody>
          <tr v-for="(c, i) in periodicCharges" :key="i">
            <td>{{ c.code }}</td>
            <td>{{ c.label }}</td>
            <td>{{ c.chargeType }}</td>
            <td>{{ c.chargeType === 'FIXED_AMOUNT' ? formatMoney(c.amount, c.currency) : formatPercent(c.ratePercent) }}</td>
            <td>{{ c.rateBase || '---' }}</td>
            <td>{{ c.frequency }}</td>
            <td>{{ c.fromInstallment }}-{{ c.toInstallment }}</td>
          </tr>
          </tbody>
        </table>
      </div>
    </section>

    <section class="card">
      <h2>Amortization Schedule</h2>
      <div v-if="schedule.length === 0">No schedule data.</div>
      <div class="mini-table" v-else>
        <table>
          <thead>
          <tr><th>#</th><th>Date</th><th>Grace</th><th>Opening Balance</th><th>Interest</th><th>Financial Installment</th><th>Insurance</th><th>Charges</th><th>Balloon</th><th>Total</th><th>Closing Balance</th></tr>
          </thead>
          <tbody>
          <tr v-for="(s, idx) in schedule.slice(0, 60)" :key="idx">
            <td>{{ s.installmentNumber }}</td>
            <td>{{ s.dueDate }}</td>
            <td>{{ s.graceTypeApplied }}</td>
            <td>{{ formatMoney(s.openingBalance) }}</td>
            <td>{{ formatMoney(s.interest) }}</td>
            <td>{{ formatMoney(s.baseInstallment) }}</td>
            <td>{{ formatMoney(s.insuranceAmount) }}</td>
            <td>{{ formatMoney(s.additionalChargeAmount) }}</td>
            <td>{{ formatMoney(s.balloonPortion) }}</td>
            <td>{{ formatMoney(s.totalInstallment) }}</td>
            <td>{{ formatMoney(s.closingBalance) }}</td>
          </tr>
          </tbody>
        </table>
        <p v-if="schedule.length > 60" class="hint">Showing first 60 of {{ schedule.length }} installments.</p>
      </div>
    </section>

  </div>
</template>

<script setup>
import { computed } from 'vue'

const props = defineProps({
  calculation: { type: Object, default: null },
  request: { type: Object, default: null }
})

defineEmits(['back', 'save', 'share'])

const calc = computed(() => props.calculation?.calculation || props.calculation || {})
const summary = computed(() => calc.value?.summary || props.calculation?.summary || {})
const indicators = computed(() => calc.value?.indicators || props.calculation?.indicators || {})
const schedule = computed(() => calc.value?.schedule || props.calculation?.schedule || [])

const subtitle = computed(() => {
  const req = props.request
  if (req) {
    return `${req.client?.displayName || 'Client'} · ${req.vehicle?.brand || ''} ${req.vehicle?.model || ''}`
  }
  return 'No calculation loaded.'
})

const initialCharges = computed(() => props.request?.additionalCharges?.initialCharges || [])
const periodicCharges = computed(() => props.request?.additionalCharges?.periodicCharges || [])

const summaryCards = computed(() => [
  { label: 'Vehicle Price', value: formatMoney(summary.value.vehiclePrice ?? props.request?.vehicle?.vehiclePrice, props.request?.loan?.operationCurrency) },
  { label: 'Down Payment', value: formatMoney(summary.value.downPaymentAmount, props.request?.loan?.operationCurrency) },
  { label: 'Initial Charges Financed', value: formatMoney(summary.value.initialChargesFinanced, props.request?.loan?.operationCurrency) },
  { label: 'Principal Financed', value: formatMoney(summary.value.principalFinanced, props.request?.loan?.operationCurrency) },
  { label: 'Balloon Payment', value: formatMoney(summary.value.balloonAmount, props.request?.loan?.operationCurrency) },
  { label: 'Base Installment', value: formatMoney(summary.value.baseInstallment, props.request?.loan?.operationCurrency) },
  { label: 'Total Payable', value: formatMoney(summary.value.totalPayable, props.request?.loan?.operationCurrency) },
  { label: 'TCEA', value: formatPercent((indicators.value.effectiveAnnualCost ?? 0) * ((Math.abs(indicators.value.effectiveAnnualCost ?? 0) < 1) ? 100 : 1)) }
])

const totals = computed(() => {
  const currency = props.request?.loan?.operationCurrency || 'USD'
  return [
    { label: 'Principal', value: formatMoney(summary.value.principalFinanced, currency) },
    { label: 'Interest', value: formatMoney(summary.value.totalInterest, currency) },
    { label: 'Periodic Charges', value: formatMoney(summary.value.totalPeriodicCharges, currency) },
    { label: 'Insurance', value: formatMoney(summary.value.totalInsurance, currency) },
    { label: 'Balloon', value: formatMoney(summary.value.balloonAmount, currency) },
    { label: 'Total Payable', value: formatMoney(summary.value.totalPayable, currency), danger: true }
  ]
})

function formatMoney(value, currency = 'USD') {
  const n = Number(value ?? 0)
  return `${currency} ${n.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`
}

function formatPercent(value) {
  const n = Number(value ?? 0)
  return `${n.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}%`
}

function effectOfFinancing(mode) {
  if (mode === 'FINANCED') return 'Added to principal'
  if (mode === 'PAID_UPFRONT') return 'Paid at signing'
  if (mode === 'WITHHELD') return 'Deducted from disbursement'
  return ''
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
.mini-table th, .mini-table td {
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
