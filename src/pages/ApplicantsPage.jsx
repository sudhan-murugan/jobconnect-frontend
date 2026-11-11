import { useCallback, useState } from 'react'
import { Link, useParams, useSearchParams } from 'react-router'
import { getJobApplications, updateApplicationStatus } from '../services/applicationService.js'
import { useFetch } from '../hooks/useFetch.js'
import { useDocumentTitle } from '../hooks/useDocumentTitle.js'
import { APPLICATION_STATUSES, STATUS_LABELS } from '../utils/applications.js'
import ApplicantCard from '../components/ApplicantCard.jsx'
import FilterPills from '../components/FilterPills.jsx'
import ForbiddenPage from './ForbiddenPage.jsx'
import { PageLoader } from '../components/Spinner.jsx'
import { EmptyState, ErrorState } from '../components/StatusMessage.jsx'

// Recruiter view of everyone who applied to one of their jobs.
export default function ApplicantsPage() {
  const { id } = useParams()
  const [searchParams, setSearchParams] = useSearchParams()
  const statusFilter = Object.values(APPLICATION_STATUSES).includes(searchParams.get('status'))
    ? searchParams.get('status')
    : ''

  const fetchApplicants = useCallback((signal) => getJobApplications(id, { signal }), [id])
  const { data, error, isLoading, reload } = useFetch(fetchApplicants)

  // Statuses changed on this page since the list loaded: { [applicationId]: status }.
  // Merging them over the fetched list updates the UI without refetching everything.
  const [statusUpdates, setStatusUpdates] = useState({})

  useDocumentTitle(data && !isLoading ? `Applicants: ${data.job.title}` : 'Applicants')

  async function handleStatusChange(applicationId, status) {
    const updated = await updateApplicationStatus(applicationId, status)
    setStatusUpdates((prev) => ({ ...prev, [applicationId]: updated.status }))
  }

  const backLink = (
    <Link to="/recruiter/dashboard" className="inline-block text-sm font-medium text-indigo-600 hover:text-indigo-700">
      ← Back to dashboard
    </Link>
  )

  if (isLoading) return <PageLoader label="Loading applicants…" />
  if (error) {
    const status = error.response?.status
    if (status === 403) return <ForbiddenPage />
    if (status === 404 || status === 400) {
      return (
        <div className="space-y-4">
          {backLink}
          <EmptyState title="Job not found">It may have been deleted.</EmptyState>
        </div>
      )
    }
    return <ErrorState error={error} onRetry={reload} title="We couldn't load the applicants" />
  }

  const applications = data.applications.map((application) =>
    statusUpdates[application._id] ? { ...application, status: statusUpdates[application._id] } : application,
  )
  const countFor = (status) => applications.filter((application) => application.status === status).length
  const filterOptions = [{ value: '', label: 'All', count: applications.length }].concat(
    Object.values(APPLICATION_STATUSES).map((status) => ({
      value: status,
      label: STATUS_LABELS[status],
      count: countFor(status),
    })),
  )
  const visible = statusFilter
    ? applications.filter((application) => application.status === statusFilter)
    : applications

  return (
    <div className="space-y-6">
      {backLink}

      <header>
        <h1 className="text-2xl font-bold text-slate-900 sm:text-3xl">Applicants</h1>
        <p className="mt-1 text-slate-600">
          <Link to={`/jobs/${data.job._id}`} className="font-medium text-slate-900 hover:text-indigo-700">
            {data.job.title}
          </Link>{' '}
          · {data.job.company} · {data.job.location}
        </p>
      </header>

      {applications.length === 0 ? (
        <EmptyState title="No applicants yet">Applications for this job will appear here.</EmptyState>
      ) : (
        <>
          <FilterPills
            label="Filter by status"
            options={filterOptions}
            value={statusFilter}
            onChange={(value) => setSearchParams(value ? { status: value } : {}, { replace: true })}
          />

          {visible.length === 0 ? (
            <EmptyState title={`No ${STATUS_LABELS[statusFilter].toLowerCase()} applicants`} />
          ) : (
            <ul className="space-y-3">
              {visible.map((application) => (
                <li key={application._id}>
                  <ApplicantCard application={application} onStatusChange={handleStatusChange} />
                </li>
              ))}
            </ul>
          )}
        </>
      )}
    </div>
  )
}
