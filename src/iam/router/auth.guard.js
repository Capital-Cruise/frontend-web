import { authService } from '../services/auth.service.js'

export function setupAuthGuard(router) {
    router.beforeEach((to) => {
        const requiresAuth = to.matched.some((record) => record.meta.requiresAuth)

        if (requiresAuth && !authService.isAuthenticated()) {
            return {
                name: 'login',
                query: { redirect: to.fullPath }
            }
        }

        if (to.name === 'login' && authService.isAuthenticated()) {
            return { name: 'dashboard' }
        }

        return true
    })
}
