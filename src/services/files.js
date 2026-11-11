// Opening private files (resumes) that the API only serves with our login token.
import api, { API_URL } from './api.js'

// A plain <a href> link wouldn't send the Authorization header, so we download
// the file with Axios as a Blob (raw file data) instead.
async function fetchProtectedFile(apiPath) {
  try {
    // apiPath comes from the server, e.g. "/api/users/me/resume". A full URL
    // makes Axios skip its "/api" baseURL so the path isn't doubled.
    const { data } = await api.get(`${API_URL}${apiPath}`, { responseType: 'blob', timeout: 60_000 })
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

// Opens a protected PDF in a new browser tab.
export async function openPdfInNewTab(apiPath, filename) {
  // Open the tab right away, during the click. Pop-up blockers allow that,
  // but may block a tab opened later, after the download finishes.
  const tab = window.open('', '_blank')
  try {
    const blob = await fetchProtectedFile(apiPath)
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
