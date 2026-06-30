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
    toastService.warning('No simulation request available to save')
    return
  }

  try {
    savedOperation.value = await loanService.saveOperation(request.value)
    toastService.success('Operation saved successfully')
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
    toastService.warning('Save the operation before sharing')
  }
}

function restoreSimulationData() {
  request.value = loadSimulationRequest()
  calculation.value = loadSimulationResult()

  if (!request.value || !calculation.value) {
    toastService.warning('No simulation result found. Complete the form to calculate a new quote.')
    router.replace({ name: 'simulation' })
  }
}

onMounted(restoreSimulationData)
</script>
