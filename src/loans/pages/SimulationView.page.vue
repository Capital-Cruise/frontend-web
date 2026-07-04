<template>
  <SimulationForm
    :clients="clients"
    :vehicles="vehicles"
    :calculation="restoredCalculation"
    :last-request="restoredRequest"
    :calculating="calculating"
    :saving="saving"
    :saved-operation="savedOperation"
    :initial-request="resumeRequest"
    @calculate="onCalculate"
    @save="onSave"
    @clear-result="clearResult"
  />
</template>

<script setup>
import { computed, ref, onMounted } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import SimulationForm from '../components/SimulationForm.component.vue'
import { clientService } from '../../clients/services/client.service.js'
import { vehicleService } from '../../vehicles/services/vehicle.service.js'
import { loanService } from '../services/loan.service.js'
import { toastService } from '../../shared/services/toast.service.js'
import {
  clearSimulationSession,
  loadSimulationRequest,
  loadSimulationResult,
  saveSimulationRequest,
  saveSimulationResult
} from '../utils/simulation-session.util.js'

const clients = ref([])
const vehicles = ref([])
const router = useRouter()
const route = useRoute()
const savedOperation = ref(null)
const calculating = ref(false)
const saving = ref(false)

const restoredRequest = computed(() => loadSimulationRequest())
const restoredCalculation = computed(() => loadSimulationResult())
const resumeRequest = computed(() => route.query.resume === '1' ? restoredRequest.value : null)

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

async function onCalculate(request) {
  calculating.value = true
  savedOperation.value = null
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

async function onSave() {
  const request = loadSimulationRequest()
  if (!request) {
    toastService.warning('Calcula una cotización antes de guardar.')
    return
  }
  saving.value = true
  try {
    savedOperation.value = await loanService.saveOperation(request)
    toastService.success('Operación guardada correctamente.')
  } catch (err) {
    toastService.error(err.message)
  } finally {
    saving.value = false
  }
}

function clearResult() {
  savedOperation.value = null
  clearSimulationSession()
  if (route.query.resume) {
    router.replace({ name: 'simulation' })
  }
}

onMounted(loadBootstrapData)
</script>
