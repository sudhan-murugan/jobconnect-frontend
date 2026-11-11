// Functions for the /api/auth endpoints. Components call these instead of
// using axios directly, so URLs and response shapes live in one place.
import api from './api.js'

// Returns { token, user }
export async function registerUser({ name, email, password, role }) {
  const { data } = await api.post('/auth/register', { name, email, password, role })
  return data
}

// Returns { token, user }
export async function loginUser({ email, password }) {
  const { data } = await api.post('/auth/login', { email, password })
  return data
}

// Returns the logged-in user (the token is attached by the axios interceptor)
export async function fetchCurrentUser() {
  const { data } = await api.get('/auth/me')
  return data.user
}
