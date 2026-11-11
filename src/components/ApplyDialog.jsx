import { useState } from 'react'
import Modal from './Modal.jsx'
import FormField from './FormField.jsx'
import Button from './Button.jsx'
import Alert from './Alert.jsx'
import { applyToJob } from '../services/applicationService.js'
import { getErrorMessage, getFieldErrors } from '../services/api.js'
import { COVER_NOTE_MAX, MAX_RESUME_SIZE_MB, validateResumeFile } from '../utils/applications.js'

// The form inside the dialog. Modal only renders it while open, so every time
// the dialog opens, the form starts empty.
function ApplyForm({ jobId, onCancel, onApplied, onSubmittingChange }) {
  const [resume, setResume] = useState(null) // a File object from the file input
  const [coverNote, setCoverNote] = useState('')
  const [fieldErrors, setFieldErrors] = useState({})
  const [error, setError] = useState('')
  const [progress, setProgress] = useState(null) // upload % while sending

  function handleFileChange(event) {
    // A file input's chosen files are in event.target.files (a list).
    const file = event.target.files[0] ?? null
    setResume(file)
    setFieldErrors((prev) => ({ ...prev, resume: file ? (validateResumeFile(file) ?? undefined) : undefined }))
  }

  async function handleSubmit(event) {
    event.preventDefault()
    setError('')

    const resumeError = validateResumeFile(resume)
    if (resumeError) {
      setFieldErrors({ resume: resumeError })
      return
    }

    onSubmittingChange(true)
    setProgress(0)
    try {
      const application = await applyToJob(
        jobId,
        { resume, coverNote: coverNote.trim() },
        { onUploadProgress: ({ loaded, total }) => total && setProgress(Math.round((loaded / total) * 100)) },
      )
      onApplied(application)
    } catch (err) {
      const apiErrors = getFieldErrors(err)
      setFieldErrors(apiErrors)
      setError(Object.keys(apiErrors).length > 0 ? '' : getErrorMessage(err))
      setProgress(null)
    } finally {
      onSubmittingChange(false)
    }
  }

  const isSubmitting = progress !== null

  return (
    <form onSubmit={handleSubmit} className="mt-4 space-y-4">
      {error && <Alert>{error}</Alert>}

      <FormField
        label="Resume (PDF)"
        name="resume"
        type="file"
        accept="application/pdf,.pdf"
        onChange={handleFileChange}
        disabled={isSubmitting}
        error={fieldErrors.resume}
        hint={`PDF only, up to ${MAX_RESUME_SIZE_MB} MB.`}
        inputClassName="file:mr-3 file:rounded-md file:border-0 file:bg-indigo-50 file:px-3 file:py-1.5 file:text-sm file:font-medium file:text-indigo-700 hover:file:bg-indigo-100"
      />

      <FormField
        as="textarea"
        label="Cover note (optional)"
        name="coverNote"
        rows={5}
        maxLength={COVER_NOTE_MAX}
        placeholder="Why are you a good fit for this role?"
        value={coverNote}
        onChange={(event) => setCoverNote(event.target.value)}
        disabled={isSubmitting}
        error={fieldErrors.coverNote}
        hint={`${coverNote.length} / ${COVER_NOTE_MAX} characters`}
      />

      <div className="flex flex-col-reverse gap-2 pt-2 sm:flex-row sm:justify-end">
        <Button variant="secondary" onClick={onCancel} disabled={isSubmitting}>
          Cancel
        </Button>
        <Button type="submit" isLoading={isSubmitting} loadingText={`Sending… ${progress ?? 0}%`}>
          Submit application
        </Button>
      </div>
    </form>
  )
}

// "Apply for this job" dialog: resume upload + optional cover note.
export default function ApplyDialog({ job, open, onClose, onApplied }) {
  // Tracked here so the dialog can't be closed (Esc) mid-upload.
  const [isSubmitting, setIsSubmitting] = useState(false)

  return (
    <Modal open={open} title={`Apply: ${job.title}`} onClose={onClose} canClose={!isSubmitting}>
      <p className="mt-1 text-sm text-slate-600">
        {job.company} · {job.location}
      </p>
      <ApplyForm jobId={job._id} onCancel={onClose} onApplied={onApplied} onSubmittingChange={setIsSubmitting} />
    </Modal>
  )
}
