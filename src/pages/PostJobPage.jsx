import { useNavigate } from 'react-router'
import { createJob } from '../services/jobService.js'
import { useDocumentTitle } from '../hooks/useDocumentTitle.js'
import JobForm from '../components/JobForm.jsx'

export default function PostJobPage() {
  useDocumentTitle('Post a job')
  const navigate = useNavigate()

  async function handleSubmit(payload) {
    const job = await createJob(payload)
    // Show the new job, with a one-time success message (see useFlashMessage).
    navigate(`/jobs/${job._id}`, { state: { flash: 'Your job is live.' } })
  }

  return (
    <div className="mx-auto max-w-3xl">
      <h1 className="text-2xl font-bold text-slate-900 sm:text-3xl">Post a job</h1>
      <p className="mt-1 text-slate-600">Job seekers can find and apply as soon as you publish.</p>
      <div className="mt-6 rounded-xl border border-slate-200 bg-white p-6 shadow-sm sm:p-8">
        <JobForm
          submitLabel="Publish job"
          submittingLabel="Publishing…"
          cancelTo="/recruiter/dashboard"
          onSubmit={handleSubmit}
        />
      </div>
    </div>
  )
}
