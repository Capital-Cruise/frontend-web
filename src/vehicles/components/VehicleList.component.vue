<template>
  <div class="vehicles-page">
    <header class="page-header">
      <div>
        <h1>Vehículos</h1>
        <p>
          Gestiona y analiza el inventario vehicular para Capital Cruise. Revisa especificaciones
          técnicas y datos de valorización para operaciones simuladas de crédito.
        </p>
      </div>
      <button class="add-btn" type="button" @click="$emit('add')">
        <svg viewBox="0 0 24 24" aria-hidden="true">
          <path d="M19 13h-6v6h-2v-6H5v-2h6V5h2v6h6v2z" fill="currentColor" />
        </svg>
        Nuevo vehículo
      </button>
    </header>

    <section class="filters-card">
      <label class="filter-field search-field">
        <span>Buscar en la base</span>
        <div class="search-input">
          <svg viewBox="0 0 24 24" aria-hidden="true">
            <path
              d="M15.5 14h-.79l-.28-.27A6.47 6.47 0 0 0 16 9.5 6.5 6.5 0 1 0 9.5 16c1.61 0 3.09-.59 4.23-1.57l.27.28v.79l5 4.99L20.49 19l-4.99-5zm-6 0C7.01 14 5 11.99 5 9.5S7.01 5 9.5 5 14 7.01 14 9.5 11.99 14 9.5 14z"
              fill="currentColor"
            />
          </svg>
          <input
            :value="filters.search"
            type="search"
            placeholder="Buscar por marca, modelo o VIN..."
            @input="$emit('filter-change', { ...filters, search: $event.target.value })"
          />
        </div>
      </label>
      <label class="filter-field">
        <span>Marca</span>
        <select
          :value="filters.brand"
          @change="$emit('filter-change', { ...filters, brand: $event.target.value })"
        >
          <option value="">Todas las marcas</option>
          <option v-for="brand in brands" :key="brand" :value="brand">{{ brand }}</option>
        </select>
      </label>
      <label class="filter-field">
        <span>Año</span>
        <select
          :value="filters.year"
          @change="$emit('filter-change', { ...filters, year: $event.target.value })"
        >
          <option value="">Todos</option>
          <option v-for="year in years" :key="year" :value="year">{{ year }}</option>
        </select>
      </label>
      <button type="button" class="filters-btn" @click="$emit('reset-filters')">
        <svg viewBox="0 0 24 24" aria-hidden="true">
          <path
            d="M10 18h4v-2h-4v2zM3 6v2h18V6H3zm3 7h12v-2H6v2z"
            fill="currentColor"
          />
        </svg>
        Más filtros
      </button>
    </section>

    <div v-if="loading" class="grid-state">Cargando vehículos...</div>
    <div v-else-if="vehicles.length === 0" class="grid-state">
      No se encontraron vehículos. Ajusta los filtros o agrega un nuevo vehículo.
    </div>
    <section v-else class="vehicle-grid">
      <article v-for="vehicle in vehicles" :key="vehicle.identifier" class="vehicle-card">
        <div class="vehicle-image-wrap">
          <img
            :src="imageFor(vehicle)"
            :alt="vehicle.cardTitle"
            class="vehicle-image"
            loading="lazy"
            @error="onImageError(vehicle)"
          />
          <button
            type="button"
            class="edit-btn"
            aria-label="Editar vehículo"
            @click="$emit('edit', vehicle)"
          >
            <svg viewBox="0 0 24 24" aria-hidden="true">
              <path
                d="M3 17.25V21h3.75L17.81 9.94l-3.75-3.75L3 17.25zM20.71 7.04a1 1 0 0 0 0-1.41l-2.34-2.34a1 1 0 0 0-1.41 0l-1.83 1.83 3.75 3.75 1.83-1.83z"
                fill="currentColor"
              />
            </svg>
          </button>
        </div>
        <div class="vehicle-meta">
          <div>
            <strong>{{ vehicle.cardTitle }}</strong>
            <span>{{ vehicle.subtitle }}</span>
          </div>
          <div class="price-block">
            <span class="price-label">Valor comercial</span>
            <strong>{{ formatMoney(vehicle.price, vehicle.currency) }}</strong>
          </div>
        </div>
      </article>
    </section>

    <footer v-if="totalElements > 0" class="grid-footer">
      <span>Mostrando {{ rangeStart }} a {{ rangeEnd }} de {{ totalElements }} vehículos</span>
      <div class="pagination">
        <button
          type="button"
          class="page-btn"
          :disabled="page === 0"
          aria-label="Página anterior"
          @click="$emit('page-change', page - 1)"
        >
          ‹
        </button>
        <button
          v-for="pageNumber in visiblePages"
          :key="pageNumber"
          type="button"
          class="page-btn"
          :class="{ active: pageNumber === page + 1 }"
          @click="$emit('page-change', pageNumber - 1)"
        >
          {{ pageNumber }}
        </button>
        <button
          type="button"
          class="page-btn"
          :disabled="page >= totalPages - 1"
          aria-label="Página siguiente"
          @click="$emit('page-change', page + 1)"
        >
          ›
        </button>
      </div>
    </footer>
  </div>
