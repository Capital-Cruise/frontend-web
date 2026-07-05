<template>
  <CalculationResults
    v-if="calculation && request"
    :calculation="calculation"
    :request="request"
    @back="goBackToForm"
    @save="onSave"
    @share="goToSavedOperation"
  />
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import CalculationResults from '../components/CalculationResults.component.vue'
import { loanService } from '../services/loan.service.js'
import { toastService } from '../../shared/services/toast.service.js'
import {
  loadSimulationRequest,
  loadSimulationResult
} from '../utils/simulation-session.util.js'

const router = useRouter()
const calculation = ref(null)
const request = ref(null)
const savedOperation = ref(null)

async function onSave() {
  if (!request.value) {
    toastService.warning('No hay una solicitud de simulación disponible para guardar.')
    return
  }

  try {
    savedOperation.value = await loanService.saveOperation(request.value)
    toastService.success('Operación guardada correctamente.')
  } catch (err) {
    toastService.error(err.message)
  }
}

function goBackToForm() {
  router.push({ name: 'simulation', query: { resume: '1' } })
}

function goToSavedOperation() {
  if (savedOperation.value?.identifier) {
    router.push(`/operation/${savedOperation.value.identifier}`)
  } else {
    toastService.warning('Guarda la operación antes de compartirla.')
  }
}

function restoreSimulationData() {
  request.value = loadSimulationRequest()
  calculation.value = loadSimulationResult()

  if (!request.value || !calculation.value) {
    toastService.warning('No se encontró un resultado de simulación. Completa el formulario para generar una nueva cotización.')
    router.replace({ name: 'simulation' })
  }
}

onMounted(restoreSimulationData)
</script>
