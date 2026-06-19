const FALLBACK_BY_TYPE = {
    SEDAN: 'https://images.unsplash.com/photo-1555215695-3004980ad54e?auto=format&fit=crop&w=960&q=80',
    SUV: 'https://images.unsplash.com/photo-1519641471654-76ce5427b690?auto=format&fit=crop&w=960&q=80',
    PICKUP: 'https://images.unsplash.com/photo-1533473354031-64a680698fee?auto=format&fit=crop&w=960&q=80',
    HATCHBACK: 'https://images.unsplash.com/photo-1481497146946-675b64c0d93b?auto=format&fit=crop&w=960&q=80',
    VAN: 'https://images.unsplash.com/photo-1464219784473-060248127b93?auto=format&fit=crop&w=960&q=80',
    OTHER: 'https://images.unsplash.com/photo-1492144534655-ae79c964c9d7?auto=format&fit=crop&w=960&q=80'
}

export function fallbackVehicleImage(vehicleType = 'OTHER') {
    return FALLBACK_BY_TYPE[vehicleType] || FALLBACK_BY_TYPE.OTHER
}

export function resolveVehicleImage(vehicle = {}) {
    const url = vehicle.imageUrl?.trim()
    if (url) return url
    return fallbackVehicleImage(vehicle.vehicleType)
}