</template>

<script setup>
import { computed, ref } from 'vue'
import { fallbackVehicleImage, resolveVehicleImage } from '../utils/vehicle-image.util.js'

const props = defineProps({
  vehicles: { type: Array, default: () => [] },
  brands: { type: Array, default: () => [] },
  years: { type: Array, default: () => [] },
  filters: {
    type: Object,
    default: () => ({ search: '', brand: '', year: '' })
  },
  loading: { type: Boolean, default: false },
  page: { type: Number, default: 0 },
  size: { type: Number, default: 12 },
  totalElements: { type: Number, default: 0 },
  totalPages: { type: Number, default: 1 }
})

defineEmits(['add', 'edit', 'filter-change', 'reset-filters', 'page-change'])

const brokenImages = ref({})

const rangeStart = computed(() => (props.totalElements === 0 ? 0 : props.page * props.size + 1))
const rangeEnd = computed(() => Math.min((props.page + 1) * props.size, props.totalElements))

const visiblePages = computed(() => {
  const pages = []
  const maxVisible = 5
  let start = Math.max(1, props.page + 1 - 2)
  let end = Math.min(props.totalPages, start + maxVisible - 1)

  if (end - start < maxVisible - 1) {
    start = Math.max(1, end - maxVisible + 1)
  }

  for (let i = start; i <= end; i += 1) {
    pages.push(i)
  }

  return pages
})

function imageFor(vehicle) {
  if (brokenImages.value[vehicle.identifier]) {
    return fallbackVehicleImage(vehicle.vehicleType)
  }
  return resolveVehicleImage(vehicle)
}

function onImageError(vehicle) {
  brokenImages.value = {
    ...brokenImages.value,
    [vehicle.identifier]: true
  }
}

function formatMoney(value, currency = 'USD') {
  const amount = Number(value ?? 0)
  return `${currency} ${amount.toLocaleString('es-PE', {
    minimumFractionDigits: 0,
    maximumFractionDigits: 0
  })}`
}
</script>

<style scoped>
.vehicles-page {
  display: grid;
  gap: 24px;
}

.page-header {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  gap: 20px;
}

.page-header h1 {
  margin: 0;
  font-size: 32px;
  color: #0b1f3a;
}

.page-header p {
  margin: 10px 0 0;
  max-width: 760px;
  color: #6f7d8f;
  font-size: 15px;
  line-height: 1.5;
}

.add-btn {
  display: inline-flex;
  align-items: center;
  gap: 8px;
  border: 0;
  border-radius: 10px;
  padding: 12px 18px;
  background: #08264a;
  color: #ffffff;
  font-weight: 700;
  cursor: pointer;
  white-space: nowrap;
}

.add-btn svg {
  width: 18px;
  height: 18px;
}

.filters-card {
  display: grid;
  grid-template-columns: minmax(240px, 1.4fr) 180px 120px auto;
  gap: 16px;
  align-items: end;
  background: #ffffff;
  border: 1px solid #edf1f6;
  border-radius: 14px;
  padding: 18px;
  box-shadow: 0 8px 24px rgba(8, 38, 74, 0.06);
}

