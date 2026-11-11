// Functions for applying to jobs and managing applications.
import api from './api.js'

// Uploading a file can take a while on a slow connection, so allow more time
// than the default 10 s request timeout.
const UPLOAD_TIMEOUT_MS = 60_000

// Files can't be sent as JSON. FormData builds a multipart/form-data body (the
// format HTML forms use for uploads); the browser sets the Content-Type for us.
// `onUploadProgress` is called repeatedly with { loaded, total } bytes.
export async function applyToJob(jobId, { resume, coverNote }, { onUploadProgress } = {}) {
  const formData = new FormData()
  formData.append('resume', resume)
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

// Downloads a resume as a Blob (raw file data). The API requires our auth
// header, so a plain <a href> link wouldn't work: the browser wouldn't send it.
async function fetchResume(applicationId) {
  try {
    const { data } = await api.get(`/applications/${applicationId}/resume`, {
      responseType: 'blob',
      timeout: UPLOAD_TIMEOUT_MS,
    })
    return data
  } catch (error) {
    // With responseType 'blob', error bodies arrive as a Blob too; turn the
    // JSON error back into an object so getErrorMessage() can read it.
    if (error.response?.data instanceof Blob) {
      try {
        error.response.data = JSON.parse(await error.response.data.text())
      } catch {
        // not JSON: keep the generic message
      }
    }
    throw error
  }
}

// Opens a resume PDF in a new browser tab.
export async function openResume(applicationId, filename) {
  // Open the tab right away, during the click. Pop-up blockers allow that,
  // but may block a tab opened later, after the download finishes.
  const tab = window.open('', '_blank')
  try {
    const blob = await fetchResume(applicationId)
    // An object URL is a temporary local address for in-memory data.
    const url = URL.createObjectURL(blob)
    if (tab) {
      tab.location.href = url
    } else {
      // Pop-up blocked: download the file instead.
      const link = Object.assign(document.createElement('a'), { href: url, download: filename })
      link.click()
    }
    // Free the memory once the tab has had time to load the file.
    setTimeout(() => URL.revokeObjectURL(url), 60_000)
  } catch (error) {
    tab?.close()
    throw error
  }
}
