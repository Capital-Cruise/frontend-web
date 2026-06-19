<template>
  <div class="card">
    <div class="section-head">
      <div>
        <h2>Operation History</h2>
        <p>Review saved financial simulations.</p>
      </div>
      <button class="secondary" @click="loadOperations">Load Operations</button>
    </div>
    <div class="filters">
      <input v-model="filters.client" placeholder="Filter by client name..." />
      <select v-model="filters.currency">
        <option value="">All Currencies</option>
        <option>USD</option>
        <option>PEN</option>
      </select>
      <select v-model="filters.status">
        <option value="">Any Status</option>
        <option>SAVED</option>
        <option>CALCULATED</option>
        <option>DRAFT</option>
      </select>
      <button class="secondary" @click="applyFilters">Apply Filters</button>
    </div>
    <div v-if="operations.length === 0" class="operation-grid">
      <p>No operations loaded.</p>
    </div>
    <div v-else class="operation-grid">
      <div v-for="op in filteredOperations" :key="op.identifier" class="operation-card">
        <span class="meta">Asset Profile</span>
        <strong>{{ op.title }}</strong>
        <span class="meta">Primary Client</span>
        <strong>{{ op.displayClient }}</strong>
        <div class="meta">ID: {{ op.identifier }} · Status: {{ op.status }} · Currency: {{ op.currency }}</div>
        <div class="button-row">
          <button class="secondary" @click="$emit('view-detail', op.identifier)">Open</button>
          <button class="primary" @click="$emit('share', op.identifier)">Share</button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'

const props = defineProps({
  operations: { type: Array, default: () => [] }
})

const emit = defineEmits(['load', 'view-detail', 'share', 'apply-filters'])

const filters = ref({
  client: '',
  currency: '',
  status: ''
})

const filteredOperations = computed(() => {
  let ops = props.operations
  const clientFilter = filters.value.client.trim().toLowerCase()
  if (clientFilter) {
    ops = ops.filter(o => JSON.stringify(o).toLowerCase().includes(clientFilter))
  }
  return ops
})

function loadOperations() {
  emit('load')
}

function applyFilters() {
  emit('apply-filters', filters.value)
}

onMounted(() => {
  emit('load')
})
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
.section-head p {
  margin: 4px 0 0;
  color: #4a5568;
}
.filters {
  display: grid;
  grid-template-columns: 1fr 180px 180px 180px;
  gap: 12px;
  margin-bottom: 22px;
}
input, select {
  width: 100%;
  border: 1px solid transparent;
  background: #dfe4e9;
  border-radius: 8px;
  padding: 12px 14px;
  color: #1d2632;
  outline: none;
  font: inherit;
}
input:focus, select:focus {
  border-color: #9bbcff;
  background: #eef4ff;
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
.primary {
  background: #08264a;
  color: white;
  border: 0;
  border-radius: 8px;
  padding: 12px 18px;
  font-weight: 700;
  letter-spacing: 0.03em;
  cursor: pointer;
}
.operation-grid {
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: 18px;
}
.operation-card {
  border: 1px solid #e3e8ef;
  border-radius: 10px;
  padding: 16px;
  background: #fff;
}
.operation-card strong {
  display: block;
  font-size: 18px;
  margin-bottom: 4px;
}
.meta {
  color: #6f7d8f;
  font-size: 13px;
}
.button-row {
  display: flex;
  gap: 12px;
  flex-wrap: wrap;
  align-items: center;
  margin-top: 12px;
}
@media (max-width: 760px) {
  .filters {
    grid-template-columns: 1fr;
  }
  .operation-grid {
    grid-template-columns: 1fr;
  }
}
</style>