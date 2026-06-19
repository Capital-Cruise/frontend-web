import { createApp } from 'vue'
import { createRouter, createWebHistory } from 'vue-router'
import App from './App.vue'
import routes from './router.js'
import { authService } from './iam/services/auth.service.js'
import { http } from './shared/services/http.instance.js'
import { setupAuthGuard } from './iam/router/auth.guard.js'

const router = createRouter({
    history: createWebHistory(),
    routes
})

http.onUnauthorized = () => authService.tryRefreshToken()
setupAuthGuard(router)

async function bootstrap() {
    await authService.restoreSession()

    const app = createApp(App)
    app.use(router)
    await router.isReady()
    app.mount('#app')
}

bootstrap()
