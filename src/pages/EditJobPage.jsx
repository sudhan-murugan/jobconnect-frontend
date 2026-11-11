import { useCallback } from 'react'
import { useNavigate, useParams } from 'react-router'
import { getJob, updateJob } from '../services/jobService.js'
import { useFetch } from '../hooks/useFetch.js'
import { useAuth } from '../hooks/useAuth.js'
import { useDocumentTitle } from '../hooks/useDocumentTitle.js'
import JobForm from '../components/JobForm.jsx'
import ForbiddenPage from './ForbiddenPage.jsx'
import { PageLoader } from '../components/Spinner.jsx'
import { EmptyState, ErrorState } from '../components/StatusMessage.jsx'

export default function EditJobPage() {
  useDocumentTitle('Edit job')
  const { id } = useParams()
  const { user } = useAuth()
  const navigate = useNavigate()

  const fetchJob = useCallback((signal) => getJob(id, { signal }), [id])
  const { data: job, error, isLoading, reload } = useFetch(fetchJob)

  if (isLoading) return <PageLoader label="Loading job…" />
  if (error) {
    const status = error.response?.status
    if (status === 404 || status === 400) return <EmptyState title="Job not found" />
    return <ErrorState error={error} onRetry={reload} />
  }
  // The API also rejects edits from non-owners (403); this just avoids
  // showing a form that can't be saved.
  if (job.postedBy?._id !== user._id) return <ForbiddenPage />

  async function handleSubmit(payload) {
    await updateJob(job._id, payload)
    navigate(`/jobs/${job._id}`, { state: { flash: 'Changes saved.' } })
  }

  return (
    <div className="mx-auto max-w-3xl">
      <h1 className="text-2xl font-bold text-slate-900 sm:text-3xl">Edit job</h1>
      <p className="mt-1 text-slate-600">{job.title}</p>
      <div className="mt-6 rounded-xl border border-slate-200 bg-white p-6 shadow-sm sm:p-8">
        <JobForm
          initialJob={job}
          submitLabel="Save changes"
          submittingLabel="Saving…"
          cancelTo={`/jobs/${job._id}`}
          onSubmit={handleSubmit}
        />
      </div>
    </div>
  )
}
