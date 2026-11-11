import { useCallback } from 'react'
import { Link } from 'react-router'
import { getJobs } from '../services/jobService.js'
import { useFetch } from '../hooks/useFetch.js'
import JobCard from './JobCard.jsx'
import { JobListSkeleton } from './JobCardSkeleton.jsx'
import { ErrorState } from './StatusMessage.jsx'

const COUNT = 3

// The newest jobs, shown on the home page.
export default function LatestJobs() {
  const fetchLatest = useCallback((signal) => getJobs({ limit: COUNT }, { signal }), [])
  const { data, error, reload } = useFetch(fetchLatest)

  return (
    <section aria-labelledby="latest-jobs-heading" className="space-y-4">
      <div className="flex items-end justify-between gap-4">
        <h2 id="latest-jobs-heading" className="text-xl font-semibold text-slate-900">
          Latest jobs
        </h2>
        <Link to="/jobs" className="text-sm font-semibold text-indigo-600 hover:text-indigo-700">
          View all jobs →
        </Link>
      </div>

      {error ? (
        <ErrorState error={error} onRetry={reload} title="We couldn't load the latest jobs" />
      ) : !data ? (
        <JobListSkeleton count={COUNT} label="Loading latest jobs…" />
      ) : data.jobs.length === 0 ? (
        <p className="text-sm text-slate-600">No jobs have been posted yet. Check back soon.</p>
      ) : (
        <ul className="space-y-3">
          {data.jobs.map((job) => (
            <li key={job._id}>
              <JobCard job={job} />
            </li>
          ))}
        </ul>
      )}
    </section>
  )
}