.filter-field {
  display: grid;
  gap: 8px;
}

.filter-field span {
  font-size: 11px;
  font-weight: 800;
  letter-spacing: 0.08em;
  text-transform: uppercase;
  color: #6f7d8f;
}

.search-input {
  display: flex;
  align-items: center;
  gap: 10px;
  background: #e8ecf1;
  border-radius: 10px;
  padding: 0 12px;
}

.search-input svg {
  width: 18px;
  height: 18px;
  color: #8a96a3;
  flex-shrink: 0;
}

.search-input input,
.filter-field select {
  width: 100%;
  border: 0;
  background: transparent;
  padding: 12px 0;
  color: #1d2632;
  outline: none;
  font: inherit;
}

.filter-field select {
  background: #e8ecf1;
  border-radius: 10px;
  padding: 12px 14px;
}

.filters-btn {
  display: inline-flex;
  align-items: center;
  gap: 8px;
  border: 0;
  border-radius: 10px;
  padding: 12px 16px;
  background: #e8ecf1;
  color: #26394e;
  font-weight: 700;
  cursor: pointer;
  height: 44px;
}

.filters-btn svg {
  width: 18px;
  height: 18px;
}

.grid-state {
  padding: 48px 24px;
  text-align: center;
  color: #6f7d8f;
}

.vehicle-grid {
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: 20px;
}

.vehicle-card {
  background: #ffffff;
  border: 1px solid #edf1f6;
  border-radius: 14px;
  overflow: hidden;
  box-shadow: 0 8px 24px rgba(8, 38, 74, 0.06);
}

.vehicle-image-wrap {
  position: relative;
  aspect-ratio: 16 / 9;
  background: #dbeafe;
}

.vehicle-image {
  width: 100%;
  height: 100%;
  object-fit: cover;
  display: block;
  background: #e2e8f0;
}

.edit-btn {
  position: absolute;
  top: 12px;
  right: 12px;
  width: 36px;
  height: 36px;
  border: 0;
  border-radius: 10px;
  background: rgba(255, 255, 255, 0.92);
  color: #08264a;
  cursor: pointer;
  display: grid;
  place-items: center;
  box-shadow: 0 4px 12px rgba(8, 38, 74, 0.12);
}

.edit-btn svg {
  width: 18px;
  height: 18px;
}

.vehicle-meta {
  display: flex;
  justify-content: space-between;
  gap: 16px;
  padding: 18px 20px 20px;
}

.vehicle-meta strong {
  display: block;
  font-size: 18px;
  color: #0b1f3a;
  margin-bottom: 4px;
}

.vehicle-meta span {
  color: #6f7d8f;
  font-size: 13px;
}

.price-block {
  text-align: right;
}

.price-label {
  display: block;
  font-size: 10px;
  font-weight: 800;
  letter-spacing: 0.08em;
  text-transform: uppercase;
  color: #8a96a3;
  margin-bottom: 4px;
}

.price-block strong {
  font-size: 18px;
  color: #08264a;
}

.grid-footer {
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 16px;
  color: #6f7d8f;
  font-size: 13px;
}

.pagination {
  display: flex;
  gap: 6px;
}

.page-btn {
  min-width: 34px;
  height: 34px;
  border: 0;
  border-radius: 8px;
  background: transparent;
  color: #53657c;
  font-weight: 700;
  cursor: pointer;
}

.page-btn.active {
  background: #08264a;
  color: #ffffff;
}

.page-btn:disabled {
  opacity: 0.4;
  cursor: not-allowed;
}

@media (max-width: 1100px) {
  .filters-card {
    grid-template-columns: 1fr 1fr;
  }

  .search-field {
    grid-column: 1 / -1;
  }

  .page-header {
    flex-direction: column;
  }
}

@media (max-width: 760px) {
  .vehicle-grid,
  .filters-card {
    grid-template-columns: 1fr;
  }

  .grid-footer {
    flex-direction: column;
    align-items: flex-start;
  }
}
</style>
