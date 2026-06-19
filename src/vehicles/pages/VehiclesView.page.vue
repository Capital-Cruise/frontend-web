<template>
  <div class="split">
    <VehicleList :vehicles="vehicles" @load="loadVehicles" @select="onVehicleSelect" />
    <VehicleForm @saved="onVehicleSaved" />
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import VehicleList from '../components/VehicleList.component.vue'
import VehicleForm from '../components/VehicleForm.component.vue'
import { vehicleService } from '../services/vehicle.service.js'

const router = useRouter()
const vehicles = ref([])

async function loadVehicles() {
  try {
    vehicles.value = await vehicleService.getVehicles()
  } catch (err) {
    alert(err.message)
  }
}

async function onVehicleSaved(vehicleData) {
  try {
    await vehicleService.createVehicle(vehicleData)
    await loadVehicles()
    alert('Vehicle saved')
  } catch (err) {
    alert(err.message)
  }
}

function onVehicleSelect(vehicleId) {
  router.push('/simulation')
  // The simulation view will handle selecting the vehicle
  // We use a global event or store to communicate this
  window.selectedVehicleId = vehicleId
}

onMounted(loadVehicles)
</script>

<style scoped>
.split {
  display: grid;
  grid-template-columns: minmax(0, 1.3fr) minmax(360px, 0.7fr);
  gap: 24px;
  align-items: start;
}
@media (max-width: 1180px) {
  .split {
    grid-template-columns: 1fr;
  }
}
</style>