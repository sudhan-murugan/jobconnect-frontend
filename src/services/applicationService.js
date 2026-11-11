// Functions for applying to jobs and managing applications.
import api from './api.js'

// Uploading a file can take a while on a slow connection, so allow more time
// than the default 10 s request timeout.
export const UPLOAD_TIMEOUT_MS = 60_000

// Files can't be sent as JSON. FormData builds a multipart/form-data body (the
// format HTML forms use for uploads); the browser sets the Content-Type for us.
// Pass either `resume` (a File) or `useProfileResume: true`.
// `onUploadProgress` is called repeatedly with { loaded, total } bytes.
export async function applyToJob(jobId, { resume, useProfileResume, coverNote }, { onUploadProgress } = {}) {
  const formData = new FormData()
  if (resume) formData.append('resume', resume)
  else if (useProfileResume) formData.append('useProfileResume', 'true')
  if (coverNote) formData.append('coverNote', coverNote)

  const { data } = await api.post(`/jobs/${jobId}/apply`, formData, {
    timeout: UPLOAD_TIMEOUT_MS,
    onUploadProgress,
  })
  return data.application
}

// The logged-in job seeker's applications. Pass { jobId } to check one job.
// Returns { applications, counts }.
export async function getMyApplications({ jobId } = {}, { signal } = {}) {
  const { data } = await api.get('/applications/me', { params: jobId ? { job: jobId } : {}, signal })
  return data
}

// A job's applicants (recruiter who owns the job). Returns { job, applications, counts }.
export async function getJobApplications(jobId, { signal } = {}) {
  const { data } = await api.get(`/jobs/${jobId}/applications`, { signal })
  return data
}

export async function updateApplicationStatus(applicationId, status) {
  const { data } = await api.patch(`/applications/${applicationId}/status`, { status })
  return data.application
}
