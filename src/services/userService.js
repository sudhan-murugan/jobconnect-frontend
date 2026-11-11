// Functions for the logged-in user's own profile (/api/users/me).
import api from './api.js'
import { UPLOAD_TIMEOUT_MS } from './applicationService.js'

// PUT replaces the profile, so send every field. Returns the updated user.
export async function updateProfile({ name, headline, location, skills }) {
  const { data } = await api.put('/users/me', { name, headline, location, skills })
  return data.user
}

// Uploads (or replaces) the profile resume. Returns the updated user.
export async function uploadProfileResume(file, { onUploadProgress } = {}) {
  const formData = new FormData()
  formData.append('resume', file)
  const { data } = await api.post('/users/me/resume', formData, { timeout: UPLOAD_TIMEOUT_MS, onUploadProgress })
  return data.user
}

export async function deleteProfileResume() {
  const { data } = await api.delete('/users/me/resume')
  return data.user
}
