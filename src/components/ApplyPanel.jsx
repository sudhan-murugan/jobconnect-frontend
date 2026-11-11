import { useCallback, useState } from 'react'
import { Link } from 'react-router'
import { getMyApplications } from '../services/applicationService.js'
import { useFetch } from '../hooks/useFetch.js'
import { formatFullDate, formatPostedDate } from '../utils/jobs.js'
import ApplyDialog from './ApplyDialog.jsx'
import StatusBadge from './StatusBadge.jsx'
import Button from './Button.jsx'
import Alert from './Alert.jsx'
import Spinner from './Spinner.jsx'

// Job page sidebar section for job seekers: "Apply now", or the status of the
// application they already sent.
export default function ApplyPanel({ job }) {
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [newApplication, setNewApplication] = useState(null)

  // Has this user already applied? (?job= returns 0 or 1 application.)
  const fetchExisting = useCallback(
    (signal) => getMyApplications({ jobId: job._id }, { signal }).then((data) => data.applications[0] ?? null),
    [job._id],
  )
  const { data: existing, error, isLoading } = useFetch(fetchExisting)
  const application = newApplication ?? existing

  function handleApplied(created) {
    setNewApplication(created)
    setIsDialogOpen(false)
  }

  if (isLoading) {
    return (
      <div className="flex justify-center py-2 text-indigo-600">
        <Spinner label="Checking your application…" />
      </div>
    )
  }

  if (application) {
    return (
      <div className="space-y-3">
        {newApplication && <Alert type="success">Application sent! The recruiter will review it soon.</Alert>}
        <div className="rounded-lg bg-slate-50 p-3 text-sm">
          <div className="flex items-center justify-between gap-2">
            <span className="font-medium text-slate-900">✓ You applied</span>
            <StatusBadge status={application.status} />
          </div>
          <p className="mt-1 text-slate-600">
            <time dateTime={application.createdAt} title={formatFullDate(application.createdAt)}>
              {formatPostedDate(application.createdAt)}
            </time>
          </p>
        </div>
        <Link
          to="/seeker/dashboard"
          className="block text-center text-sm font-medium text-indigo-600 hover:text-indigo-700"
        >
          Track your applications →
        </Link>
      </div>
    )
  }

  return (
    <>
      {/* If the check failed we still allow applying; the API rejects duplicates. */}
      {error && <p className="mb-2 text-xs text-slate-500">Couldn't check for an earlier application.</p>}
      <Button className="w-full" onClick={() => setIsDialogOpen(true)}>
        Apply now
      </Button>
      <ApplyDialog job={job} open={isDialogOpen} onClose={() => setIsDialogOpen(false)} onApplied={handleApplied} />
    </>
  )
}
