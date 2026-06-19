<template>
  <div class="split">
    <ClientList :clients="clients" @load="loadClients" />
    <ClientForm @saved="onClientSaved" />
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import ClientList from '../components/ClientList.component.vue'
import ClientForm from '../components/ClientForm.component.vue'
import { clientService } from '../services/client.service.js'

const clients = ref([])

async function loadClients() {
  try {
    clients.value = await clientService.getClients()
  } catch (err) {
    alert(err.message)
  }
}

async function onClientSaved(clientData) {
  try {
    await clientService.createClient(clientData)
    await loadClients()
    alert('Client saved')
  } catch (err) {
    alert(err.message)
  }
}

onMounted(loadClients)
</script>

<style scoped>
.split {
  display: grid;
  grid-template-columns: minmax(0, 1.3fr) minmax(360px, 0.7fr);
  gap: 24px;
  align-items: start;
}
@media (max-width: 1180px) {
  .split {
    grid-template-columns: 1fr;
  }
}
</style>