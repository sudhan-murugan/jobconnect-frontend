import { useRef, useState } from 'react'
import Button from './Button.jsx'
import Alert from './Alert.jsx'
import ConfirmDialog from './ConfirmDialog.jsx'
import ResumeButton from './ResumeButton.jsx'
import { deleteProfileResume, uploadProfileResume } from '../services/userService.js'
import { getErrorMessage, getFieldErrors } from '../services/api.js'
import { MAX_RESUME_SIZE_MB, validateResumeFile } from '../utils/applications.js'
import { formatPostedDate } from '../utils/jobs.js'

// Upload, view, replace or remove the resume saved on a job seeker's profile.
// `onUserChange(user)` receives the updated user from the API.
export default function ProfileResumeCard({ user, onUserChange }) {
  // A hidden file input, opened by our own styled button.
  const fileInputRef = useRef(null)
  const [progress, setProgress] = useState(null) // upload % while sending
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')
  const [isConfirmingRemove, setIsConfirmingRemove] = useState(false)
  const [isRemoving, setIsRemoving] = useState(false)
  const [removeError, setRemoveError] = useState('')

  const resume = user.resume
  const isUploading = progress !== null

  async function handleFileChange(event) {
    const file = event.target.files[0]
    event.target.value = '' // so choosing the same file again still triggers onChange
    if (!file) return

    setSuccess('')
    const problem = validateResumeFile(file)
    if (problem) {
      setError(problem)
      return
    }

    setError('')
    setProgress(0)
    try {
      const updated = await uploadProfileResume(file, {
        onUploadProgress: ({ loaded, total }) => total && setProgress(Math.round((loaded / total) * 100)),
      })
      onUserChange(updated)
      setSuccess(resume ? 'Resume replaced.' : 'Resume uploaded.')
    } catch (err) {
      setError(getFieldErrors(err).resume ?? getErrorMessage(err))
    } finally {
      setProgress(null)
    }
  }

  async function handleRemove() {
    setIsRemoving(true)
    setRemoveError('')
    try {
      onUserChange(await deleteProfileResume())
      setIsConfirmingRemove(false)
      setSuccess('Resume removed.')
    } catch (err) {
      setRemoveError(getErrorMessage(err))
    } finally {
      setIsRemoving(false)
    }
  }

  return (
    <div className="space-y-4">
      {error && <Alert>{error}</Alert>}
      {success && <Alert type="success">{success}</Alert>}

      <input
        ref={fileInputRef}
        type="file"
        accept="application/pdf,.pdf"
        onChange={handleFileChange}
        className="sr-only"
        aria-label="Choose a PDF resume"
        tabIndex={-1}
      />

      {resume ? (
        <div className="flex flex-col gap-4 rounded-lg border border-slate-200 p-4 sm:flex-row sm:items-center sm:justify-between">
          <div className="min-w-0">
            <p className="truncate font-medium text-slate-900" title={resume.filename}>
              {resume.filename}
            </p>
            <p className="text-sm text-slate-500">Uploaded {formatPostedDate(resume.uploadedAt)}</p>
            <div className="mt-1">
              <ResumeButton url={user.resumeUrl} filename={resume.filename} size={resume.size} label="View" />
            </div>
          </div>
          <div className="flex shrink-0 gap-2">
            <Button
              variant="secondary"
              onClick={() => fileInputRef.current.click()}
              isLoading={isUploading}
              loadingText={`Uploading… ${progress ?? 0}%`}
            >
              Replace
            </Button>
            <Button variant="danger-outline" onClick={() => setIsConfirmingRemove(true)} disabled={isUploading}>
              Remove
            </Button>
          </div>
        </div>
      ) : (
        <div className="rounded-lg border border-dashed border-slate-300 p-6 text-center">
          <p className="font-medium text-slate-900">No resume yet</p>
          <p className="mt-1 text-sm text-slate-600">
            Save a resume here to apply to jobs in one click. PDF only, up to {MAX_RESUME_SIZE_MB} MB.
          </p>
          <Button
            className="mt-4"
            onClick={() => fileInputRef.current.click()}
            isLoading={isUploading}
            loadingText={`Uploading… ${progress ?? 0}%`}
          >
            Upload resume
          </Button>
        </div>
      )}

      <p className="text-xs text-slate-500">
        Applications you've already sent keep the resume they were sent with.
      </p>

      <ConfirmDialog
        open={isConfirmingRemove}
        title="Remove your resume?"
        confirmLabel="Remove resume"
        confirmingLabel="Removing…"
        isConfirming={isRemoving}
        error={removeError}
        onConfirm={handleRemove}
        onCancel={() => {
          setIsConfirmingRemove(false)
          setRemoveError('')
        }}
      >
        You'll need to upload a resume again before applying. Applications you've already sent are not affected.
      </ConfirmDialog>
    </div>
  )
}
