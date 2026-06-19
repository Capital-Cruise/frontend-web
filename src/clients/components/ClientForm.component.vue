<template>
  <form class="card form-card" @submit.prevent="handleSubmit">
    <h2>Create Client</h2>
    <div class="two-cols">
      <label>First Name
        <input name="firstName" v-model="form.firstName" required />
      </label>
      <label>Last Name
        <input name="lastName" v-model="form.lastName" required />
      </label>
      <label>Document Type
        <select name="documentType" v-model="form.documentType">
          <option value="DNI">DNI</option>
          <option value="PASSPORT">PASSPORT</option>
          <option value="CE">CE</option>
          <option value="RUC">RUC</option>
        </select>
      </label>
      <label>Document Number
        <input name="documentNumber" v-model="form.documentNumber" required />
      </label>
      <label>Email
        <input name="email" type="email" v-model="form.email" />
      </label>
      <label>Phone
        <input name="phone" v-model="form.phone" />
      </label>
      <label>Monthly Income
        <input name="monthlyIncome" type="number" min="0" step="0.01" v-model.number="form.monthlyIncome" />
      </label>
    </div>
    <label>Address
      <input name="address" v-model="form.address" />
    </label>
    <label>Notes
      <textarea name="notes" v-model="form.notes"></textarea>
    </label>
    <button class="primary" type="submit" :disabled="loading">
      {{ loading ? 'Saving...' : 'Save Client' }}
    </button>
    <p v-if="error" class="error">{{ error }}</p>
  </form>
</template>

<script setup>
import { reactive, ref } from 'vue'

const emit = defineEmits(['saved'])

const form = reactive({
  firstName: 'Demo',
  lastName: 'Client',
  documentType: 'DNI',
  documentNumber: '90000999',
  email: 'demo.client@capitalcruise.local',
  phone: '999009999',
  monthlyIncome: 6000,
  address: 'Lima, Perú',
  notes: 'Created from Vue frontend'
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