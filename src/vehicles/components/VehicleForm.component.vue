<template>
  <div class="register-page">
    <header class="register-header">
      <nav class="breadcrumb" aria-label="Breadcrumb">
        <button type="button" class="crumb-link" @click="$emit('cancel')">Vehículos</button>
        <span class="crumb-separator">›</span>
        <span class="crumb-current">{{ isEdit ? 'Edición' : 'Registro' }}</span>
      </nav>
      <h1>{{ isEdit ? 'Editar vehículo' : 'Registrar nuevo vehículo' }}</h1>
      <p>
        {{
          isEdit
            ? 'Actualiza las especificaciones del activo y su valorización para mantener el portafolio alineado con el mercado.'
            : 'Registra un nuevo activo en el portafolio con su perfil técnico y valorización comercial para simulaciones de crédito.'
        }}
      </p>
    </header>

    <form class="register-form" @submit.prevent="handleSubmit">
      <section class="form-section">
        <div class="section-title">
          <span class="section-icon">
            <svg viewBox="0 0 24 24" aria-hidden="true">
              <path d="M18.92 6.01C18.72 5.42 18.16 5 17.5 5h-11c-.66 0-1.21.42-1.42 1.01L3 12v8c0 .55.45 1 1 1h1c.55 0 1-.45 1-1v-1h12v1c0 .55.45 1 1 1h1c.55 0 1-.45 1-1v-8l-2.08-5.99zM5 11l1.5-4.5h11L19 11H5z" fill="currentColor" />
            </svg>
          </span>
          <h2>Identidad del activo</h2>
        </div>
        <div class="field-grid">
          <FieldHelp topic="vehicleBrand">
            <template #label>Marca</template>
            <input ref="firstFieldRef" v-model="form.brand" placeholder="Ej. Porsche" required />
          </FieldHelp>
          <FieldHelp topic="vehicleModel">
            <template #label>Modelo</template>
            <input v-model="form.model" placeholder="Ej. Taycan" required />
          </FieldHelp>
          <FieldHelp topic="vehicleYear">
            <template #label>Año</template>
            <input v-model.number="form.year" type="number" min="1990" max="2035" required />
          </FieldHelp>
          <FieldHelp topic="vehicleType">
            <template #label>Tipo de vehículo</template>
            <select v-model="form.vehicleType">
              <option value="SEDAN">Sedán deportivo</option>
              <option value="SUV">SUV</option>
              <option value="PICKUP">Pick-up</option>
              <option value="HATCHBACK">Hatchback</option>
              <option value="VAN">Van</option>
              <option value="OTHER">Otro</option>
            </select>
          </FieldHelp>
        </div>
      </section>

      <section class="form-section">
        <div class="section-title">
          <span class="section-icon">
            <svg viewBox="0 0 24 24" aria-hidden="true">
              <path d="M21 19V5a2 2 0 0 0-2-2H5a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2zM8.5 13.5l2.5 3.01L14.5 12l4.5 6H5l3.5-4.5z" fill="currentColor" />
            </svg>
          </span>
          <h2>Imagen y descripción</h2>
        </div>
        <div class="field-grid">
          <FieldHelp topic="vehicleDescription" class="full-width">
            <template #label>Descripción</template>
            <textarea v-model="form.description" placeholder="Notas técnicas, versión, condición..." />
          </FieldHelp>
          <FieldHelp topic="vehicleImageUrl" class="full-width">
            <template #label>URL de imagen</template>
            <input v-model="form.imageUrl" placeholder="https://..." />
          </FieldHelp>
        </div>
      </section>

      <section class="form-section">
        <div class="section-title">
          <span class="section-icon">
            <svg viewBox="0 0 24 24" aria-hidden="true">
              <path d="M3.5 18.5 9 13l3 3 7.5-7.5L22 12.5 12 22.5 3.5 18.5z" fill="currentColor" />
            </svg>
          </span>
          <h2>Valorización comercial</h2>
        </div>
        <div class="field-grid">
          <FieldHelp topic="vehicleCommercialPrice">
            <template #label>Precio comercial</template>
            <div class="money-input">
              <span>$</span>
              <input v-model.number="form.commercialPrice" type="number" min="0.01" step="0.01" placeholder="0.00" required />
            </div>
          </FieldHelp>
          <FieldHelp topic="vehicleCurrency">
            <template #label>Moneda</template>
            <select v-model="form.currency">
              <option value="USD">USD</option>
              <option value="PEN">PEN</option>
            </select>
          </FieldHelp>
        </div>
      </section>

      <footer class="form-actions">
        <button type="button" class="cancel-btn" @click="$emit('cancel')">Cancelar</button>
        <button type="submit" class="save-btn" :disabled="loading">
          <svg viewBox="0 0 24 24" aria-hidden="true">
            <path d="M17 3H5a2 2 0 0 0-2 2v14l4-4h10a2 2 0 0 0 2-2V5a2 2 0 0 0-2-2zm0 12H6.17L3 17.17V5h14v10z" fill="currentColor" />
          </svg>
          {{ loading ? 'Guardando...' : isEdit ? 'Actualizar vehículo' : 'Guardar vehículo' }}
        </button>
      </footer>

      <p v-if="error" class="error">{{ error }}</p>
    </form>
  </div>
