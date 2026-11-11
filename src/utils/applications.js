// Application constants and helpers. Values must match the backend.
export const APPLICATION_STATUSES = Object.freeze({
  APPLIED: 'applied',
  SHORTLISTED: 'shortlisted',
  REJECTED: 'rejected',
})

export const STATUS_LABELS = {
  [APPLICATION_STATUSES.APPLIED]: 'Applied',
  [APPLICATION_STATUSES.SHORTLISTED]: 'Shortlisted',
  [APPLICATION_STATUSES.REJECTED]: 'Rejected',
}

export const MAX_RESUME_SIZE_MB = 5
export const COVER_NOTE_MAX = 2000

// 84213 -> "82 KB"
export function formatFileSize(bytes) {
  if (bytes < 1024) return `${bytes} B`
  if (bytes < 1024 * 1024) return `${Math.round(bytes / 1024)} KB`
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`
}

// Quick checks before uploading, so users get instant feedback. The server
// checks again (including the file's actual content).
export function validateResumeFile(file) {
  if (!file) return 'Attach your resume as a PDF'
  const isPdf = file.type === 'application/pdf' || file.name.toLowerCase().endsWith('.pdf')
  if (!isPdf) return 'Resume must be a PDF file'
  if (file.size > MAX_RESUME_SIZE_MB * 1024 * 1024) return `Resume must be ${MAX_RESUME_SIZE_MB} MB or smaller`
  return null
}
