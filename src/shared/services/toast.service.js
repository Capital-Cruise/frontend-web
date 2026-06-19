import { reactive } from 'vue'

const state = reactive({
    toasts: []
})

let nextId = 0

function pushToast(type, message, duration = 4000) {
    const id = ++nextId
    const toast = { id, type, message, duration }

    state.toasts.push(toast)

    if (duration > 0) {
        setTimeout(() => dismiss(id), duration)
    }

    return id
}

function dismiss(id) {
    const index = state.toasts.findIndex((toast) => toast.id === id)
    if (index !== -1) {
        state.toasts.splice(index, 1)
    }
}

export const toastService = {
    state,
    success(message, duration) {
        return pushToast('success', message, duration)
    },
    error(message, duration = 6000) {
        return pushToast('error', message, duration)
    },
    info(message, duration) {
        return pushToast('info', message, duration)
    },
    warning(message, duration) {
        return pushToast('warning', message, duration)
    },
    dismiss
}

export default toastService
