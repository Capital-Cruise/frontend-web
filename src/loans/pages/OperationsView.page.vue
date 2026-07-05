<template>
  <section class="operations-page">
    <header class="page-header">
      <div>
        <nav class="breadcrumb" aria-label="Breadcrumb">
          <span>Portal</span>
          <span>Historial de operaciones</span>
        </nav>
        <h1>Historial de operaciones</h1>
        <p>Revisa y audita todas las simulaciones financieras procesadas en Capital Cruise.</p>
      </div>

      <div class="header-actions">
        <button class="action-btn secondary" type="button" :disabled="operations.length === 0" @click="exportCsv">
          <svg viewBox="0 0 24 24" aria-hidden="true"><path d="M5 20h14v-2H5v2zm7-18v10.17l3.59-3.58L17 10l-6 6-6-6 1.41-1.41L10 12.17V2h2z" fill="currentColor"/></svg>
          Exportar CSV
        </button>
        <button class="action-btn primary" type="button" @click="goToNewSimulation">
          <svg viewBox="0 0 24 24" aria-hidden="true"><path d="M11 5h2v14h-2V5zm-6 6h14v2H5v-2z" fill="currentColor"/></svg>
          Nueva simulación
        </button>
      </div>
    </header>

    <section class="filters-panel" aria-label="Filtros de operaciones">
      <label>
        <span>Nombre del cliente</span>
        <input
          v-model="filters.client"
          type="search"
          placeholder="Filtrar por cliente..."
          @input="applyClientFilter"
        />
      </label>

      <label>
        <span>Moneda</span>
        <select v-model="filters.currency" @change="loadOperations(0)">
          <option value="">Todas las monedas</option>
          <option value="USD">Dólares</option>
          <option value="PEN">Soles</option>
        </select>
      </label>

      <label>
        <span>Estado</span>
        <select v-model="filters.status" @change="loadOperations(0)">
          <option value="">Cualquier estado</option>
          <option value="SAVED">Guardada</option>
          <option value="CALCULATED">Calculada</option>
          <option value="DRAFT">Borrador</option>
        </select>
      </label>

      <button class="clear-btn" type="button" :disabled="!hasFilters" @click="clearFilters">
        <svg viewBox="0 0 24 24" aria-hidden="true"><path d="M10 18h4v-2h-4v2zM3 6v2h18V6H3zm3 7h12v-2H6v2z" fill="currentColor"/></svg>
        Limpiar filtros
      </button>
    </section>

    <div v-if="loading" class="state-panel">Cargando operaciones guardadas...</div>

    <div v-else-if="visibleOperations.length === 0" class="state-panel">
      <strong>No se encontraron operaciones guardadas.</strong>
      <span>Intenta cambiar los filtros o crear una nueva simulación.</span>
    </div>

    <div v-else class="operation-sections">
      <section v-for="group in groupedOperations" :key="group.key" class="date-section">
        <h2>{{ group.label }}</h2>

        <div class="operations-grid">
          <article
            v-for="operation in group.items"
            :key="operation.identifier"
            class="operation-card"
            @click="openOperation(operation.identifier)"
          >
            <div class="card-main">
              <span class="eyebrow">Perfil del vehículo</span>
              <strong>{{ operation.title }}</strong>

              <span class="eyebrow client-label">Cliente principal</span>
              <p>{{ operation.displayClient }}</p>
            </div>

            <footer>
              <span class="time">
                <svg viewBox="0 0 24 24" aria-hidden="true"><path d="M12 2a10 10 0 100 20 10 10 0 000-20zm1 11h4v-2h-3V7h-2v6h1z" fill="currentColor"/></svg>
                {{ formatTime(operation.createdAt) }}
              </span>

              <div class="card-actions">
                <span class="status-pill" :class="statusClass(operation.status)">
                  {{ statusLabel(operation.status) }}
                </span>
                <button
                  class="arrow-icon"
                  type="button"
                  title="Ver detalle de operación"
                  @click.stop="openOperation(operation.identifier)"
                >
                  <svg viewBox="0 0 24 24" aria-hidden="true"><path d="M9.29 6.71a1 1 0 011.42 0L16 12l-5.29 5.29a1 1 0 01-1.42-1.42L13.17 12 9.29 8.12a1 1 0 010-1.41z" fill="currentColor"/></svg>
                </button>
              </div>
            </footer>
          </article>
        </div>
      </section>

      <footer v-if="totalPages > 1" class="pagination">
        <button class="page-btn" type="button" :disabled="page === 0" @click="loadOperations(page - 1)">
          Anterior
        </button>
        <span>Página {{ page + 1 }} de {{ totalPages }}</span>
        <button class="page-btn" type="button" :disabled="page + 1 >= totalPages" @click="loadOperations(page + 1)">
          Siguiente
        </button>
      </footer>
    </div>
  </section>
