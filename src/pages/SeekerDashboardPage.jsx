import { useCallback } from 'react'
import { Link } from 'react-router'
import { getMyApplications } from '../services/applicationService.js'
import { useFetch } from '../hooks/useFetch.js'
import { useDocumentTitle } from '../hooks/useDocumentTitle.js'
import { useAuth } from '../hooks/useAuth.js'
import { formatFullDate, formatPostedDate } from '../utils/jobs.js'
import DashboardHeader from '../components/DashboardHeader.jsx'
import StatusBadge from '../components/StatusBadge.jsx'
import ResumeButton from '../components/ResumeButton.jsx'
import Alert from '../components/Alert.jsx'
import { PageLoader } from '../components/Spinner.jsx'
import { EmptyState, ErrorState } from '../components/StatusMessage.jsx'

const STATS = [
  { key: 'total', label: 'Applications' },
  { key: 'applied', label: 'In review' },
  { key: 'shortlisted', label: 'Shortlisted' },
  { key: 'rejected', label: 'Not selected' },
]

// Job seeker home: every job they applied to and where each application stands.
export default function SeekerDashboardPage() {
  useDocumentTitle('Dashboard')
  const { user } = useAuth()

  // No inputs, so the fetcher never changes and loads once on mount.
  const fetchApplications = useCallback((signal) => getMyApplications({}, { signal }), [])
  const { data, error, reload } = useFetch(fetchApplications)

  return (
    <div className="space-y-8">
      <DashboardHeader subtitle="Track the jobs you've applied to." />

      {/* Nudge: a saved resume makes applying a one-click action. */}
      {!user.resume && (
        <Alert type="info">
          Add a resume to your profile to apply in one click.{' '}
          <Link to="/profile" className="font-semibold underline hover:no-underline">
            Go to your profile
          </Link>
        </Alert>
      )}

      {error ? (
        <ErrorState error={error} onRetry={reload} title="We couldn't load your applications" />
      ) : !data ? (
        <PageLoader label="Loading your applications…" />
      ) : (
        <>
          <dl className="grid grid-cols-2 gap-3 sm:grid-cols-4">
            {STATS.map(({ key, label }) => (
              <div key={key} className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm">
                <dt className="text-sm text-slate-500">{label}</dt>
                <dd className="mt-1 text-2xl font-semibold text-slate-900">{data.counts[key]}</dd>
              </div>
            ))}
          </dl>

          <section className="space-y-3">
            <h2 className="text-lg font-semibold text-slate-900">My applications</h2>

            {data.applications.length === 0 ? (
              <EmptyState
                title="You haven't applied to any jobs yet"
                action={
                  <Link
                    to="/jobs"
                    className="inline-flex rounded-md bg-indigo-600 px-4 py-2 text-sm font-semibold text-white hover:bg-indigo-700"
                  >
                    Browse jobs
                  </Link>
                }
              >
                Find a role you like and apply with your resume.
              </EmptyState>
            ) : (
              <ul className="divide-y divide-slate-200 rounded-xl border border-slate-200 bg-white shadow-sm">
                {data.applications.map((application) => (
                  <li
                    key={application._id}
                    className="flex flex-col gap-3 p-4 sm:flex-row sm:items-center sm:justify-between"
                  >
                    <div className="min-w-0">
                      <div className="flex flex-wrap items-center gap-2">
                        <Link
                          to={`/jobs/${application.job._id}`}
                          className="font-semibold text-slate-900 hover:text-indigo-700"
                        >
                          {application.job.title}
                        </Link>
                        <StatusBadge status={application.status} />
                      </div>
                      <p className="mt-0.5 text-sm text-slate-600">
                        {application.job.company} · {application.job.location} · applied{' '}
                        <time dateTime={application.createdAt} title={formatFullDate(application.createdAt)}>
                          {formatPostedDate(application.createdAt)}
                        </time>
                      </p>
                    </div>
                    <div className="shrink-0">
                      <ResumeButton
                        url={application.resumeUrl}
                        filename={application.resume.filename}
                        size={application.resume.size}
                      />
                    </div>
                  </li>
                ))}
              </ul>
            )}
          </section>
        </>
      )}
    </div>
  )
}
