<template>
  <div class="card">
    <div class="section-head">
      <h2>Client Directory</h2>
      <button class="secondary" @click="$emit('load')">Load Clients</button>
    </div>
    <div v-if="clients.length === 0" class="list">
      <p>No clients loaded.</p>
    </div>
    <div v-else class="list">
      <div v-for="client in clients" :key="client.identifier" class="list-item">
        <strong>{{ client.displayName }}</strong>
        <div class="meta">ID: {{ client.identifier }} · {{ client.documentType }} {{ client.documentNumber }}</div>
        <div class="meta">{{ client.email }} · Income: {{ formatMoney(client.monthlyIncome) }}</div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { defineProps, defineEmits } from 'vue'

defineProps({
  clients: {
    type: Array,
    default: () => []
  }
})

defineEmits(['load'])

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
  margin-bottom: 22px;
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
.list {
  display: grid;
  gap: 10px;
}
.list-item {
  border: 1px solid #e3e8ef;
  border-radius: 10px;
  padding: 16px;
  background: #fff;
}
.list-item strong {
  display: block;
  font-size: 18px;
  margin-bottom: 4px;
}
.meta {
  color: #6f7d8f;
  font-size: 13px;
}
</style>