<template>
  <section class="share-page">
    <div class="share-header card">
      <div>
        <p class="eyebrow">Compartir operación</p>
        <h1>Compartir operación</h1>
        <p class="subtitle">{{ shareUrl }}</p>
      </div>
      <div class="header-actions">
        <button class="secondary" type="button" @click="goBackToDetail">Volver al detalle</button>
      </div>
    </div>

    <div v-if="loading" class="card state-card">Cargando enlace público...</div>
    <div v-else-if="error" class="card state-card error">{{ error }}</div>

    <div v-else class="share-grid">
      <section class="card info-card">
        <div class="info-row">
          <span>Cliente</span>
          <strong>{{ detail.clientSnapshotName || 'Cliente sin nombre' }}</strong>
        </div>
        <div class="info-row">
          <span>Vehículo</span>
          <strong>{{ detail.vehicleSnapshotLabel || 'Vehículo sin nombre' }}</strong>
        </div>
        <div class="info-row">
          <span>Estado de la operación</span>
          <strong :class="['status-pill', statusClass]">{{ statusLabel }}</strong>
        </div>
      </section>

      <section class="card qr-card">
        <canvas ref="qrCanvas" class="qr-canvas"></canvas>
        <div class="link-box">
          <input :value="shareUrl" readonly />
          <button class="secondary" type="button" @click="copyLink">Copiar enlace</button>
        </div>
      </section>
    </div>
  </section>
</template>

<script setup>
import { computed, nextTick, onMounted, ref, watch } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import QRCode from 'qrcode'
import { loanService } from '../services/loan.service.js'
import { formatOperationStatusLabel } from '../../shared/utils/loan-labels.js'

const route = useRoute()
const router = useRouter()

const loading = ref(true)
const error = ref('')
const detail = ref({})
const share = ref(null)
const qrCanvas = ref(null)

const operationId = computed(() => route.params.id)
const shareUrl = computed(() => share.value?.shareUrl || '')
const statusLabel = computed(() => formatOperationStatusLabel(detail.value?.status || 'SAVED'))
const statusClass = computed(() => (detail.value?.status || 'SAVED').toLowerCase())

async function loadShare() {
  loading.value = true
  error.value = ''

  try {
    detail.value = await loanService.getOperationDetail(operationId.value)
    if (detail.value?.status !== 'SAVED') {
      throw new Error('Solo las operaciones guardadas se pueden compartir.')
    }
    share.value = await loanService.createPublicShare(operationId.value)
    await nextTick()
    await renderQr()
  } catch (err) {
    error.value = err.message || 'No se pudo cargar la operación compartida.'
  } finally {
    loading.value = false
  }
}

async function renderQr() {
  if (!qrCanvas.value || !shareUrl.value) return

  await QRCode.toCanvas(qrCanvas.value, shareUrl.value, {
    width: 240,
    margin: 2,
    errorCorrectionLevel: 'M',
    color: {
      dark: '#08264a',
      light: '#ffffff'
    }
  })
}

async function copyLink() {
  if (!shareUrl.value) return
  await navigator.clipboard.writeText(shareUrl.value)
}

function goBackToDetail() {
  router.push({ name: 'operation-detail', params: { id: operationId.value } })
}

watch(shareUrl, async () => {
  if (shareUrl.value) {
    await nextTick()
    await renderQr()
  }
})

onMounted(loadShare)
</script>

<style scoped>
.share-page {
  display: grid;
  gap: 24px;
}

.card {
  background: #fff;
  border: 1px solid #edf1f6;
  border-radius: 14px;
  padding: 24px;
  box-shadow: 0 12px 30px rgba(8, 38, 74, 0.08);
}

.share-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 18px;
}

.eyebrow {
  margin: 0 0 8px;
  color: #6f7d8f;
  font-size: 12px;
  font-weight: 800;
  text-transform: uppercase;
  letter-spacing: 0.08em;
}

h1 {
  margin: 0;
  color: #08264a;
  font-size: 30px;
}

.subtitle {
  margin: 6px 0 0;
  color: #4a5568;
  word-break: break-all;
}

.header-actions {
  display: flex;
  gap: 10px;
}

.secondary {
  background: #e2e7ed;
  color: #26394e;
  border: 0;
  border-radius: 8px;
  padding: 12px 18px;
  font-weight: 700;
  cursor: pointer;
}

.share-grid {
  display: grid;
  grid-template-columns: 1fr 360px;
  gap: 24px;
}

.info-card {
  display: grid;
  gap: 16px;
}

.info-row {
  display: grid;
  gap: 6px;
}

.info-row span {
  color: #6f7d8f;
  font-size: 12px;
  font-weight: 800;
  text-transform: uppercase;
}

.info-row strong {
  color: #1d2632;
  font-size: 16px;
}

.status-pill {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: fit-content;
  padding: 5px 10px;
  border-radius: 999px;
  font-size: 12px;
  font-weight: 800;
}

.saved {
  background: #e7f8eb;
  color: #166534;
}

.qr-card {
  display: grid;
  gap: 16px;
  place-items: center;
}

.qr-canvas {
  width: 240px;
  height: 240px;
  background: #fff;
  border: 1px solid #e3e8ef;
  border-radius: 16px;
}

.link-box {
  display: grid;
  gap: 10px;
  width: 100%;
}

.link-box input {
  width: 100%;
  border: 1px solid #d8dee8;
  border-radius: 10px;
  padding: 12px 14px;
  font: inherit;
  background: #f7f9fc;
}

.state-card {
  text-align: center;
  color: #4a5568;
}

.state-card.error {
  color: #8f1521;
}

@media (max-width: 960px) {
  .share-header,
  .share-grid {
    grid-template-columns: 1fr;
  }

  .share-header {
    display: grid;
  }
}
</style>
