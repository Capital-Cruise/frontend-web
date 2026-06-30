<template>
  <div class="simulation-page">
    <SimulationForm
        :clients="clients"
        :vehicles="vehicles"
        :calculation="calculation"
        :last-request="lastRequest"
        :calculating="calculating"
        :saving="saving"
        :saved-operation="savedOperation"
        @calculate="onCalculate"
        @save="onSave"
        @clear-result="clearResult"
    />

    <CalculationResults
        v-if="calculation"
        :calculation="calculation"
        :request="lastRequest"
        :raw-data="calculation"
        @recalculate="scrollToForm"
        @save="onSave"
        @share="goToSavedOperation"
    />
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import SimulationForm from '../components/SimulationForm.component.vue'
import CalculationResults from '../components/CalculationResults.component.vue'
import { clientService } from '../../clients/services/client.service.js'
import { vehicleService } from '../../vehicles/services/vehicle.service.js'
import { loanService } from '../services/loan.service.js'
import { toastService } from '../../shared/services/toast.service.js'

const clients = ref([])
const vehicles = ref([])
const router = useRouter()
const calculation = ref(null)
const lastRequest = ref(null)
const savedOperation = ref(null)
const calculating = ref(false)
const saving = ref(false)

async function loadBootstrapData() {
  try {
    const [clientsData, vehiclesData] = await Promise.all([
      clientService.getClients(),
      vehicleService.getVehicles()
    ])
    clients.value = clientsData
    vehicles.value = vehiclesData

    // Check if a vehicle was selected from the Vehicles page
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
    lastRequest.value = request
    calculation.value = await loanService.calculateQuote(request)
    toastService.success('Quote calculated successfully')
  } catch (err) {
    toastService.error(err.message)
  } finally {
    calculating.value = false
  }
}

async function onSave() {
  if (!lastRequest.value) {
    toastService.warning('Calculate a quote before saving')
    return
  }
  saving.value = true
  try {
    savedOperation.value = await loanService.saveOperation(lastRequest.value)
    toastService.success('Operation saved successfully')
  } catch (err) {
    toastService.error(err.message)
  } finally {
    saving.value = false
  }
}

function clearResult() {
  calculation.value = null
  lastRequest.value = null
  savedOperation.value = null
}

function scrollToForm() {
  window.scrollTo({ top: 0, behavior: 'smooth' })
}

function goToSavedOperation() {
  if (savedOperation.value?.identifier) {
    router.push(`/operation/${savedOperation.value.identifier}`)
  } else {
    toastService.warning('Save the operation before sharing')
  }
}

onMounted(loadBootstrapData)
</script>

<style scoped>
.simulation-page {
  display: grid;
  gap: 24px;
}
</style>
