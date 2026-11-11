import { useId, useState } from 'react'
import StatusBadge from './StatusBadge.jsx'
import SkillList from './SkillList.jsx'
import ResumeButton from './ResumeButton.jsx'
import Spinner from './Spinner.jsx'
import { getErrorMessage } from '../services/api.js'
import { APPLICATION_STATUSES, STATUS_LABELS } from '../utils/applications.js'
import { formatFullDate, formatPostedDate } from '../utils/jobs.js'

const COVER_NOTE_PREVIEW = 220 // characters shown before "Show more"

// One applicant on the recruiter's applicants page.
// `onStatusChange(id, status)` saves the new status and returns a promise.
export default function ApplicantCard({ application, onStatusChange }) {
  const { applicant, coverNote, status } = application
  const selectId = useId()
  const [isSaving, setIsSaving] = useState(false)
  const [error, setError] = useState('')
  const [showFullNote, setShowFullNote] = useState(false)

  async function handleStatusChange(event) {
    setIsSaving(true)
    setError('')
    try {
      await onStatusChange(application._id, event.target.value)
    } catch (err) {
      setError(getErrorMessage(err, "Couldn't update the status."))
    } finally {
      setIsSaving(false)
    }
  }

  const isLongNote = coverNote.length > COVER_NOTE_PREVIEW
  const visibleNote = isLongNote && !showFullNote ? `${coverNote.slice(0, COVER_NOTE_PREVIEW).trimEnd()}…` : coverNote

  return (
    <article className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
        <div className="min-w-0">
          <div className="flex flex-wrap items-center gap-2">
            <h3 className="font-semibold text-slate-900">{applicant.name}</h3>
            <StatusBadge status={status} />
          </div>
          {applicant.headline && <p className="mt-0.5 text-sm text-slate-700">{applicant.headline}</p>}
          <p className="mt-1 text-sm text-slate-600">
            <a href={`mailto:${applicant.email}`} className="text-indigo-600 hover:text-indigo-700">
              {applicant.email}
            </a>
            {applicant.location && ` · ${applicant.location}`}
          </p>
          <p className="mt-1 text-xs text-slate-500">
            Applied{' '}
            <time dateTime={application.createdAt} title={formatFullDate(application.createdAt)}>
              {formatPostedDate(application.createdAt)}
            </time>
          </p>
        </div>

        <div className="shrink-0 sm:text-right">
          <label htmlFor={selectId} className="block text-xs font-medium text-slate-500">
            Status
          </label>
          <div className="mt-1 flex items-center gap-2 sm:justify-end">
            {isSaving && <Spinner className="h-4 w-4 text-indigo-600" label="Saving status…" />}
            <select
              id={selectId}
              value={status}
              onChange={handleStatusChange}
              disabled={isSaving}
              className="rounded-md border border-slate-300 bg-white py-1.5 pr-8 pl-3 text-sm text-slate-900 shadow-sm focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 focus:outline-none disabled:opacity-60"
            >
              {Object.values(APPLICATION_STATUSES).map((value) => (
                <option key={value} value={value}>
                  {STATUS_LABELS[value]}
                </option>
              ))}
            </select>
          </div>
          {error && (
            <p role="alert" className="mt-1 text-xs text-red-600">
              {error}
            </p>
          )}
        </div>
      </div>

      {applicant.skills?.length > 0 && (
        <div className="mt-3">
          <SkillList skills={applicant.skills} max={8} />
        </div>
      )}

      {coverNote && (
        <div className="mt-4 rounded-lg bg-slate-50 p-3">
          <p className="text-xs font-medium text-slate-500">Cover note</p>
          <p className="mt-1 text-sm whitespace-pre-line text-slate-700">{visibleNote}</p>
          {isLongNote && (
            <button
              type="button"
              onClick={() => setShowFullNote((show) => !show)}
              className="mt-1 text-xs font-medium text-indigo-600 hover:text-indigo-700"
            >
              {showFullNote ? 'Show less' : 'Show more'}
            </button>
          )}
        </div>
      )}

      <div className="mt-4">
        <ResumeButton application={application} />
      </div>
    </article>
  )
}
