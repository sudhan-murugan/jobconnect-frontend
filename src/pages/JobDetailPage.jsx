import { useCallback, useState } from 'react'
import { Link, useLocation, useNavigate, useParams } from 'react-router'
import { getJob } from '../services/jobService.js'
import { useFetch } from '../hooks/useFetch.js'
import { useAuth } from '../hooks/useAuth.js'
import { useDocumentTitle } from '../hooks/useDocumentTitle.js'
import { useFlashMessage } from '../hooks/useFlashMessage.js'
import { ROLES } from '../utils/roles.js'
import { formatFullDate, formatPostedDate, formatSalary, JOB_TYPE_LABELS } from '../utils/jobs.js'
import JobTypeBadge from '../components/JobTypeBadge.jsx'
import SkillList from '../components/SkillList.jsx'
import Alert from '../components/Alert.jsx'
import Button from '../components/Button.jsx'
import DeleteJobDialog from '../components/DeleteJobDialog.jsx'
import ApplyPanel from '../components/ApplyPanel.jsx'
import { PageLoader } from '../components/Spinner.jsx'
import { EmptyState, ErrorState } from '../components/StatusMessage.jsx'

const LINK_BUTTON =
  'inline-flex w-full items-center justify-center rounded-md px-4 py-2 text-sm font-semibold shadow-sm'

export default function JobDetailPage() {
  // useParams reads the dynamic part of the URL: /jobs/:id -> { id }
  const { id } = useParams()
  const { user } = useAuth()
  const location = useLocation()
  const navigate = useNavigate()
  const flash = useFlashMessage()
  const [jobToDelete, setJobToDelete] = useState(null)

  const fetchJob = useCallback((signal) => getJob(id, { signal }), [id])
  const { data: job, error, isLoading, reload } = useFetch(fetchJob)
  useDocumentTitle(job && !isLoading ? job.title : 'Job')

  // JobCard passes the search the user came from; fall back to all jobs.
  const backTo = location.state?.backTo ?? '/jobs'
  const backLink = (
    // inline-block: vertical spacing (space-y-*) doesn't apply to inline elements like <a>.
    <Link to={backTo} className="inline-block text-sm font-medium text-indigo-600 hover:text-indigo-700">
      ← Back to jobs
    </Link>
  )

  if (isLoading) return <PageLoader label="Loading job…" />

  if (error) {
    const status = error.response?.status
    // 400 = malformed id, 404 = no such job: both mean "not found" to the user.
    if (status === 404 || status === 400) {
      return (
        <div className="space-y-4">
          {backLink}
          <EmptyState title="Job not found">This job may have been filled or removed.</EmptyState>
        </div>
      )
    }
    return <ErrorState error={error} onRetry={reload} title="We couldn't load this job" />
  }

  const isOwner = user?._id === job.postedBy?._id
  const salary = formatSalary(job.salaryRange)

  return (
    <div className="space-y-6">
      {backLink}
      {flash && <Alert type="success">{flash}</Alert>}

      <div className="grid gap-6 lg:grid-cols-[1fr_20rem]">
        <article className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm sm:p-8">
          <header className="border-b border-slate-200 pb-6">
            <JobTypeBadge jobType={job.jobType} />
            <h1 className="mt-3 text-2xl font-bold text-slate-900 sm:text-3xl">{job.title}</h1>
            <p className="mt-1 text-slate-600">
              {job.company} · {job.location}
            </p>
          </header>

          <section className="pt-6">
            <h2 className="font-semibold text-slate-900">About the role</h2>
            {/* Plain text with line breaks kept (whitespace-pre-line). React
                escapes the text, so a description can't inject HTML/scripts. */}
            <p className="mt-2 leading-relaxed whitespace-pre-line text-slate-700">{job.description}</p>
          </section>

          {job.skills.length > 0 && (
            <section className="pt-6">
              <h2 className="font-semibold text-slate-900">Skills</h2>
              <div className="mt-2">
                <SkillList skills={job.skills} />
              </div>
            </section>
          )}
        </article>

        <aside className="space-y-4">
          <div className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
            <dl className="space-y-3 text-sm">
              <div>
                <dt className="text-slate-500">Salary</dt>
                <dd className="font-medium text-slate-900">{salary ?? 'Not specified'}</dd>
              </div>
              <div>
                <dt className="text-slate-500">Job type</dt>
                <dd className="font-medium text-slate-900">{JOB_TYPE_LABELS[job.jobType]}</dd>
              </div>
              <div>
                <dt className="text-slate-500">Location</dt>
                <dd className="font-medium text-slate-900">{job.location}</dd>
              </div>
              <div>
                <dt className="text-slate-500">Posted</dt>
                <dd className="font-medium text-slate-900">
                  <time dateTime={job.createdAt} title={formatFullDate(job.createdAt)}>
                    {formatPostedDate(job.createdAt)}
                  </time>
                  {job.postedBy?.name && <span className="font-normal text-slate-600"> by {job.postedBy.name}</span>}
                </dd>
              </div>
            </dl>

            <div className="mt-6 space-y-2">
              {isOwner ? (
                <>
                  <Link
                    to={`/recruiter/jobs/${job._id}/applicants`}
                    className={`${LINK_BUTTON} bg-indigo-600 text-white hover:bg-indigo-700`}
                  >
                    View applicants
                  </Link>
                  <Link
                    to={`/recruiter/jobs/${job._id}/edit`}
                    className={`${LINK_BUTTON} bg-white text-slate-700 ring-1 ring-slate-300 ring-inset hover:bg-slate-50`}
                  >
                    Edit job
                  </Link>
                  <Button variant="danger-outline" className="w-full" onClick={() => setJobToDelete(job)}>
                    Delete job
                  </Button>
                </>
              ) : !user ? (
                // Logged-out visitors: log in, then come straight back to this job.
                <Link
                  to="/login"
                  state={{ from: location }}
                  className={`${LINK_BUTTON} bg-indigo-600 text-white hover:bg-indigo-700`}
                >
                  Log in to apply
                </Link>
              ) : user.role === ROLES.JOB_SEEKER ? (
                <ApplyPanel job={job} />
              ) : null}
            </div>
          </div>
        </aside>
      </div>

      <DeleteJobDialog
        key={jobToDelete?._id}
        job={jobToDelete}
        onClose={() => setJobToDelete(null)}
        onDeleted={() => navigate('/recruiter/dashboard', { state: { flash: 'Job deleted.' } })}
      />
    </div>
  )
}
