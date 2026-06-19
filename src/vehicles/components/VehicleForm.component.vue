<template>
  <form class="card form-card" @submit.prevent="handleSubmit">
    <h2>Create Vehicle</h2>
    <div class="two-cols">
      <label>Brand
        <input name="brand" v-model="form.brand" required />
      </label>
      <label>Model
        <input name="model" v-model="form.model" required />
      </label>
      <label>Year
        <input name="year" type="number" min="1990" max="2035" v-model.number="form.year" required />
      </label>
      <label>Vehicle Type
        <select name="vehicleType" v-model="form.vehicleType">
          <option value="SEDAN">SEDAN</option>
          <option value="SUV">SUV</option>
          <option value="PICKUP">PICKUP</option>
          <option value="HATCHBACK">HATCHBACK</option>
          <option value="VAN">VAN</option>
          <option value="OTHER">OTHER</option>
        </select>
      </label>
      <label>Commercial Price
        <input name="commercialPrice" type="number" min="0" step="0.01" v-model.number="form.commercialPrice" required />
      </label>
      <label>Currency
        <select name="currency" v-model="form.currency">
          <option>USD</option>
          <option>PEN</option>
        </select>
      </label>
    </div>
    <label>Description
      <textarea name="description" v-model="form.description"></textarea>
    </label>
    <label>Image URL
      <input name="imageUrl" v-model="form.imageUrl" />
    </label>
    <button class="primary" type="submit" :disabled="loading">
      {{ loading ? 'Saving...' : 'Save Vehicle' }}
    </button>
    <p v-if="error" class="error">{{ error }}</p>
  </form>
</template>

<script setup>
import { reactive, ref } from 'vue'

const emit = defineEmits(['saved'])

const form = reactive({
  brand: 'Toyota',
  model: 'Corolla',
  year: 2025,
  vehicleType: 'SEDAN',
  commercialPrice: 15000,
  currency: 'USD',
  description: 'Created from Vue frontend',
  imageUrl: ''
})

const loading = ref(false)
const error = ref('')

async function handleSubmit() {
  loading.value = true
  error.value = ''
  try {
    emit('saved', { ...form })
  } catch (err) {
    error.value = err.message
  } finally {
    loading.value = false
  }
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
.form-card {
  display: grid;
  gap: 18px;
}
.two-cols {
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: 18px;
}
label {
  display: grid;
  gap: 8px;
  font-size: 12px;
  text-transform: uppercase;
  color: #3f4957;
  font-weight: 800;
  letter-spacing: 0.08em;
}
input, select, textarea {
  width: 100%;
  border: 1px solid transparent;
  background: #dfe4e9;
  border-radius: 8px;
  padding: 12px 14px;
  color: #1d2632;
  outline: none;
  font: inherit;
}
input:focus, select:focus, textarea:focus {
  border-color: #9bbcff;
  background: #eef4ff;
}
textarea {
  min-height: 96px;
  resize: vertical;
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
.primary:disabled {
  opacity: 0.6;
  cursor: not-allowed;
}
.error {
  color: #8f1521;
  background: #f9d9dc;
  padding: 12px;
  border-radius: 8px;
}
@media (max-width: 760px) {
  .two-cols {
    grid-template-columns: 1fr;
  }
}
</style>