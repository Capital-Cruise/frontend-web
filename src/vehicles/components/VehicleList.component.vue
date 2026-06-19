<template>
  <div class="card">
    <div class="section-head">
      <h2>Vehicles</h2>
      <button class="secondary" @click="$emit('load')">Load Vehicles</button>
    </div>
    <div v-if="vehicles.length === 0" class="vehicle-grid">
      <p>No vehicles loaded.</p>
    </div>
    <div v-else class="vehicle-grid">
      <div v-for="vehicle in vehicles" :key="vehicle.identifier" class="vehicle-card">
        <strong>{{ vehicle.displayName }}</strong>
        <div class="meta">ID: {{ vehicle.identifier }} · {{ vehicle.vehicleType }}</div>
        <div class="meta">Market value: {{ formatMoney(vehicle.price, vehicle.currency) }}</div>
        <button class="secondary" @click="$emit('select', vehicle.identifier)">
          Use in Simulation
        </button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { defineProps, defineEmits } from 'vue'

defineProps({
  vehicles: {
    type: Array,
    default: () => []
  }
})

defineEmits(['load', 'select'])

function formatMoney(value, currency = 'USD') {
  const n = Number(value ?? 0)
  return `${currency} ${n.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`
}
</script>

<style scoped>
.card {
  background: #ffffff;
  border-radius: 12px;
  padding: 24px;
  box-shadow: 0 12px 30px rgba(8, 38, 74, 0.08);
  border: 1px solid #edf1f6;
}
.section-head {
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 16px;
  margin-bottom: 16px;
}
.section-head h2 {
  font-size: 20px;
  margin: 0;
}
.secondary {
  background: #e2e7ed;
  color: #26394e;
  border: 0;
  border-radius: 8px;
  padding: 12px 18px;
  font-weight: 700;
  letter-spacing: 0.03em;
  cursor: pointer;
}
.vehicle-grid {
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: 18px;
}
.vehicle-card {
  border: 1px solid #e3e8ef;
  border-radius: 10px;
  padding: 16px;
  background: #fff;
  min-height: 140px;
}
.vehicle-card strong {
  display: block;
  font-size: 18px;
  margin-bottom: 4px;
}
.meta {
  color: #6f7d8f;
  font-size: 13px;
}
@media (max-width: 760px) {
  .vehicle-grid {
    grid-template-columns: 1fr;
  }
}
</style>