import { useState } from 'react'
import { openPdfInNewTab } from '../services/files.js'
import { getErrorMessage } from '../services/api.js'
import { formatFileSize } from '../utils/applications.js'
import Spinner from './Spinner.jsx'

// "View resume" link-style button. Fetches the PDF (with our auth token) and
// opens it in a new tab. `url` is a resumeUrl from the API, e.g.
// "/api/applications/<id>/resume" or "/api/users/me/resume".
export default function ResumeButton({ url, filename, size, label = 'View resume' }) {
  const [isOpening, setIsOpening] = useState(false)
  const [error, setError] = useState('')

  async function handleClick() {
    setIsOpening(true)
    setError('')
    try {
      await openPdfInNewTab(url, filename)
    } catch (err) {
      setError(getErrorMessage(err, "Couldn't open the resume."))
    } finally {
      setIsOpening(false)
    }
  }

  return (
    <span className="inline-flex flex-col items-start">
      <button
        type="button"
        onClick={handleClick}
        disabled={isOpening}
        className="inline-flex items-center gap-1.5 text-sm font-medium text-indigo-600 hover:text-indigo-700 disabled:opacity-60"
        title={filename}
      >
        {isOpening ? <Spinner className="h-3.5 w-3.5" label="Opening resume…" /> : <span aria-hidden="true">📄</span>}
        {label}
        {size !== undefined && <span className="font-normal text-slate-500">({formatFileSize(size)})</span>}
      </button>
      {error && (
        <span role="alert" className="mt-1 text-xs text-red-600">
          {error}
        </span>
      )}
    </span>
  )
}
