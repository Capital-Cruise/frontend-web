<template>
  <SimulationForm
    :clients="clients"
    :vehicles="vehicles"
    :calculation="restoredCalculation"
    :last-request="restoredRequest"
    :calculating="calculating"
    :initial-request="initialRequest"
    @calculate="onCalculate"
    @clear-result="clearResult"
  />
</template>

<script setup>
import { computed, ref, onMounted, watch } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import SimulationForm from '../components/SimulationForm.component.vue'
import { clientService } from '../../clients/services/client.service.js'
import { vehicleService } from '../../vehicles/services/vehicle.service.js'
import { loanService } from '../services/loan.service.js'
import { toastService } from '../../shared/services/toast.service.js'
import { mapOperationDetailToSimulationRequest } from '../utils/recalculate-request.util.js'
import {
  clearSimulationSession,
  loadSimulationRequest,
  loadSimulationResult,
  saveSimulationRequest,
  saveSimulationResult,
  clearSimulationResult
} from '../utils/simulation-session.util.js'

const clients = ref([])
const vehicles = ref([])
const router = useRouter()
const route = useRoute()
const calculating = ref(false)
const recalculationRequest = ref(null)

const restoredRequest = computed(() => loadSimulationRequest())
const restoredCalculation = computed(() => loadSimulationResult())
const initialRequest = computed(() => {
  if (route.query.mode === 'recalculate' && recalculationRequest.value) {
    return recalculationRequest.value
  }
  return route.query.resume === '1' ? restoredRequest.value : null
})

async function loadBootstrapData() {
  try {
    const [clientsData, vehiclesData] = await Promise.all([
      clientService.getClients(),
      vehicleService.getVehicles()
    ])
    clients.value = clientsData
    vehicles.value = vehiclesData

    if (window.selectedVehicleId) {
      window.selectedVehicleId = null
    }
  } catch (err) {
    toastService.error(err.message)
  }
}

async function loadRecalculationRequest() {
  const operationId = route.query.operationId
  if (route.query.mode !== 'recalculate' || !operationId) {
    recalculationRequest.value = null
    return
  }

  try {
    const detail = await loanService.getOperationDetail(operationId)
    await ensureReferencedData(detail)
    const request = mapOperationDetailToSimulationRequest(detail)
    recalculationRequest.value = request
    saveSimulationRequest(request)
    clearSimulationResult()
  } catch (err) {
    recalculationRequest.value = null
    toastService.error(err.message)
  }
}

async function ensureReferencedData(detail) {
  if (detail?.clientId && !clients.value.some((client) => String(client.identifier) === String(detail.clientId))) {
    const client = await clientService.getClientById(detail.clientId)
    clients.value = [...clients.value, client]
  }

  if (detail?.vehicleId && !vehicles.value.some((vehicle) => String(vehicle.identifier) === String(detail.vehicleId))) {
    const vehicle = await vehicleService.getVehicleById(detail.vehicleId)
    vehicles.value = [...vehicles.value, vehicle]
  }
}

async function onCalculate(request) {
  calculating.value = true
  try {
    const calculation = await loanService.calculateQuote(request)
    saveSimulationRequest(request)
    saveSimulationResult(calculation)
    toastService.success('Cotización calculada correctamente.')
    router.push({ name: 'simulation-result' })
  } catch (err) {
    toastService.error(err.message)
  } finally {
    calculating.value = false
  }
}

function clearResult() {
  recalculationRequest.value = null
  clearSimulationSession()
  if (route.query.resume || route.query.mode === 'recalculate') {
    router.replace({ name: 'simulation' })
  }
}

async function bootstrap() {
  await loadBootstrapData()
  await loadRecalculationRequest()
}

watch(
  () => [route.query.mode, route.query.operationId],
  async () => {
    await loadRecalculationRequest()
  }
)

onMounted(bootstrap)
</script>
