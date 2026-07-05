<template>
  <section class="public-quote">
    <div class="hero card">
      <div>
        <p class="eyebrow">Operación compartida</p>
        <h1>{{ quote.clientName || 'Operación compartida' }}</h1>
        <p class="subtitle">{{ quote.vehicleLabel }}</p>
      </div>
      <span class="status-pill">{{ statusLabel }}</span>
    </div>

    <div v-if="loading" class="card state-card">Cargando cotización pública...</div>
    <div v-else-if="error" class="card state-card error">{{ error }}</div>

    <div v-else class="content">
      <section class="card metrics">
        <article v-for="item in metrics" :key="item.label" class="metric">
          <span>{{ item.label }}</span>
          <strong>{{ item.value }}</strong>
        </article>
      </section>

      <section class="card schedule-card">
        <h2>Cronograma de pagos</h2>
        <div class="table-wrap">
          <table>
            <thead>
              <tr>
                <th>N.º</th>
                <th>Fecha</th>
                <th>Saldo inicial</th>
                <th>Interés</th>
                <th>Cuota total</th>
                <th>Saldo final</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="line in quote.schedule || []" :key="line.installmentNumber">
                <td>{{ line.installmentNumber }}</td>
                <td>{{ line.dueDate }}</td>
                <td>{{ formatMoney(line.openingBalance) }}</td>
                <td>{{ formatMoney(line.interest) }}</td>
                <td>{{ formatMoney(line.totalInstallment) }}</td>
                <td>{{ formatMoney(line.closingBalance) }}</td>
              </tr>
            </tbody>
          </table>
        </div>
      </section>
    </div>
  </section>
</template>

<script setup>
import { computed, onMounted, ref } from 'vue'
import { loanService } from '../../loans/services/loan.service.js'
import { formatOperationStatusLabel } from '../../shared/utils/loan-labels.js'

const props = defineProps({
  shareToken: { type: String, required: true }
})

const loading = ref(true)
const error = ref('')
const quote = ref({})

const statusLabel = computed(() => formatOperationStatusLabel(quote.value?.status || 'SAVED'))
const currency = computed(() => quote.value?.currency || 'USD')

const metrics = computed(() => [
  { label: 'Monto financiado', value: formatMoney(quote.value.principalFinanced) },
  { label: 'Desembolso neto', value: formatMoney(quote.value.cashAtSigning) },
  { label: 'Cargos adicionales', value: formatMoney(quote.value.totalAdditionalCharges) },
  { label: 'Cargos periódicos', value: formatMoney(quote.value.totalPeriodicCharges) },
  { label: 'TCEA', value: formatPercent(quote.value.tcea) },
  { label: 'VAN', value: formatMoney(quote.value.npv) }
])

async function loadQuote() {
  loading.value = true
  error.value = ''

  try {
    quote.value = await loanService.getPublicQuote(props.shareToken)
  } catch (err) {
    error.value = err.message || 'No se pudo cargar la operación compartida.'
  } finally {
    loading.value = false
  }
}

function formatMoney(value) {
  if (value === null || value === undefined || value === '') return '--'
  const n = Number(value)
  if (Number.isNaN(n)) return '--'
  return `${currency.value} ${n.toLocaleString('es-PE', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`
}

function formatPercent(value) {
  if (value === null || value === undefined || value === '') return '--'
  const n = Number(value)
  if (Number.isNaN(n)) return '--'
  return `${(Math.abs(n) <= 1 ? n * 100 : n).toLocaleString('es-PE', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}%`
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
  border-radius: 14px;
  padding: 24px;
  box-shadow: 0 12px 30px rgba(8, 38, 74, 0.08);
}

.hero {
  display: flex;
  justify-content: space-between;
  gap: 20px;
  align-items: center;
}

.eyebrow {
  margin: 0 0 8px;
  color: #6f7d8f;
  font-size: 12px;
  font-weight: 800;
  text-transform: uppercase;
  letter-spacing: 0.08em;
}

h1 {
  margin: 0;
  color: #08264a;
  font-size: 30px;
}

.subtitle {
  margin: 6px 0 0;
  color: #4a5568;
}

.status-pill {
  background: #e7f8eb;
  color: #166534;
  border-radius: 999px;
  padding: 8px 12px;
  font-weight: 800;
}

.content {
  display: grid;
  gap: 24px;
}

.metrics {
  display: grid;
  grid-template-columns: repeat(3, minmax(0, 1fr));
  gap: 16px;
}

.metric span {
  display: block;
  color: #6f7d8f;
  font-size: 12px;
  font-weight: 800;
  text-transform: uppercase;
}

.metric strong {
  display: block;
  margin-top: 8px;
  color: #0b1f3a;
  font-size: 24px;
}

.schedule-card h2 {
  margin: 0 0 16px;
}

.table-wrap {
  overflow: auto;
}

table {
  width: 100%;
  min-width: 720px;
  border-collapse: collapse;
}

th,
td {
  padding: 12px 14px;
  border-bottom: 1px solid #edf1f6;
  text-align: left;
}

th {
  background: #eef3f8;
  color: #526173;
  font-size: 11px;
  text-transform: uppercase;
}

.state-card {
  text-align: center;
}

.state-card.error {
  color: #8f1521;
}

@media (max-width: 960px) {
  .hero,
  .metrics {
    grid-template-columns: 1fr;
  }

  .hero {
    display: grid;
  }
}
</style>
