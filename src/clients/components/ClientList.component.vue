<template>
  <div class="clients-page">
    <header class="page-header">
      <div>
        <h1>Clientes</h1>
        <p>
          Gestiona el registro de clientes, revisa su perfil financiero e inicia nuevas
          simulaciones de crédito para tu base activa.
        </p>
      </div>
      <button class="add-btn" type="button" @click="$emit('add')">
        <svg viewBox="0 0 24 24" aria-hidden="true">
          <path d="M19 13h-6v6h-2v-6H5v-2h6V5h2v6h6v2z" fill="currentColor" />
        </svg>
        Nuevo cliente
      </button>
    </header>

    <section class="table-card">
      <div v-if="loading" class="table-state">Cargando clientes...</div>
      <div v-else-if="clients.length === 0" class="table-state">
        No hay clientes registrados. Agrega tu primer cliente para comenzar.
      </div>
      <div v-else class="table-wrap">
        <table>
          <thead>
            <tr>
              <th>Nombre completo</th>
              <th>Número de documento</th>
              <th>Teléfono</th>
              <th>Correo electrónico</th>
              <th>Fecha de registro</th>
              <th>Acciones</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="client in clients" :key="client.identifier">
              <td>
                <div class="name-cell">
                  <span class="avatar" :style="{ background: avatarColor(client.displayName) }">
                    {{ initials(client.displayName) }}
                  </span>
                  <span class="name">{{ client.displayName }}</span>
                </div>
              </td>
              <td>{{ formatDocument(client.documentNumber) }}</td>
              <td>{{ client.phone || '—' }}</td>
              <td>
                <a v-if="client.email" :href="`mailto:${client.email}`" class="email-link">
                  {{ client.email }}
                </a>
                <span v-else>—</span>
              </td>
              <td>{{ formatDate(client.createdAt) }}</td>
              <td>
                <div class="actions">
                  <button
                    type="button"
                    class="icon-btn"
                    aria-label="Editar cliente"
                    @click="$emit('edit', client)"
                  >
                    <svg viewBox="0 0 24 24" aria-hidden="true">
                      <path
                        d="M3 17.25V21h3.75L17.81 9.94l-3.75-3.75L3 17.25zM20.71 7.04a1 1 0 0 0 0-1.41l-2.34-2.34a1 1 0 0 0-1.41 0l-1.83 1.83 3.75 3.75 1.83-1.83z"
                        fill="currentColor"
                      />
                    </svg>
                  </button>
                </div>
              </td>
            </tr>
          </tbody>
        </table>
      </div>

      <footer v-if="totalElements > 0" class="table-footer">
        <span>Mostrando {{ rangeStart }} a {{ rangeEnd }} de {{ totalElements }} clientes</span>
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
    </section>
  </div>
</template>

<script setup>
import { computed } from 'vue'

const props = defineProps({
  clients: { type: Array, default: () => [] },
  loading: { type: Boolean, default: false },
  page: { type: Number, default: 0 },
  size: { type: Number, default: 5 },
  totalElements: { type: Number, default: 0 },
  totalPages: { type: Number, default: 1 }
})

defineEmits(['add', 'edit', 'page-change'])

const rangeStart = computed(() => (props.totalElements === 0 ? 0 : props.page * props.size + 1))
const rangeEnd = computed(() =>
  Math.min((props.page + 1) * props.size, props.totalElements)
)

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

function initials(name = '') {
  return name
    .split(' ')
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0]?.toUpperCase() || '')
    .join('') || '?'
}

function avatarColor(name = '') {
  const palette = ['#dbeafe', '#dcfce7', '#fef3c7', '#ede9fe', '#ffe4e6']
  const index = name.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0) % palette.length
  return palette[index]
}

function formatDocument(value = '') {
  if (!value) return '—'
  const digits = value.replace(/\D/g, '')
  if (digits.length >= 11) {
    return `${digits.slice(0, 3)}.${digits.slice(3, 6)}.${digits.slice(6, 9)}-${digits.slice(9, 11)}`
  }
  return value
}

function formatDate(value) {
  if (!value) return '—'
  return new Intl.DateTimeFormat('es-PE', {
    month: 'short',
    day: 'numeric',
    year: 'numeric'
  }).format(new Date(value))
}
</script>

<style scoped>
.clients-page {
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
  max-width: 720px;
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

.table-card {
  background: #ffffff;
  border-radius: 14px;
  border: 1px solid #edf1f6;
  box-shadow: 0 8px 24px rgba(8, 38, 74, 0.06);
  overflow: hidden;
}

.table-state {
  padding: 48px 24px;
  text-align: center;
  color: #6f7d8f;
}

.table-wrap {
  overflow-x: auto;
}

table {
  width: 100%;
  border-collapse: collapse;
}

thead {
  background: #f8fafc;
}

th {
  text-align: left;
  padding: 14px 20px;
  color: #6f7d8f;
  font-size: 11px;
  font-weight: 800;
  letter-spacing: 0.08em;
  text-transform: uppercase;
  border-bottom: 1px solid #edf1f6;
}

td {
  padding: 18px 20px;
  border-bottom: 1px solid #f3f6fa;
  color: #1d2632;
  font-size: 14px;
}

.name-cell {
  display: flex;
  align-items: center;
  gap: 12px;
}

.avatar {
  width: 36px;
  height: 36px;
  border-radius: 50%;
  display: grid;
  place-items: center;
  font-size: 12px;
  font-weight: 800;
  color: #08264a;
  flex-shrink: 0;
}

.name {
  font-weight: 700;
}

.email-link {
  color: #2563eb;
  text-decoration: none;
}

.email-link:hover {
  text-decoration: underline;
}

.actions {
  display: flex;
  gap: 8px;
}

.icon-btn {
  width: 34px;
  height: 34px;
  border: 0;
  border-radius: 8px;
  background: transparent;
  color: #6f7d8f;
  cursor: pointer;
  display: grid;
  place-items: center;
}

.icon-btn svg {
  width: 18px;
  height: 18px;
}

.icon-btn:hover {
  background: #eef2f6;
  color: #08264a;
}

.table-footer {
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 16px;
  padding: 16px 20px;
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

@media (max-width: 900px) {
  .page-header {
    flex-direction: column;
  }

  .table-footer {
    flex-direction: column;
    align-items: flex-start;
  }
}
</style>
