<template>
  <div class="register-page">
    <header class="register-header">
      <nav class="breadcrumb" aria-label="Breadcrumb">
        <button type="button" class="crumb-link" @click="$emit('cancel')">Clientes</button>
        <span class="crumb-separator">›</span>
        <span class="crumb-current">{{ isEdit ? 'Edición' : 'Registro' }}</span>
      </nav>
      <h1>{{ isEdit ? 'Editar cliente' : 'Registrar nuevo cliente' }}</h1>
      <p>
        {{
          isEdit
            ? 'Actualiza el perfil del cliente y mantén el registro financiero alineado con la información más reciente.'
            : 'Inicia la simulación de crédito proporcionando el perfil financiero del cliente.'
        }}
      </p>
    </header>

    <form class="register-form" @submit.prevent="handleSubmit">
      <section class="form-section">
        <div class="section-title">
          <span class="section-icon">
            <svg viewBox="0 0 24 24" aria-hidden="true">
              <path
                d="M12 12c2.7 0 4.8-2.1 4.8-4.8S14.7 2.4 12 2.4 7.2 4.5 7.2 7.2 9.3 12 12 12zm0 2.4c-3.2 0-9.6 1.62-9.6 4.8V22h19.2v-2.8c0-3.18-6.4-4.8-9.6-4.8z"
                fill="currentColor"
              />
            </svg>
          </span>
          <h2>Identidad personal</h2>
        </div>
        <div class="field-grid">
          <label>
            Nombres
            <input ref="firstFieldRef" v-model="form.firstName" placeholder="Ej. Jonathan" required />
          </label>
          <label>
            Apellidos
            <input v-model="form.lastName" placeholder="Ej. Wick" required />
          </label>
          <label>
            Tipo de documento
            <select v-model="form.documentType">
              <option value="DNI">DNI</option>
              <option value="PASSPORT">Pasaporte</option>
              <option value="CE">Carné de extranjería</option>
              <option value="RUC">RUC</option>
            </select>
          </label>
          <label>
            Número de documento
            <input v-model="form.documentNumber" placeholder="XX-XXXX-XXXXX" required />
          </label>
        </div>
      </section>

      <section class="form-section">
        <div class="section-title">
          <span class="section-icon">
            <svg viewBox="0 0 24 24" aria-hidden="true">
              <path
                d="M20 4H4a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2V6a2 2 0 0 0-2-2zm0 4-8 5L4 8V6l8 5 8-5v2z"
                fill="currentColor"
              />
            </svg>
          </span>
          <h2>Contacto y dirección</h2>
        </div>
        <div class="field-grid">
          <label>
            Correo electrónico
            <input v-model="form.email" type="email" placeholder="cliente@capitalcruise.com" />
          </label>
          <label>
            Teléfono
            <input v-model="form.phone" placeholder="+51 999 999 999" />
          </label>
          <label class="full-width">
            Dirección
            <input v-model="form.address" placeholder="Calle, número, distrito, ciudad" />
          </label>
        </div>
      </section>

      <section class="form-section">
        <div class="section-title">
          <span class="section-icon">
            <svg viewBox="0 0 24 24" aria-hidden="true">
              <path
                d="M3.5 18.5 9 13l3 3 7.5-7.5L22 12.5 12 22.5 3.5 18.5z"
                fill="currentColor"
              />
            </svg>
          </span>
          <h2>Marco financiero</h2>
        </div>
        <div class="field-grid">
          <label>
            Ingreso mensual
            <div class="money-input">
              <span>S/</span>
              <input
                v-model.number="form.monthlyIncome"
                type="number"
                min="0"
                step="0.01"
                placeholder="0.00"
              />
            </div>
            <small>
              Este dato es clave para determinar la relación cuota-ingreso y el límite final del
              perfil crediticio.
            </small>
          </label>
          <label class="full-width">
            Observaciones
            <textarea v-model="form.notes" placeholder="Anotaciones confidenciales del asesor..." />
          </label>
        </div>
      </section>

      <footer class="form-actions">
        <button type="button" class="cancel-btn" @click="$emit('cancel')">Cancelar</button>
        <button type="submit" class="save-btn" :disabled="loading">
          <svg viewBox="0 0 24 24" aria-hidden="true">
            <path
              d="M17 3H5a2 2 0 0 0-2 2v14l4-4h10a2 2 0 0 0 2-2V5a2 2 0 0 0-2-2zm0 12H6.17L3 17.17V5h14v10z"
              fill="currentColor"
            />
          </svg>
          {{ loading ? 'Guardando...' : isEdit ? 'Actualizar cliente' : 'Guardar cliente' }}
        </button>
      </footer>

      <p v-if="error" class="error">{{ error }}</p>
    </form>
  </div>
</template>

<script setup>
import { reactive, ref, computed } from 'vue'

const props = defineProps({
  loading: { type: Boolean, default: false },
  mode: { type: String, default: 'create' }
})

const emit = defineEmits(['saved', 'cancel'])

const isEdit = computed(() => props.mode === 'edit')

const emptyForm = () => ({
  firstName: '',
  lastName: '',
  documentType: 'DNI',
  documentNumber: '',
  email: '',
  phone: '',
  monthlyIncome: null,
  address: '',
  notes: ''
})

const form = reactive(emptyForm())
const firstFieldRef = ref(null)
const error = ref('')

function resetForm() {
  Object.assign(form, emptyForm())
  error.value = ''
}

function loadForm(client = {}) {
  Object.assign(form, {
    firstName: client.firstName || '',
    lastName: client.lastName || '',
    documentType: client.documentType || 'DNI',
    documentNumber: client.documentNumber || '',
    email: client.email || '',
    phone: client.phone || '',
    monthlyIncome: client.monthlyIncome ?? 0,
    address: client.address || '',
    notes: client.notes || ''
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

label small {
  text-transform: none;
  letter-spacing: normal;
  font-weight: 500;
  color: #8a96a3;
  line-height: 1.45;
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
