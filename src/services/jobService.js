// Functions for the /api/jobs endpoints.
import api from './api.js'

// Leave out empty filters so requests stay clean (no "keyword=&location=").
function withoutEmptyValues(params) {
  return Object.fromEntries(
    Object.entries(params).filter(([, value]) => value !== '' && value !== null && value !== undefined),
  )
}

// Returns { jobs, pagination: { page, limit, total, totalPages } }.
// `signal` lets the caller cancel the request (see hooks/useFetch.js).
export async function getJobs(params = {}, { signal } = {}) {
  const { data } = await api.get('/jobs', { params: withoutEmptyValues(params), signal })
  return data
}

export async function getJob(id, { signal } = {}) {
  const { data } = await api.get(`/jobs/${id}`, { signal })
  return data.job
}

export async function createJob(job) {
  const { data } = await api.post('/jobs', job)
  return data.job
}

// PUT replaces the whole job, so always send every field.
export async function updateJob(id, job) {
  const { data } = await api.put(`/jobs/${id}`, job)
  return data.job
}

export async function deleteJob(id) {
  await api.delete(`/jobs/${id}`)
}
