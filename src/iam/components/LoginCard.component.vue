<template>
  <div class="login-page">
    <header class="brand-header">
      <img src="/logo.png" alt="CapitalCruise" class="brand-logo" />
      <p class="brand-subtitle">Acceso seguro al simulador de crédito vehicular</p>
    </header>

    <form class="login-card" @submit.prevent="handleLogin">
      <h1>Acceso seguro</h1>
      <p class="login-description">Ingresa tus credenciales para continuar.</p>

      <div class="field">
        <label for="loginUser">Usuario o correo electrónico</label>
        <input
          id="loginUser"
          type="email"
          v-model="username"
          placeholder="usuario@capitalcruise.com"
          autocomplete="username"
        />
      </div>

      <div class="field">
        <label for="loginPassword">Contraseña</label>
        <div class="password-input">
          <input
            id="loginPassword"
            :type="showPassword ? 'text' : 'password'"
            v-model="password"
            autocomplete="current-password"
          />
          <button
            type="button"
            class="toggle-password"
            :aria-label="showPassword ? 'Ocultar contraseña' : 'Mostrar contraseña'"
            @click="showPassword = !showPassword"
          >
            <svg v-if="showPassword" viewBox="0 0 24 24" aria-hidden="true">
              <path
                d="M12 5C7 5 2.73 8.11 1 12.5c1.73 4.39 6 7.5 11 7.5s9.27-3.11 11-7.5C21.27 8.11 17 5 12 5zm0 12.5a5 5 0 1 1 0-10 5 5 0 0 1 0 10zm0-8a3 3 0 1 0 0 6 3 3 0 0 0 0-6z"
                fill="currentColor"
              />
            </svg>
            <svg v-else viewBox="0 0 24 24" aria-hidden="true">
              <path
                d="M12 7a5 5 0 0 0-5 5 5 5 0 0 0 5 5 5 5 0 0 0 5-5 5 5 0 0 0-5-5zm0 8a3 3 0 1 1 0-6 3 3 0 0 1 0 6zm7.94-2.06A12.98 12.98 0 0 0 23 12.5C21.27 8.11 17 5 12 5c-1.04 0-2.05.12-3 .34l1.46 1.46A9.9 9.9 0 0 1 12 7c3.31 0 6.2 1.68 7.94 4.24l-1.46 1.46A7.94 7.94 0 0 0 12 9a7.94 7.94 0 0 0-3.48.84L7.06 8.38A12.98 12.98 0 0 0 1 12.5C2.73 16.89 7 20 12 20c1.04 0 2.05-.12 3-.34l-1.46-1.46A9.9 9.9 0 0 1 12 17a7.94 7.94 0 0 0 3.48-.84l1.46 1.46z"
                fill="currentColor"
              />
            </svg>
          </button>
        </div>
      </div>

      <label class="remember-device">
        <input type="checkbox" v-model="rememberDevice" />
        <span>Recordarme en este dispositivo por 30 días</span>
      </label>

      <button type="submit" class="primary full" :disabled="loading">
        <span v-if="loading" class="spinner" aria-hidden="true"></span>
        {{ loading ? 'Autenticando...' : 'Iniciar sesión' }}
      </button>

      <p v-if="error" class="error-message" role="alert">{{ error }}</p>

      <div class="security-badges">
        <div class="badge">
          <svg viewBox="0 0 24 24" aria-hidden="true">
            <path
              d="M12 2 4 5v6.09c0 5.05 3.41 9.76 8 10.91 4.59-1.15 8-5.86 8-10.91V5l-8-3zm-1.06 13.54L7.4 12l1.41-1.41 2.13 2.13 4.53-4.53L16.88 9 10.94 15.54z"
              fill="currentColor"
            />
          </svg>
          <span>ISO 27001</span>
        </div>
        <div class="badge">
          <svg viewBox="0 0 24 24" aria-hidden="true">
            <path
              d="M12 2 4 5v6.09c0 5.05 3.41 9.76 8 10.91 4.59-1.15 8-5.86 8-10.91V5l-8-3z"
              fill="currentColor"
            />
          </svg>
          <span>Respaldo institucional</span>
        </div>
      </div>
    </form>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { authService } from '../services/auth.service.js'

const router = useRouter()
const route = useRoute()

