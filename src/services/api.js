import axios from 'axios'

// Backend server address, e.g. http://localhost:5000 (no trailing slash).
// Vite only exposes env variables prefixed with VITE_ to browser code, and
// they are baked in at build time. Never put secrets in them.
export const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000'

// One shared axios instance for the whole app, so the base URL, timeout and
// (from Phase 2) the auth header are configured in a single place.
const api = axios.create({
  baseURL: `${API_URL}/api`,
  timeout: 10000,
})

// Phase 2: a request interceptor here will attach the JWT to every request:
//   api.interceptors.request.use((config) => { ...set Authorization header... })

// The health check lives at the server root (/health), not under /api, so we
// pass a full URL. Axios ignores baseURL when the URL is absolute.
export async function getHealth() {
  const { data } = await api.get(`${API_URL}/health`)
  return data
}

export default api