</template>

<script setup>
import { computed, onMounted, ref } from 'vue'
import { useRouter } from 'vue-router'
import { loanService } from '../services/loan.service.js'
import { toastService } from '../../shared/services/toast.service.js'
import { formatOperationStatusLabel } from '../../shared/utils/loan-labels.js'

const router = useRouter()

const operations = ref([])
const loading = ref(false)
const page = ref(0)
const pageSize = ref(20)
const totalPages = ref(1)
const filters = ref({
  client: '',
  currency: '',
  status: ''
})

let clientFilterTimer = null

const hasFilters = computed(() =>
  Boolean(filters.value.client || filters.value.currency || filters.value.status)
)

const visibleOperations = computed(() => {
  const client = filters.value.client.trim().toLowerCase()
  if (!client) return operations.value

  return operations.value.filter((operation) =>
    operation.displayClient.toLowerCase().includes(client)
  )
})

const groupedOperations = computed(() => {
  const groups = new Map()

  visibleOperations.value.forEach((operation) => {
    const date = operation.createdAt ? new Date(operation.createdAt) : null
    const key = date && !Number.isNaN(date.getTime())
      ? date.toISOString().slice(0, 10)
      : 'unknown'

    if (!groups.has(key)) {
      groups.set(key, {
        key,
        label: date ? formatGroupLabel(date) : 'Sin fecha',
        items: []
      })
    }

    groups.get(key).items.push(operation)
  })

  return [...groups.values()]
})

async function loadOperations(targetPage = page.value) {
  loading.value = true

  try {
    const result = await loanService.getOperationsPage({
      page: targetPage,
      size: pageSize.value,
      status: filters.value.status,
      currency: filters.value.currency
    })

    operations.value = result.operations
    page.value = result.page
    totalPages.value = Math.max(result.totalPages, 1)
  } catch (err) {
    toastService.error(err.message)
  } finally {
    loading.value = false
  }
}

function applyClientFilter() {
  clearTimeout(clientFilterTimer)
  clientFilterTimer = setTimeout(() => {
    page.value = 0
  }, 150)
}

function clearFilters() {
  filters.value = {
    client: '',
    currency: '',
    status: ''
  }
  loadOperations(0)
}

function goToNewSimulation() {
  router.push('/simulation')
}

function openOperation(operationId) {
  if (!operationId) return
  router.push(`/operation/${operationId}`)
}

function exportCsv() {
  const rows = [
    ['ID', 'Cliente', 'Vehículo', 'Moneda', 'Estado', 'Plazo en meses', 'Creado el'],
    ...visibleOperations.value.map((operation) => [
      operation.identifier,
      operation.displayClient,
      operation.title,
      operation.currency,
      operation.status,
      operation.termMonths || '',
      operation.createdAt || ''
    ])
  ]

  const csv = rows
    .map((row) => row.map((value) => `"${String(value ?? '').replace(/"/g, '""')}"`).join(','))
    .join('\n')

  const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' })
  const url = URL.createObjectURL(blob)
  const link = document.createElement('a')
  link.href = url
  link.download = 'capital-cruise-operations.csv'
  link.click()
  URL.revokeObjectURL(url)
}

