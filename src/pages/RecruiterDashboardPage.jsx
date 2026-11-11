import { useCallback, useState } from 'react'
import { Link, useSearchParams } from 'react-router'
import { getMyJobs } from '../services/jobService.js'
import { useFetch } from '../hooks/useFetch.js'
import { useDocumentTitle } from '../hooks/useDocumentTitle.js'
import { useFlashMessage } from '../hooks/useFlashMessage.js'
import { formatFullDate, formatPostedDate } from '../utils/jobs.js'
import DashboardHeader from '../components/DashboardHeader.jsx'
import JobTypeBadge from '../components/JobTypeBadge.jsx'
import Pagination from '../components/Pagination.jsx'
import DeleteJobDialog from '../components/DeleteJobDialog.jsx'
import Alert from '../components/Alert.jsx'
import { PageLoader } from '../components/Spinner.jsx'
import { EmptyState, ErrorState } from '../components/StatusMessage.jsx'

const PAGE_SIZE = 20
const PRIMARY_LINK =
  'inline-flex items-center justify-center rounded-md bg-indigo-600 px-4 py-2 text-sm font-semibold text-white shadow-sm hover:bg-indigo-700'
const ACTION_LINK = 'rounded-md px-2.5 py-1.5 text-sm font-medium hover:bg-slate-100'

// { total: 3, shortlisted: 1, ... } -> "3 applicants · 1 shortlisted"
function formatApplicantCounts({ total, shortlisted }) {
  if (total === 0) return 'No applicants yet'
  const applicants = `${total} ${total === 1 ? 'applicant' : 'applicants'}`
  return shortlisted > 0 ? `${applicants} · ${shortlisted} shortlisted` : applicants
}

// Recruiter home: the jobs they posted, with applicant counts, edit and delete.
export default function RecruiterDashboardPage() {
  useDocumentTitle('Dashboard')
  const flash = useFlashMessage() // e.g. "Job deleted." after deleting from the job page
  const [searchParams] = useSearchParams()
  const page = Math.max(1, Number.parseInt(searchParams.get('page'), 10) || 1)

  const [jobToDelete, setJobToDelete] = useState(null)
  const [deletedTitle, setDeletedTitle] = useState('')

  // GET /api/jobs/mine: this recruiter's jobs, each with applicationCounts.
  const fetchMyJobs = useCallback(
    (signal) => getMyJobs({ page, limit: PAGE_SIZE }, { signal }),
    [page],
  )
  const { data, error, isLoading, reload } = useFetch(fetchMyJobs)

  function handleDeleted(job) {
    setJobToDelete(null)
    setDeletedTitle(job.title)
    reload()
  }

  const jobs = data?.jobs ?? []

  return (
    <div className="space-y-8">
      <div className="flex flex-wrap items-end justify-between gap-4">
        <DashboardHeader subtitle="Manage your job posts and applicants." />
        <Link to="/recruiter/jobs/new" className={PRIMARY_LINK}>
          + Post a job
        </Link>
      </div>

      {flash && !deletedTitle && <Alert type="success">{flash}</Alert>}
      {deletedTitle && <Alert type="success">Deleted “{deletedTitle}”.</Alert>}

      <section className="space-y-3">
        <h2 className="text-lg font-semibold text-slate-900">
          My job posts {data && <span className="font-normal text-slate-500">({data.pagination.total})</span>}
        </h2>

        {error ? (
          <ErrorState error={error} onRetry={reload} title="We couldn't load your jobs" />
        ) : !data ? (
          <PageLoader label="Loading your jobs…" />
        ) : jobs.length === 0 ? (
          <EmptyState
            title={page > 1 ? 'No jobs on this page' : "You haven't posted any jobs yet"}
            action={
              <Link to={page > 1 ? '?' : '/recruiter/jobs/new'} className={PRIMARY_LINK}>
                {page > 1 ? 'Go to first page' : 'Post your first job'}
              </Link>
            }
          >
            {page > 1 ? null : 'Jobs you post will appear here.'}
          </EmptyState>
        ) : (
          <ul
            aria-busy={isLoading}
            className={`divide-y divide-slate-200 rounded-xl border border-slate-200 bg-white shadow-sm ${isLoading ? 'opacity-60' : ''}`}
          >
            {jobs.map((job) => (
              <li key={job._id} className="flex flex-col gap-3 p-4 sm:flex-row sm:items-center sm:justify-between">
                <div className="min-w-0">
                  <div className="flex flex-wrap items-center gap-2">
                    <Link to={`/jobs/${job._id}`} className="font-semibold text-slate-900 hover:text-indigo-700">
                      {job.title}
                    </Link>
                    <JobTypeBadge jobType={job.jobType} />
                  </div>
                  <p className="mt-0.5 text-sm text-slate-600">
                    {job.company} · {job.location} ·{' '}
                    <time dateTime={job.createdAt} title={formatFullDate(job.createdAt)}>
                      posted {formatPostedDate(job.createdAt)}
                    </time>
                  </p>
                  <Link
                    to={`/recruiter/jobs/${job._id}/applicants`}
                    className="mt-1 inline-block text-sm font-medium text-indigo-600 hover:text-indigo-700"
                  >
                    {formatApplicantCounts(job.applicationCounts)}
                  </Link>
                </div>
                <div className="flex shrink-0 gap-1">
                  <Link to={`/recruiter/jobs/${job._id}/applicants`} className={`${ACTION_LINK} text-slate-700`}>
                    Applicants
                  </Link>
                  <Link to={`/recruiter/jobs/${job._id}/edit`} className={`${ACTION_LINK} text-indigo-700`}>
                    Edit
                  </Link>
                  <button type="button" onClick={() => setJobToDelete(job)} className={`${ACTION_LINK} text-red-700`}>
                    Delete
                  </button>
                </div>
              </li>
            ))}
          </ul>
        )}

        {data && (
          <Pagination
            page={page}
            totalPages={data.pagination.totalPages}
            getPageLink={(n) => (n > 1 ? `?page=${n}` : '?')}
          />
        )}
      </section>

      <DeleteJobDialog
        key={jobToDelete?._id}
        job={jobToDelete}
        onClose={() => setJobToDelete(null)}
        onDeleted={handleDeleted}
      />
    </div>
  )
}
