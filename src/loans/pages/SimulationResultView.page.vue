<template>
  <CalculationResults
    v-if="calculation && request"
    :calculation="calculation"
    :request="request"
    :saving="saving"
    @back="goBackToForm"
    @save="onSave"
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
const saving = ref(false)

async function onSave() {
  if (!request.value || saving.value) {
    if (!request.value) {
      toastService.warning('No hay una solicitud de simulación disponible para guardar.')
    }
    return
  }

  saving.value = true

  try {
    const savedOperation = await loanService.saveOperation(request.value)
    toastService.success('La operación ya quedó guardada.')
    router.push({
      name: 'operation-detail',
      params: { id: savedOperation.identifier || savedOperation.operationId || savedOperation.id }
    })
  } catch (err) {
    toastService.error(err.message)
  } finally {
    saving.value = false
  }
}

function goBackToForm() {
  router.push({ name: 'simulation', query: { resume: '1' } })
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