function formatGroupLabel(date) {
  const today = new Date()
  const yesterday = new Date()
  yesterday.setDate(today.getDate() - 1)

  const dateKey = date.toDateString()
  const formatted = new Intl.DateTimeFormat('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric'
  }).format(date)

  if (dateKey === today.toDateString()) return `Hoy - ${formatted}`
  if (dateKey === yesterday.toDateString()) return `Ayer - ${formatted}`
  return formatted
}

function formatTime(value) {
  if (!value) return '--:--'
  const date = new Date(value)
  if (Number.isNaN(date.getTime())) return '--:--'

  return new Intl.DateTimeFormat('en-US', {
    hour: '2-digit',
    minute: '2-digit'
  }).format(date)
}

function statusLabel(status) {
  return formatOperationStatusLabel(status)
}

function statusClass(status) {
  return {
    saved: status === 'SAVED',
    calculated: status === 'CALCULATED',
    draft: status === 'DRAFT'
  }
}

onMounted(() => {
  loadOperations(0)
})
</script>

<style scoped>
.operations-page {
  display: grid;
  gap: 28px;
}

.page-header {
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  gap: 24px;
}

.breadcrumb {
  display: flex;
  align-items: center;
  gap: 8px;
  color: #6f7d8f;
  font-size: 12px;
  font-weight: 700;
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

.page-header h1 {
  margin: 0;
  color: #0b1f3a;
  font-size: 32px;
  line-height: 1.05;
}

.page-header p {
  margin: 8px 0 0;
  color: #6f7d8f;
  font-size: 15px;
}

.header-actions {
  display: flex;
  gap: 12px;
  flex-wrap: wrap;
  justify-content: flex-end;
}

.action-btn,
.clear-btn,
.page-btn {
  border: 0;
  cursor: pointer;
  font: inherit;
}

.action-btn {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  min-height: 40px;
  border-radius: 8px;
  padding: 0 16px;
  font-size: 13px;
  font-weight: 800;
}

.action-btn svg,
.clear-btn svg,
.arrow-icon svg,
.time svg {
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

.action-btn:disabled,
.clear-btn:disabled,
.page-btn:disabled {
  cursor: not-allowed;
  opacity: 0.55;
}

.filters-panel {
  display: grid;
  grid-template-columns: minmax(220px, 1.1fr) minmax(180px, 0.75fr) minmax(170px, 0.75fr) minmax(190px, 0.85fr);
  gap: 16px;
  align-items: end;
  padding: 18px;
  background: #f4f7fb;
  border: 1px solid #edf1f6;
  border-radius: 8px;
}

.filters-panel label {
  display: grid;
  gap: 8px;
}

.filters-panel span {
  color: #526173;
  font-size: 11px;
  font-weight: 900;
  letter-spacing: 0.08em;
  text-transform: uppercase;
}

.filters-panel input,
.filters-panel select {
  width: 100%;
  min-height: 40px;
  border: 1px solid transparent;
  border-radius: 6px;
  background: #ffffff;
  color: #1d2632;
  font: inherit;
  font-size: 13px;
  outline: none;
  padding: 0 12px;
}

.filters-panel input:focus,
.filters-panel select:focus {
  border-color: #9bbcff;
  box-shadow: 0 0 0 3px rgba(155, 188, 255, 0.24);
}

.clear-btn {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  min-height: 40px;
  border-radius: 6px;
  background: #dde3ea;
  color: #334155;
  font-size: 13px;
  font-weight: 800;
}

.operation-sections {
  display: grid;
  gap: 26px;
}

.date-section {
  display: grid;
  gap: 14px;
}

.date-section h2 {
  margin: 0;
  color: #6f7d8f;
  font-size: 12px;
  font-weight: 900;
  letter-spacing: 0.08em;
  text-transform: uppercase;
}

.operations-grid {
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: 18px;
}

.operation-card {
  display: grid;
  gap: 22px;
  min-height: 156px;
  padding: 20px;
  background: #ffffff;
  border: 1px solid #edf1f6;
  border-left: 4px solid transparent;
  border-radius: 8px;
  box-shadow: 0 8px 22px rgba(8, 38, 74, 0.04);
  cursor: pointer;
  transition: border-color 0.16s ease, box-shadow 0.16s ease, transform 0.16s ease;
}

.operation-card:hover {
  border-left-color: #9bbcff;
  box-shadow: 0 14px 28px rgba(8, 38, 74, 0.08);
  transform: translateY(-1px);
}

.card-main {
  display: grid;
}

.eyebrow {
  color: #526173;
  font-size: 11px;
  font-weight: 900;
  letter-spacing: 0.08em;
  text-transform: uppercase;
}

.operation-card strong {
  margin-top: 4px;
  color: #08264a;
  font-size: 17px;
  line-height: 1.25;
}

.client-label {
  margin-top: 18px;
}

.operation-card p {
  margin: 4px 0 0;
  color: #1d2632;
  font-size: 15px;
  font-weight: 700;
}

.operation-card footer {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 12px;
  padding-top: 14px;
  border-top: 1px solid #f3f6fa;
}

.time {
  display: inline-flex;
  align-items: center;
  gap: 5px;
  color: #6f7d8f;
  font-size: 12px;
  font-weight: 700;
}

.card-actions {
  display: inline-flex;
  align-items: center;
  gap: 10px;
}

.status-pill {
  display: inline-flex;
  align-items: center;
  min-height: 24px;
  border-radius: 999px;
  padding: 0 10px;
  background: #e8ecf1;
  color: #526173;
  font-size: 11px;
  font-weight: 900;
}

.status-pill.saved {
  background: #dcfce7;
  color: #166534;
}

.status-pill.calculated {
  background: #dbeafe;
  color: #1d4ed8;
}

.status-pill.draft {
  background: #fef3c7;
  color: #92400e;
}

.arrow-icon {
  display: grid;
  place-items: center;
  width: 34px;
  height: 34px;
  border: 0;
  border-radius: 50%;
  background: transparent;
  color: #365b8c;
  cursor: pointer;
}

.arrow-icon:hover {
  background: #edf4ff;
}

.state-panel {
  display: grid;
  place-items: center;
  gap: 6px;
  min-height: 240px;
  border: 1px dashed #cfd8e3;
  border-radius: 8px;
  background: #f8fafc;
  color: #6f7d8f;
  text-align: center;
  padding: 32px;
}

.state-panel strong {
  color: #0b1f3a;
}

.pagination {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 16px;
  color: #526173;
  font-size: 13px;
  font-weight: 800;
}

.page-btn {
  min-height: 38px;
  border-radius: 8px;
  background: #e8ecf1;
  color: #26394e;
  padding: 0 16px;
  font-size: 13px;
  font-weight: 800;
}

@media (max-width: 1120px) {
  .page-header {
    flex-direction: column;
  }

  .header-actions {
    justify-content: flex-start;
  }

  .filters-panel {
    grid-template-columns: repeat(2, minmax(0, 1fr));
  }
}

@media (max-width: 760px) {
  .page-header h1 {
    font-size: 28px;
  }

  .header-actions,
  .filters-panel,
  .operations-grid {
    grid-template-columns: 1fr;
  }

  .header-actions {
    display: grid;
    width: 100%;
  }

  .action-btn,
  .clear-btn {
    width: 100%;
  }

  .operation-card footer {
    align-items: flex-start;
    flex-direction: column;
  }

  .card-actions {
    width: 100%;
    justify-content: space-between;
  }
}
</style>
