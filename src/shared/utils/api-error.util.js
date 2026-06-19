const AUTH_MESSAGES = {
    401: 'Credenciales inválidas. Verifique su correo y contraseña.',
    403: 'No tiene permisos para acceder a este recurso.',
    404: 'Recurso no encontrado.',
    500: 'Error interno del servidor. Intente nuevamente más tarde.',
    502: 'No se pudo conectar con el backend. Verifique que el servidor esté activo.'
}

export function parseApiError(body, status) {
    if (body && typeof body === 'object') {
        if (body.message) {
            return translateAuthMessage(body.message)
        }
        if (Array.isArray(body.details) && body.details.length > 0) {
            return body.details.join('. ')
        }
    }

    if (typeof body === 'string' && body.trim()) {
        return body
    }

    return AUTH_MESSAGES[status] || `Error del servidor (${status}).`
}

function translateAuthMessage(message) {
    const normalized = message.toLowerCase()

    if (normalized.includes('invalid credentials') || normalized.includes('bad credentials')) {
        return AUTH_MESSAGES[401]
    }
    if (normalized.includes('inactive')) {
        return 'Su cuenta está inactiva. Contacte al administrador.'
    }
    if (normalized.includes('validation failed')) {
        return 'Por favor, complete todos los campos requeridos.'
    }
    if (normalized.includes('unauthorized')) {
        return 'Sesión expirada. Inicie sesión nuevamente.'
    }

    return message
}

export class ApiError extends Error {
    constructor(message, status, body = null) {
        super(message)
        this.name = 'ApiError'
        this.status = status
        this.body = body
    }
}
