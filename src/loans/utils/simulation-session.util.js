const SIMULATION_RESULT_KEY = 'cc_simulation_result'
const SIMULATION_REQUEST_KEY = 'cc_simulation_request'

function safeParse(rawValue) {
  if (!rawValue) return null
  try {
    return JSON.parse(rawValue)
  } catch {
    return null
  }
}

export function saveSimulationRequest(request) {
  sessionStorage.setItem(SIMULATION_REQUEST_KEY, JSON.stringify(request))
}

export function loadSimulationRequest() {
  return safeParse(sessionStorage.getItem(SIMULATION_REQUEST_KEY))
}

export function clearSimulationRequest() {
  sessionStorage.removeItem(SIMULATION_REQUEST_KEY)
}

export function saveSimulationResult(result) {
  sessionStorage.setItem(SIMULATION_RESULT_KEY, JSON.stringify(result))
}

export function loadSimulationResult() {
  return safeParse(sessionStorage.getItem(SIMULATION_RESULT_KEY))
}

export function clearSimulationResult() {
  sessionStorage.removeItem(SIMULATION_RESULT_KEY)
}

export function clearSimulationSession() {
  clearSimulationRequest()
  clearSimulationResult()
}
