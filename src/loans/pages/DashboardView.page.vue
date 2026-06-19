<template>
  <div>
    <div class="grid cards-4">
      <article class="card metric">
        <span>Backend</span>
        <strong id="backendStatus">{{ backendStatus }}</strong>
      </article>
      <article class="card metric">
        <span>Clients</span>
        <strong>{{ clientsCount }}</strong>
      </article>
      <article class="card metric">
        <span>Vehicles</span>
        <strong>{{ vehiclesCount }}</strong>
      </article>
      <article class="card metric">
        <span>Operations</span>
        <strong>{{ operationsCount }}</strong>
      </article>
    </div>
    <div class="card">
      <h2>Integration phases</h2>
      <ol class="phase-list">
        <li><strong>Phase 1.</strong> Auth, health, clients, vehicles and demo data listing.</li>
        <li><strong>Phase 2.</strong> New simulation, flexible charges, quote calculation and save operation.</li>
        <li><strong>Phase 3.</strong> Operation detail, public share, QR generated in frontend and public quote view.</li>
      </ol>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { http } from '../../shared/services/http.instance.js'
import { clientService } from '../../clients/services/client.service.js'
import { vehicleService } from '../../vehicles/services/vehicle.service.js'
import { loanService } from '../services/loan.service.js'

const backendStatus = ref('Not checked')
const clientsCount = ref('--')
const vehiclesCount = ref('--')
const operationsCount = ref('--')

async function loadDashboard() {
  try {
    await checkHealth()
  } catch {
    // ignore
  }

  const results = await Promise.allSettled([
    clientService.getClientSummary(),
    vehicleService.getVehicleSummary(),
    loanService.getSummary()
  ])

  clientsCount.value = countFromSummary(results[0].value)
  vehiclesCount.value = countFromSummary(results[1].value)
  operationsCount.value = countFromSummary(results[2].value)
}

async function checkHealth() {
  try {
    const data = await http.get('/api/v1/health', { noAuth: true })
    backendStatus.value = data.status || 'UP'
  } catch {
    backendStatus.value = 'DOWN'
  }
}

function countFromSummary(obj) {
  if (!obj) return '--'
  return obj.totalClients ?? obj.totalVehicles ?? obj.totalOperations ?? obj.count ?? obj.total ?? JSON.stringify(obj)
}

onMounted(loadDashboard)
</script>

<style scoped>
.grid {
  display: grid;
  gap: 16px;
}
.cards-4 {
  grid-template-columns: repeat(4, minmax(0, 1fr));
}
.card {
  background: #ffffff;
  border-radius: 12px;
  padding: 24px;
  box-shadow: 0 12px 30px rgba(8, 38, 74, 0.08);
  border: 1px solid #edf1f6;
  margin-bottom: 22px;
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
  font-size: 26px;
}
.phase-list {
  line-height: 1.8;
}
@media (max-width: 760px) {
  .cards-4 {
    grid-template-columns: repeat(2, minmax(0, 1fr));
  }
}
</style>