<template>
  <VehicleForm
    v-if="isFormMode"
    ref="formRef"
    :loading="saving"
    :mode="formMode"
    @saved="onVehicleSaved"
    @cancel="goToList"
  />
  <VehicleList
    v-else
    :vehicles="displayedVehicles"
    :brands="availableBrands"
    :years="availableYears"
    :filters="filters"
    :loading="loading"
    :page="page"
    :size="pageSize"
    :total-elements="filteredTotal"
    :total-pages="filteredTotalPages"
    @add="goToRegister"
    @edit="onEditVehicle"
    @filter-change="onFilterChange"
    @reset-filters="resetFilters"
    @page-change="onPageChange"
  />
</template>

<script setup>
import { ref, computed, onMounted, watch, nextTick } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import VehicleList from '../components/VehicleList.component.vue'
import VehicleForm from '../components/VehicleForm.component.vue'
import { vehicleService } from '../services/vehicle.service.js'
import { resolveVehicleImage } from '../utils/vehicle-image.util.js'
import { toastService } from '../../shared/services/toast.service.js'
import { warmImageCache } from '../../shared/utils/image-cache.util.js'

const route = useRoute()
const router = useRouter()

const allVehicles = ref([])
const loading = ref(false)
const page = ref(0)
const pageSize = ref(12)
const formRef = ref(null)
const saving = ref(false)
const filters = ref({ search: '', brand: '', year: '' })
let searchTimer = null

const formMode = computed(() => (route.query.action === 'edit' ? 'edit' : 'create'))
const isFormMode = computed(() => ['new', 'edit'].includes(route.query.action))
const editingVehicleId = computed(() =>
  route.query.id ? String(route.query.id) : null
)

const yearFilteredVehicles = computed(() => {
  if (!filters.value.year) return allVehicles.value
  return allVehicles.value.filter(
    (vehicle) => String(vehicle.year) === String(filters.value.year)
  )
})

const filteredTotal = computed(() => yearFilteredVehicles.value.length)

const filteredTotalPages = computed(() =>
  Math.max(1, Math.ceil(filteredTotal.value / pageSize.value))
)

const displayedVehicles = computed(() => {
  const start = page.value * pageSize.value
  return yearFilteredVehicles.value.slice(start, start + pageSize.value)
})

const availableBrands = computed(() => {
  const brands = new Set(allVehicles.value.map((vehicle) => vehicle.brand).filter(Boolean))
  return [...brands].sort()
})

const availableYears = computed(() => {
  const years = new Set(allVehicles.value.map((vehicle) => vehicle.year).filter(Boolean))
  return [...years].sort((a, b) => b - a)
})

async function loadVehicles() {
  loading.value = true
  try {
    const result = await vehicleService.getVehiclesPage({
      page: 0,
      size: 100,
      search: filters.value.search,
      brand: filters.value.brand
    })
    allVehicles.value = result.vehicles
    warmVisibleVehicleImages(result.vehicles)

    if (page.value >= filteredTotalPages.value) {
      page.value = Math.max(filteredTotalPages.value - 1, 0)
    }
  } catch (err) {
    toastService.error(err.message)
  } finally {
    loading.value = false
  }
}

function warmVisibleVehicleImages(vehicles) {
  const imageSources = (vehicles || []).map((vehicle) => resolveVehicleImage(vehicle))
  warmImageCache(imageSources).catch(() => {})
}

function goToRegister() {
  router.push({ path: '/vehicles', query: { action: 'new' } })
}

function goToList() {
  router.push('/vehicles')
}

function onEditVehicle(vehicle) {
  router.push({
    path: '/vehicles',
    query: { action: 'edit', id: vehicle.identifier }
  })
}

function onFilterChange(nextFilters) {
  const prev = { ...filters.value }
  filters.value = nextFilters
  page.value = 0

  if (nextFilters.search === prev.search && nextFilters.brand === prev.brand) {
    return
  }

  clearTimeout(searchTimer)
  const delay = nextFilters.search !== prev.search ? 300 : 0
  searchTimer = setTimeout(() => {
    loadVehicles()
  }, delay)
}

function resetFilters() {
  filters.value = { search: '', brand: '', year: '' }
  page.value = 0
  loadVehicles()
}

function onPageChange(nextPage) {
  if (nextPage < 0 || nextPage >= filteredTotalPages.value) return
  page.value = nextPage
}

async function onVehicleSaved(vehicleData) {
  saving.value = true
  try {
    if (formMode.value === 'edit' && editingVehicleId.value) {
      await vehicleService.updateVehicle(editingVehicleId.value, vehicleData)
      toastService.success('Vehicle updated successfully')
    } else {
      await vehicleService.createVehicle(vehicleData)
      toastService.success('Vehicle saved successfully')
    }
    goToList()
    await loadVehicles()
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
  if (!editingVehicleId.value) {
    toastService.error('Vehicle not found')
    goToList()
    return
  }

  try {
    const vehicle = await vehicleService.getVehicleById(editingVehicleId.value)
    nextTick(() => {
      formRef.value?.loadForm?.(vehicle)
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
      await loadVehicles()
    }
  }
)

watch(
  () => filters.value.year,
  () => {
    page.value = 0
  }
)

onMounted(async () => {
  if (isFormMode.value) {
    await prepareFormMode()
  } else {
    await loadVehicles()
  }
})
</script>