</template>
<script setup>
import { reactive, ref, computed } from 'vue'
import FieldHelp from '../../shared/components/FieldHelp.component.vue'

const props = defineProps({
  loading: { type: Boolean, default: false },
  mode: { type: String, default: 'create' }
})

const emit = defineEmits(['saved', 'cancel'])

const isEdit = computed(() => props.mode === 'edit')

const emptyForm = () => ({
  brand: '',
  model: '',
  year: new Date().getFullYear(),
  vehicleType: 'SEDAN',
  commercialPrice: null,
  currency: 'USD',
  description: '',
  imageUrl: ''
})

const form = reactive(emptyForm())
const firstFieldRef = ref(null)
const error = ref('')

function resetForm() {
  Object.assign(form, emptyForm())
  error.value = ''
}

function loadForm(vehicle = {}) {
  Object.assign(form, {
    brand: vehicle.brand || '',
    model: vehicle.model || '',
    year: vehicle.year || new Date().getFullYear(),
    vehicleType: vehicle.vehicleType || 'SEDAN',
    commercialPrice: vehicle.commercialPrice ?? vehicle.price ?? null,
    currency: vehicle.currency || 'USD',
    description: vehicle.description || '',
    imageUrl: vehicle.imageUrl || ''
  })
  error.value = ''
}

function focusFirstField() {
  firstFieldRef.value?.focus?.()
}

function handleSubmit() {
  error.value = ''
  emit('saved', { ...form })
}

defineExpose({ resetForm, loadForm, focusFirstField })
</script>

<style scoped>
.register-page {
  display: grid;
  gap: 24px;
}

.register-header h1 {
  margin: 12px 0 0;
  font-size: 32px;
  color: #0b1f3a;
}

.register-header p {
  margin: 10px 0 0;
  max-width: 760px;
  color: #6f7d8f;
  font-size: 15px;
  line-height: 1.5;
}

.breadcrumb {
  display: flex;
  align-items: center;
  gap: 8px;
  font-size: 11px;
  font-weight: 800;
  letter-spacing: 0.08em;
  text-transform: uppercase;
}

.crumb-link {
  border: 0;
  background: transparent;
  color: #2563eb;
  cursor: pointer;
  padding: 0;
  font: inherit;
}

.crumb-separator,
.crumb-current {
  color: #8a96a3;
}

.register-form {
  display: grid;
  gap: 20px;
}

.form-section {
  background: #ffffff;
  border-radius: 14px;
  border: 1px solid #edf1f6;
  box-shadow: 0 8px 24px rgba(8, 38, 74, 0.06);
  padding: 24px;
}

.section-title {
  display: flex;
  align-items: center;
  gap: 12px;
  margin-bottom: 20px;
  padding-left: 12px;
  border-left: 4px solid #08264a;
}

.section-icon {
  width: 32px;
  height: 32px;
  border-radius: 8px;
  background: #eef2f6;
  color: #08264a;
  display: grid;
  place-items: center;
}

.section-icon svg {
  width: 18px;
  height: 18px;
}

.section-title h2 {
  margin: 0;
  font-size: 18px;
  color: #0b1f3a;
}

.field-grid {
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: 18px;
}

label {
  display: grid;
  gap: 8px;
  font-size: 11px;
  font-weight: 800;
  letter-spacing: 0.08em;
  text-transform: uppercase;
  color: #6f7d8f;
}

.full-width {
  grid-column: 1 / -1;
}

input,
select,
textarea {
  width: 100%;
  border: 1px solid transparent;
  background: #e8ecf1;
  border-radius: 10px;
  padding: 13px 14px;
  color: #1d2632;
  outline: none;
  font: inherit;
  text-transform: none;
  letter-spacing: normal;
  font-weight: 400;
}

input:focus,
select:focus,
textarea:focus {
  border-color: #9bbcff;
  background: #eef4ff;
}

textarea {
  min-height: 110px;
  resize: vertical;
}

.money-input {
  display: flex;
  align-items: center;
  background: #e8ecf1;
  border-radius: 10px;
  overflow: hidden;
}

.money-input span {
  padding: 0 12px;
  color: #6f7d8f;
  font-size: 16px;
  font-weight: 700;
}

.money-input input {
  border-radius: 0;
  background: transparent;
}

.form-actions {
  display: flex;
  justify-content: flex-end;
  gap: 12px;
  padding-top: 4px;
}

.cancel-btn,
.save-btn {
  border: 0;
  border-radius: 10px;
  padding: 12px 20px;
  font-weight: 700;
  cursor: pointer;
}

.cancel-btn {
  background: #e8ecf1;
  color: #26394e;
}

.save-btn {
  display: inline-flex;
  align-items: center;
  gap: 8px;
  background: #08264a;
  color: #ffffff;
}

.save-btn svg {
  width: 16px;
  height: 16px;
}

.save-btn:disabled {
  opacity: 0.7;
  cursor: not-allowed;
}

.error {
  color: #8f1521;
  background: #fef2f2;
  padding: 12px 14px;
  border-radius: 10px;
}

@media (max-width: 760px) {
  .field-grid {
    grid-template-columns: 1fr;
  }

  .form-actions {
    flex-direction: column-reverse;
  }

  .cancel-btn,
  .save-btn {
    width: 100%;
    justify-content: center;
  }
}
</style>
