<template>
  <div class="dashboard">
    <header class="dashboard-header">
      <div>
        <h1>Panel principal</h1>
        <p>Resumen estructurado del desempeño de Capital Cruise.</p>
      </div>
      <div class="header-actions">
        <button class="action-btn secondary" type="button" @click="goToNewClient">
          <svg viewBox="0 0 24 24" aria-hidden="true"><path d="M16 11c1.66 0 3-1.34 3-3s-1.34-3-3-3-3 1.34-3 3 1.34 3 3 3zm-8 0c1.66 0 3-1.34 3-3S9.66 5 8 5 5 6.34 5 8s1.34 3 3 3zm0 2c-2.33 0-7 1.17-7 3.5V19h14v-2.5C15 14.17 10.33 13 8 13zm8 0c-.29 0-.62.02-.97.05 1.16.84 1.97 1.97 1.97 3.45V19h6v-2.5c0-2.33-4.67-3.5-7-3.5z" fill="currentColor"/></svg>
          Nuevo cliente
        </button>
        <button class="action-btn secondary" type="button" @click="goToNewVehicle">
          <svg viewBox="0 0 24 24" aria-hidden="true"><path d="M18.92 6.01C18.72 5.42 18.16 5 17.5 5h-11c-.66 0-1.21.42-1.42 1.01L3 12v8c0 .55.45 1 1 1h1c.55 0 1-.45 1-1v-1h12v1c0 .55.45 1 1 1h1c.55 0 1-.45 1-1v-8l-2.08-5.99zM6.5 16c-.83 0-1.5-.67-1.5-1.5S5.67 13 6.5 13s1.5.67 1.5 1.5S7.33 16 6.5 16zm11 0c-.83 0-1.5-.67-1.5-1.5s.67-1.5 1.5-1.5 1.5.67 1.5 1.5-.67 1.5-1.5 1.5zM5 11l1.5-4.5h11L19 11H5z" fill="currentColor"/></svg>
          Nuevo vehículo
        </button>
        <button class="action-btn primary" type="button" @click="goToNewOperation">
          <svg viewBox="0 0 24 24" aria-hidden="true"><path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm5 11h-4v4h-2v-4H7v-2h4V7h2v4h4v2z" fill="currentColor"/></svg>
          Nueva operación
        </button>
      </div>
    </header>

    <section class="metrics-grid">
      <article class="metric-card">
        <span class="metric-label">Clientes registrados</span>
        <strong class="metric-value">{{ formatCount(clientsCount) }}</strong>
        <span class="metric-trend positive">
          <svg viewBox="0 0 24 24" aria-hidden="true"><path d="M7 14l5-5 5 5H7z" fill="currentColor"/></svg>
          Clientes activos
        </span>
      </article>
      <article class="metric-card">
        <span class="metric-label">Vehículos activos</span>
        <strong class="metric-value">{{ formatCount(vehiclesCount) }}</strong>
        <span class="metric-trend neutral">
          <svg viewBox="0 0 24 24" aria-hidden="true"><path d="M5 12h14" stroke="currentColor" stroke-width="2"/></svg>
          Inventario estable
        </span>
      </article>
      <article class="metric-card">
        <span class="metric-label">Operaciones guardadas</span>
        <strong class="metric-value">{{ formatCount(operationsCount) }}</strong>
        <span class="metric-trend positive">
          <svg viewBox="0 0 24 24" aria-hidden="true"><path d="M7 14l5-5 5 5H7z" fill="currentColor"/></svg>
          {{ savedOperationsLabel }}
        </span>
      </article>
    </section>

    <section class="recent-card">
      <div class="recent-header">
        <h2>Operaciones recientes</h2>
        <router-link to="/operations" class="view-all">Ver historial completo</router-link>
      </div>

      <div v-if="loading" class="table-state">Cargando operaciones recientes...</div>
      <div v-else-if="recentOperations.length === 0" class="table-state">
        Aún no hay operaciones. Crea tu primera operación para verla aquí.
      </div>
      <div v-else class="table-wrap">
        <table>
          <thead>
            <tr>
              <th>Cliente</th>
              <th>Vehículo</th>
              <th>Monto</th>
              <th>Fecha</th>
              <th>Estado</th>
            </tr>
          </thead>
          <tbody>
            <tr
              v-for="operation in recentOperations"
              :key="operation.operationId"
              class="clickable-row"
              @click="openOperation(operation.operationId)"
            >
              <td>
                <div class="client-cell">
                  <span class="avatar" :style="{ background: avatarColor(operation.clientFullName) }">
                    {{ initials(operation.clientFullName) }}
                  </span>
                  <span>{{ operation.clientFullName }}</span>
                </div>
              </td>
              <td>{{ operation.vehicleLabel }}</td>
              <td class="amount">{{ formatAmount(operation.financedAmount, operation.currency) }}</td>
              <td>{{ formatDate(operation.createdAt) }}</td>
              <td>
                <span class="status-badge" :class="statusClass(operation.status)">
                  {{ statusLabel(operation.status) }}
                </span>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </section>
  </div>