const rememberedEmail = authService.getRememberedEmail()
const username = ref(
  rememberedEmail ||
    (import.meta.env.DEV ? import.meta.env.VITE_DEFAULT_LOGIN_USER || '' : '')
)
const password = ref('')
const rememberDevice = ref(!!rememberedEmail || localStorage.getItem('cc_remember_device') === 'true')
const showPassword = ref(false)
const loading = ref(false)
const error = ref('')

async function handleLogin() {
  error.value = ''

  if (!username.value.trim()) {
    error.value = 'Ingresa tu usuario o correo electrónico.'
    return
  }

  if (!password.value) {
    error.value = 'Ingresa tu contraseña.'
    return
  }

  loading.value = true

  try {
    await authService.login(username.value, password.value, rememberDevice.value)

    const redirect = typeof route.query.redirect === 'string' ? route.query.redirect : '/'
    router.push(redirect)
  } catch (err) {
    error.value = err.message || 'No se pudo iniciar sesión. Verifica tus credenciales.'
  } finally {
    loading.value = false
  }
}
</script>

<style scoped>
.login-page {
  width: min(440px, 100%);
  display: grid;
  gap: 28px;
}

.brand-header {
  text-align: center;
}

.brand-logo {
  width: min(220px, 72vw);
  height: auto;
  display: block;
  margin: 0 auto;
}

.brand-subtitle {
  margin: 14px 0 0;
  color: #6f7d8f;
  font-size: 13px;
}

.login-card {
  background: #ffffff;
  border-radius: 16px;
  padding: 36px 40px 28px;
  box-shadow: 0 12px 30px rgba(8, 38, 74, 0.08);
  display: grid;
  gap: 18px;
}

.login-card h1 {
  margin: 0;
  font-size: 28px;
  font-weight: 700;
  color: #0b1f3a;
}

.login-description {
  margin: -6px 0 4px;
  color: #6f7d8f;
  font-size: 14px;
  line-height: 1.5;
}

.field {
  display: grid;
  gap: 8px;
}

.field label {
  font-size: 11px;
  text-transform: uppercase;
  color: #6f7d8f;
  font-weight: 700;
  letter-spacing: 0.08em;
}

input[type='email'],
input[type='password'],
input[type='text'] {
  width: 100%;
  border: 1px solid transparent;
  background: #e8ecf1;
  border-radius: 10px;
  padding: 13px 14px;
  color: #1d2632;
  outline: none;
  font: inherit;
}

input::placeholder {
  color: #8a96a3;
}

input:focus {
  border-color: #9bbcff;
  background: #eef4ff;
}

.password-input {
  position: relative;
}

.password-input input {
  padding-right: 44px;
}

.toggle-password {
  position: absolute;
  top: 50%;
  right: 10px;
  transform: translateY(-50%);
  border: 0;
  background: transparent;
  color: #6f7d8f;
  width: 32px;
  height: 32px;
  display: grid;
  place-items: center;
  cursor: pointer;
  padding: 0;
}

.toggle-password svg {
  width: 18px;
  height: 18px;
}

.remember-device {
  display: flex;
  align-items: center;
  gap: 10px;
  color: #6f7d8f;
  font-size: 13px;
  cursor: pointer;
}

.remember-device input {
  width: 16px;
  height: 16px;
  accent-color: #08264a;
}

.primary {
  background: #08264a;
  color: white;
  border: 0;
  border-radius: 10px;
  padding: 14px 18px;
  font-weight: 700;
  letter-spacing: 0.02em;
  cursor: pointer;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 10px;
}

.primary:disabled {
  opacity: 0.85;
  cursor: not-allowed;
}

.full {
  width: 100%;
}

.spinner {
  width: 16px;
  height: 16px;
  border: 2px solid rgba(255, 255, 255, 0.35);
  border-top-color: #ffffff;
  border-radius: 50%;
  animation: spin 0.8s linear infinite;
}

@keyframes spin {
  to {
    transform: rotate(360deg);
  }
}

.error-message {
  margin: -4px 0 0;
  padding: 12px 14px;
  border-radius: 10px;
  background: #fef2f2;
  color: #b42318;
  font-size: 13px;
  line-height: 1.4;
}

.security-badges {
  display: flex;
  justify-content: center;
  gap: 28px;
  padding-top: 6px;
  border-top: 1px solid #eef2f6;
}

.badge {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  color: #8a96a3;
  font-size: 11px;
  font-weight: 700;
  letter-spacing: 0.06em;
  text-transform: uppercase;
}

.badge svg {
  width: 16px;
  height: 16px;
}
</style>
