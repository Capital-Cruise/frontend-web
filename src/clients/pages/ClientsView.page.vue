<template>
  <ClientForm
    v-if="isFormMode"
    ref="formRef"
    :loading="saving"
    :mode="formMode"
    @saved="onClientSaved"
    @cancel="goToList"
  />
  <ClientList
    v-else
    :clients="clients"
    :loading="loading"
    :page="page"
    :size="pageSize"
    :total-elements="totalElements"
    :total-pages="totalPages"
    @add="goToRegister"
    @edit="onEditClient"
    @page-change="onPageChange"
  />
</template>

<script setup>
import { ref, computed, onMounted, watch, nextTick } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import ClientList from '../components/ClientList.component.vue'
import ClientForm from '../components/ClientForm.component.vue'
import { clientService } from '../services/client.service.js'
import { toastService } from '../../shared/services/toast.service.js'

const route = useRoute()
const router = useRouter()

const clients = ref([])
const loading = ref(false)
const page = ref(0)
const pageSize = ref(5)
const totalElements = ref(0)
const totalPages = ref(1)
const formRef = ref(null)
const saving = ref(false)

const formMode = computed(() => (route.query.action === 'edit' ? 'edit' : 'create'))
const isFormMode = computed(() => ['new', 'edit'].includes(route.query.action))
const editingClientId = computed(() =>
  route.query.id ? String(route.query.id) : null
)

async function loadClients(targetPage = page.value) {
  loading.value = true
  try {
    const result = await clientService.getClientsPage(targetPage, pageSize.value)
    clients.value = result.clients
    page.value = result.page
    totalElements.value = result.totalElements
    totalPages.value = Math.max(result.totalPages, 1)
  } catch (err) {
    toastService.error(err.message)
  } finally {
    loading.value = false
  }
}

function goToRegister() {
  router.push({ path: '/clients', query: { action: 'new' } })
}

function goToList() {
  router.push('/clients')
}

function onEditClient(client) {
  router.push({
    path: '/clients',
    query: { action: 'edit', id: client.identifier }
  })
}

function onPageChange(nextPage) {
  if (nextPage < 0 || nextPage >= totalPages.value) return
  loadClients(nextPage)
}

async function onClientSaved(clientData) {
  saving.value = true
  try {
    if (formMode.value === 'edit' && editingClientId.value) {
      await clientService.updateClient(editingClientId.value, clientData)
      toastService.success('Client updated successfully')
    } else {
      await clientService.createClient(clientData)
      toastService.success('Client saved successfully')
    }
    goToList()
    await loadClients(page.value)
  } catch (err) {
    toastService.error(err.message)
  } finally {
    saving.value = false
  }
}

function prepareCreateForm() {
  nextTick(() => {
    formRef.value?.resetForm?.()
    formRef.value?.focusFirstField?.()
  })
}

async function prepareEditForm() {
  if (!editingClientId.value) {
    toastService.error('Client not found')
    goToList()
    return
  }

  try {
    const client = await clientService.getClientById(editingClientId.value)
    nextTick(() => {
      formRef.value?.loadForm?.(client)
      formRef.value?.focusFirstField?.()
    })
  } catch (err) {
    toastService.error(err.message)
    goToList()
  }
}

async function prepareFormMode() {
  if (route.query.action === 'edit') {
    await prepareEditForm()
  } else if (route.query.action === 'new') {
    prepareCreateForm()
  }
}

watch(
  () => [route.query.action, route.query.id],
  async ([action]) => {
    if (action === 'new' || action === 'edit') {
      await prepareFormMode()
    } else {
      await loadClients(page.value)
    }
  }
)

onMounted(async () => {
  if (isFormMode.value) {
    await prepareFormMode()
  } else {
    await loadClients(0)
  }
})
</script>