</template>

<script setup>
import { computed, onMounted, ref } from 'vue'
import { useRouter } from 'vue-router'
import { clientService } from '../../clients/services/client.service.js'
import { vehicleService } from '../../vehicles/services/vehicle.service.js'
import { loanService } from '../services/loan.service.js'

const router = useRouter()

const loading = ref(true)
const clientsCount = ref(null)
const vehiclesCount = ref(null)
const operationsCount = ref(null)
const savedCount = ref(0)
const recentOperations = ref([])

const savedOperationsLabel = computed(() => {
  if (savedCount.value > 0) {
    return `${savedCount.value} guardadas`
  }
  return 'Sin operaciones guardadas'
})

function goToNewClient() {
  router.push({ path: '/clients', query: { action: 'new' } })
}

function goToNewVehicle() {
  router.push({ path: '/vehicles', query: { action: 'new' } })
}

function goToNewOperation() {
  router.push('/simulation')
}

function openOperation(operationId) {
  router.push(`/operation/${operationId}`)
}

function formatCount(value) {
  if (value === null || value === undefined) return '--'
  return new Intl.NumberFormat('es-PE').format(value)
}

function formatAmount(amount, currency = 'USD') {
  if (amount === null || amount === undefined) return '—'
  return new Intl.NumberFormat('es-PE', {
    style: 'currency',
    currency: currency || 'USD'
  }).format(Number(amount))
}

function formatDate(value) {
  if (!value) return '—'
  return new Intl.DateTimeFormat('es-PE', {
    month: 'short',
    day: 'numeric',
    year: 'numeric'
  }).format(new Date(value))
}

function initials(name = '') {
  return name
    .split(' ')
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0]?.toUpperCase() || '')
    .join('') || '?'
}

function avatarColor(name = '') {
  const palette = ['#dbeafe', '#dcfce7', '#fef3c7', '#ede9fe', '#ffe4e6']
  const index = name.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0) % palette.length
  return palette[index]
}

function statusLabel(status) {
  const map = {
    SAVED: 'Guardada',
    CALCULATED: 'Calculada',
    DRAFT: 'Borrador'
  }
  return map[status] || status || 'Pendiente'
}

function statusClass(status) {
  const label = statusLabel(status)
  if (label === 'Guardada') return 'processed'
  if (label === 'Fallida') return 'failed'
  return 'pending'
}

async function loadDashboard() {
  loading.value = true

  const [clientsResult, vehiclesResult, operationsResult] = await Promise.allSettled([
    clientService.getClientSummary(),
    vehicleService.getVehicleSummary(),
    loanService.getSummary()
  ])

  if (clientsResult.status === 'fulfilled') {
    clientsCount.value = clientsResult.value?.totalClients ?? 0
  }

  if (vehiclesResult.status === 'fulfilled') {
    vehiclesCount.value = vehiclesResult.value?.totalVehicles ?? 0
  }

  if (operationsResult.status === 'fulfilled') {
    const summary = operationsResult.value || {}
    operationsCount.value = summary.totalOperations ?? 0
    savedCount.value = summary.countByStatus?.SAVED ?? 0
    recentOperations.value = summary.recentOperations ?? []
  }

  loading.value = false
}

onMounted(loadDashboard)
</script>

<style scoped>
.dashboard {
  display: grid;
  gap: 28px;
}

.dashboard-header {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  gap: 20px;
}

