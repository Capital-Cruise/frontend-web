<template>
  <div class="app">
    <TheSidebar @logout="handleLogout" />
    <main class="main">
      <header v-if="showLayoutHeader" class="topbar">
        <div>
          <h1 id="viewTitle">{{ currentRouteName }}</h1>
          <p id="viewSubtitle">{{ currentRouteMeta?.subtitle || '' }}</p>
        </div>
        <div class="top-actions">
          <button class="secondary" @click="reloadCurrentView">Recargar vista</button>
          <button class="secondary" @click="checkHealth">Estado del backend</button>
        </div>
      </header>
      <router-view />
    </main>
  </div>
</template>

<script setup>
import { computed } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import TheSidebar from '../components/TheSidebar.component.vue'
import { authService } from '../../iam/services/auth.service.js'
import { http } from '../../shared/services/http.instance.js'
import { toastService } from '../../shared/services/toast.service.js'

const router = useRouter()
const route = useRoute()

const currentRouteName = computed(() => {
  return route.meta?.title || route.name || 'Panel principal'
})

const currentRouteMeta = computed(() => route.meta || {})

const showLayoutHeader = computed(() => {
  return !['dashboard', 'clients', 'vehicles', 'support'].includes(route.name)
})

function reloadCurrentView() {
  router.replace({ path: route.path })
}

async function checkHealth() {
  try {
    await http.get('/api/v1/health', { noAuth: true })
    toastService.success('El backend responde correctamente.')
  } catch (err) {
    toastService.error(`Estado del backend: no disponible - ${err.message}`)
  }
}

function handleLogout() {
  authService.logout().finally(() => {
    router.push('/login')
  })
}
</script>

<style scoped>
.app {
  min-height: 100vh;
  display: grid;
  grid-template-columns: 260px 1fr;
}

.main {
  padding: 32px 48px 80px;
  overflow: hidden;
}

.topbar {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  gap: 18px;
  margin-bottom: 32px;
}

.topbar p {
  margin: 6px 0 0;
  color: #4a5568;
}

.top-actions {
  display: flex;
  gap: 10px;
}

h1 {
  margin: 0;
  font-size: 28px;
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

@media (max-width: 1180px) {
  .app {
    grid-template-columns: 1fr;
  }
  .main {
    padding: 24px;
  }
}

@media (max-width: 760px) {
  .topbar {
    flex-direction: column;
    align-items: stretch;
  }
}
</style>
