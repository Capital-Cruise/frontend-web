<template>
  <div>
    <div class="card">
      <div class="section-head">
        <div>
          <h2>Operation Detail</h2>
          <p>Fetch operation, schedule and indicators.</p>
        </div>
        <div class="inline-form">
          <input v-model="operationId" placeholder="Operation ID" />
          <button class="secondary" @click="loadDetail">Load Detail</button>
          <button class="primary" @click="createShare">Create Share</button>
        </div>
      </div>
    </div>

    <div id="detailCards" class="grid cards-4">
      <article v-for="(item, idx) in detailCards" :key="idx" class="card metric">
        <span>{{ item.label }}</span>
        <strong>{{ item.value }}</strong>
      </article>
    </div>

    <section class="card">
      <h2>Operation JSON</h2>
      <pre class="debug">{{ JSON.stringify(detail, null, 2) }}</pre>
    </section>

    <section class="card">
      <h2>Schedule</h2>
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

    <section class="card">
      <h2>Indicators</h2>
      <pre class="debug">{{ JSON.stringify(indicators, null, 2) }}</pre>
    </section>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'

const props = defineProps({
  operationId: { type: String, default: '' }
})

const emit = defineEmits(['load-detail', 'share'])

const detail = ref(null)
const schedule = ref([])
const indicators = ref(null)

const detailCards = computed(() => {
  const d = detail.value || {}
  return [
    { label: 'Operation ID', value: props.operationId || '--' },
    { label: 'Status', value: d.status || '--' },
    { label: 'Currency', value: d.currency || d.operationCurrency || '--' },
    { label: 'Schedule Rows', value: Array.isArray(schedule.value) ? schedule.value.length : '--' }
  ]
})

function loadDetail() {
  if (!props.operationId) {
    alert('Provide operationId')
    return
  }
  emit('load-detail', props.operationId)
}

function createShare() {
  if (!props.operationId) {
    alert('Load an operation first')
    return
  }
  emit('share', props.operationId)
}

function formatMoney(value, currency = 'USD') {
  const n = Number(value ?? 0)
  return `${currency} ${n.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`
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
.section-head {
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 16px;
  margin-bottom: 16px;
}
.section-head h2 {
  margin: 0;
}
.section-head p {
  margin: 4px 0 0;
  color: #4a5568;
}
.inline-form {
  display: flex;
  gap: 10px;
  align-items: center;
  flex-wrap: wrap;
}
.inline-form input {
  width: 180px;
}
input {
  border: 1px solid transparent;
  background: #dfe4e9;
  border-radius: 8px;
  padding: 12px 14px;
  color: #1d2632;
  outline: none;
  font: inherit;
}
input:focus {
  border-color: #9bbcff;
  background: #eef4ff;
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
.debug {
  background: #101a2a;
  color: #d7e5ff;
  border-radius: 10px;
  padding: 16px;
  max-height: 420px;
  overflow: auto;
  font-size: 12px;
  white-space: pre-wrap;
  word-break: break-word;
}
.hint {
  font-size: 13px;
  color: #6f7d8f;
  margin-top: 8px;
}
@media (max-width: 760px) {
  .cards-4 {
    grid-template-columns: repeat(2, minmax(0, 1fr));
  }
  .section-head {
    flex-direction: column;
    align-items: stretch;
  }
  .inline-form input {
    width: 100%;
  }
}
</style>