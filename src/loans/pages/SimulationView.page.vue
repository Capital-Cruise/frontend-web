<template>
  <SimulationForm
      :clients="clients"
      :vehicles="vehicles"
      @calculate="onCalculate"
  />
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import SimulationForm from '../components/SimulationForm.component.vue'
import { clientService } from '../../clients/services/client.service.js'
import { vehicleService } from '../../vehicles/services/vehicle.service.js'
import { toastService } from '../../shared/services/toast.service.js'

const router = useRouter()
const clients = ref([])
const vehicles = ref([])

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
      // The SimulationForm will handle this via a prop or event
      const selectedId = window.selectedVehicleId
      window.selectedVehicleId = null
      // We'll pass this to the form via a ref
      setTimeout(() => {
        // The form will check this on mount
      }, 100)
    }
  } catch (err) {
    toastService.error(err.message)
  }
}

function onCalculate(result) {
  router.push({ path: '/simulation', query: { result: JSON.stringify(result) } })
}

onMounted(loadBootstrapData)
</script>