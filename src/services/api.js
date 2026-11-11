import axios from 'axios'
import { tokenStorage } from './tokenStorage.js'

// Backend server address, e.g. http://localhost:5000 (no trailing slash).
// Vite only exposes env variables prefixed with VITE_ to browser code, and
// they are baked in at build time. Never put secrets in them.
export const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000'

// One shared axios instance for the whole app, so the base URL, timeout and
// auth header are configured in a single place.
const api = axios.create({
  baseURL: `${API_URL}/api`,
  timeout: 10000,
})

// Interceptors are functions axios runs on EVERY request/response.

// 1) Before each request: attach the JWT if the user is logged in.
api.interceptors.request.use((config) => {
  const token = tokenStorage.get()
  if (token) {
    config.headers.Authorization = `Bearer ${token}`
  }
  return config
})

// 2) After each response: if the server rejects our token (expired, or the
// account was deleted), tell the auth layer so it can log the user out.
// AuthProvider registers the handler, so this file doesn't need to know about React.
let handleUnauthorized = null
export function setUnauthorizedHandler(handler) {
  handleUnauthorized = handler
}

api.interceptors.response.use(
  (response) => response,
  (error) => {
    const sentToken = Boolean(error.config?.headers?.Authorization)
    if (error.response?.status === 401 && sentToken && handleUnauthorized) {
      handleUnauthorized()
    }
    // Re-throw so the code that made the request can still handle the error.
    return Promise.reject(error)
  },
)

// Turns an axios error into a message that is safe to show to users.
export function getErrorMessage(error, fallback = 'Something went wrong. Please try again.') {
  if (error.response?.data?.message) return error.response.data.message
  // A request was sent but no response came back: server down or no network.
  if (error.request && !error.response) {
    return 'Cannot reach the server. Check your connection and try again.'
  }
  return fallback
}

// Turns the API's validation details [{ field, message }] into { field: message }
// so forms can show each error under the matching input.
export function getFieldErrors(error) {
  const details = error.response?.data?.details
  if (!Array.isArray(details)) return {}
  return Object.fromEntries(details.map(({ field, message }) => [field, message]))
}

// The health check lives at the server root (/health), not under /api, so we
// pass a full URL. Axios ignores baseURL when the URL is absolute.
export async function getHealth() {
  const { data } = await api.get(`${API_URL}/health`)
  return data
}

export default api
