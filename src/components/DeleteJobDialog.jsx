import { useState } from 'react'
import ConfirmDialog from './ConfirmDialog.jsx'
import { deleteJob } from '../services/jobService.js'
import { getErrorMessage } from '../services/api.js'

// Asks to confirm, then deletes `job`. Open when `job` is set.
// Parents should pass key={job?._id} so the error resets for each job.
export default function DeleteJobDialog({ job, onClose, onDeleted }) {
  const [isDeleting, setIsDeleting] = useState(false)
  const [error, setError] = useState('')

  async function handleConfirm() {
    setIsDeleting(true)
    setError('')
    try {
      await deleteJob(job._id)
      onDeleted(job)
    } catch (err) {
      setError(getErrorMessage(err))
      setIsDeleting(false)
    }
  }

  return (
    <ConfirmDialog
      open={Boolean(job)}
      title="Delete this job?"
      confirmLabel="Delete job"
      confirmingLabel="Deleting…"
      isConfirming={isDeleting}
      error={error}
      onConfirm={handleConfirm}
      onCancel={onClose}
    >
      <strong className="font-medium text-slate-900">{job?.title}</strong> will be removed permanently.
      This can't be undone.
    </ConfirmDialog>
  )
}
