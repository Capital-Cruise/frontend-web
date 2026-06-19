<template>
  <div class="brand-login">
    <div class="brand-logo">CAPITALCRUISE</div>
    <div class="brand-subtitle">Loan Advisory Portal</div>
  </div>

  <form class="login-card" @submit.prevent="handleLogin">
    <h1>Secure Access</h1>
    <p>Use backend credentials to access the advisory portal.</p>

    <label>Backend URL</label>
    <input
        id="backendUrl"
        type="url"
        v-model="apiBase"
        autocomplete="off"
    />

    <label>Username or Email</label>
    <input
        id="loginUser"
        type="text"
        v-model="username"
        autocomplete="username"
    />

    <label>Password</label>
    <input
        id="loginPassword"
        type="password"
        v-model="password"
        autocomplete="current-password"
        @keydown.enter="handleLogin"
    />

    <button type="submit" class="primary full" :disabled="loading">
      {{ loading ? 'Logging in...' : 'Login' }}
    </button>

    <button type="button" class="secondary full" @click="useSavedToken">
      Use saved token
    </button>

    <pre v-if="error" class="debug">{{ error }}</pre>
  </form>
</template>

<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { authService } from '../services/auth.service.js'
import { http } from '../../shared/services/http.instance.js'

const router = useRouter()

const apiBase = ref(
    import.meta.env.VITE_API_BASE || 'https://backend-capital-cruise-deploy-482841496133.southamerica-west1.run.app'
)
const username = ref(import.meta.env.VITE_DEFAULT_LOGIN_USER || 'admin@capitalcruise.local')
const password = ref(import.meta.env.VITE_DEFAULT_LOGIN_PASSWORD || 'CapitalCruiseEnterprise#07')
const loading = ref(false)
const error = ref('')

const emit = defineEmits(['login-success'])

async function handleLogin() {
  loading.value = true
  error.value = ''

  try {
    http.setApiBase(apiBase.value)
    const user = await authService.login(username.value, password.value)
    emit('login-success', user)
    router.push('/')
  } catch (err) {
    error.value = err.message
  } finally {
    loading.value = false
  }
}

function useSavedToken() {
  const token = authService.getStoredToken()
  if (token) {
    router.push('/')
  } else {
    error.value = 'No saved token found'
  }
}
</script>

<style scoped>
.brand-login {
  text-align: center;
  margin-bottom: 24px;
}
.brand-logo {
  font-family: Georgia, serif;
  font-size: 30px;
  color: #08264a;
  line-height: 1;
}
.brand-subtitle {
  color: #6f7d8f;
  font-size: 13px;
  margin-top: 6px;
}
.login-card {
  width: min(520px, 100%);
  background: #ffffff;
  border-radius: 14px;
  padding: 44px;
  box-shadow: 0 12px 30px rgba(8, 38, 74, 0.08);
  display: grid;
  gap: 16px;
}
.login-card p {
  margin: 0 0 8px;
}
h1 {
  margin: 0;
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
.full {
  width: 100%;
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
input {
  width: 100%;
  border: 1px solid transparent;
  background: #dfe4e9;
  border-radius: 8px;
  padding: 12px 14px;
  color: #1d2632;
  outline: none;
  font: inherit;
}
input:focus {
  border-color: #9bbcff;
  background: #eef4ff;
}
.debug {
  background: #101a2a;
  color: #d7e5ff;
  border-radius: 10px;
  padding: 16px;
  max-height: 220px;
  overflow: auto;
  font-size: 12px;
  white-space: pre-wrap;
  word-break: break-word;
}
</style>