.dashboard-header h1 {
  margin: 0;
  font-size: 32px;
  font-weight: 700;
  color: #0b1f3a;
}

.dashboard-header p {
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

.action-btn {
  display: inline-flex;
  align-items: center;
  gap: 8px;
  border: 0;
  border-radius: 10px;
  padding: 11px 16px;
  font-weight: 700;
  font-size: 14px;
  cursor: pointer;
  white-space: nowrap;
}

.action-btn svg {
  width: 18px;
  height: 18px;
}

.action-btn.secondary {
  background: #e8ecf1;
  color: #26394e;
}

.action-btn.primary {
  background: #08264a;
  color: #ffffff;
}

.metrics-grid {
  display: grid;
  grid-template-columns: repeat(3, minmax(0, 1fr));
  gap: 20px;
}

.metric-card {
  background: #ffffff;
  border-radius: 14px;
  padding: 24px;
  box-shadow: 0 8px 24px rgba(8, 38, 74, 0.06);
  border: 1px solid #edf1f6;
}

.metric-label {
  display: block;
  color: #6f7d8f;
  font-size: 11px;
  font-weight: 800;
  letter-spacing: 0.08em;
  text-transform: uppercase;
}

.metric-value {
  display: block;
  margin-top: 10px;
  font-size: 34px;
  line-height: 1;
  color: #0b1f3a;
}

.metric-trend {
  display: inline-flex;
  align-items: center;
  gap: 4px;
  margin-top: 14px;
  font-size: 13px;
  font-weight: 600;
}

.metric-trend svg {
  width: 14px;
  height: 14px;
}

.metric-trend.positive {
  color: #059669;
}

.metric-trend.neutral {
  color: #6f7d8f;
}

.recent-card {
  background: #ffffff;
  border-radius: 14px;
  padding: 24px;
  box-shadow: 0 8px 24px rgba(8, 38, 74, 0.06);
  border: 1px solid #edf1f6;
}

.recent-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 16px;
  margin-bottom: 20px;
}

.recent-header h2 {
  margin: 0;
  font-size: 20px;
  color: #0b1f3a;
}

.view-all {
  color: #2563eb;
  font-weight: 700;
  font-size: 14px;
  text-decoration: none;
}

.view-all:hover {
  text-decoration: underline;
}

.table-state {
  color: #6f7d8f;
  padding: 24px 0;
  text-align: center;
}

.table-wrap {
  overflow-x: auto;
}

table {
  width: 100%;
  border-collapse: collapse;
}

th {
  text-align: left;
  padding: 12px 16px;
  color: #6f7d8f;
  font-size: 11px;
  font-weight: 800;
  letter-spacing: 0.08em;
  text-transform: uppercase;
  border-bottom: 1px solid #edf1f6;
}

td {
  padding: 16px;
  border-bottom: 1px solid #f3f6fa;
  color: #1d2632;
  font-size: 14px;
}

.clickable-row {
  cursor: pointer;
  transition: background 0.15s ease;
}

.clickable-row:hover {
  background: #f8fafc;
}

.client-cell {
  display: flex;
  align-items: center;
  gap: 12px;
}

.avatar {
  width: 36px;
  height: 36px;
  border-radius: 50%;
  display: grid;
  place-items: center;
  font-size: 12px;
  font-weight: 800;
  color: #08264a;
  flex-shrink: 0;
}

.amount {
  font-weight: 700;
}

.status-badge {
  display: inline-block;
  padding: 4px 10px;
  border-radius: 999px;
  font-size: 11px;
  font-weight: 800;
  letter-spacing: 0.04em;
}

.status-badge.processed {
  background: #dcfce7;
  color: #166534;
}

.status-badge.pending {
  background: #dbeafe;
  color: #1d4ed8;
}

.status-badge.failed {
  background: #fee2e2;
  color: #b91c1c;
}

@media (max-width: 1100px) {
  .metrics-grid {
    grid-template-columns: 1fr;
  }

  .dashboard-header {
    flex-direction: column;
  }

  .header-actions {
    width: 100%;
    justify-content: flex-start;
  }
}

@media (max-width: 760px) {
  .header-actions {
    flex-direction: column;
  }

  .action-btn {
    width: 100%;
    justify-content: center;
  }
}
</style>
