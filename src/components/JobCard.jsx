import { Link, useLocation } from 'react-router'
import JobTypeBadge from './JobTypeBadge.jsx'
import SkillList from './SkillList.jsx'
import { formatFullDate, formatPostedDate, formatSalary } from '../utils/jobs.js'

// One job in the search results.
export default function JobCard({ job }) {
  const location = useLocation()
  const salary = formatSalary(job.salaryRange)

  return (
    <article className="relative rounded-xl border border-slate-200 bg-white p-5 shadow-sm transition hover:border-indigo-300 hover:shadow-md">
      <div className="flex flex-wrap items-start justify-between gap-2">
        <div className="min-w-0">
          <h2 className="text-lg font-semibold text-slate-900">
            {/* Pass the current search along so "Back to jobs" on the detail
                page returns to the same results. The ::after overlay makes the
                whole card clickable while keeping a single, real link. */}
            <Link
              to={`/jobs/${job._id}`}
              state={{ backTo: `${location.pathname}${location.search}` }}
              className="after:absolute after:inset-0 hover:text-indigo-700"
            >
              {job.title}
            </Link>
          </h2>
          <p className="mt-0.5 text-sm text-slate-600">
            {job.company} · {job.location}
          </p>
        </div>
        <JobTypeBadge jobType={job.jobType} />
      </div>

      {salary && <p className="mt-3 text-sm font-medium text-slate-800">{salary}</p>}

      <div className="mt-3 flex flex-wrap items-end justify-between gap-3">
        <SkillList skills={job.skills} max={5} />
        <time dateTime={job.createdAt} title={formatFullDate(job.createdAt)} className="text-xs text-slate-500">
          Posted {formatPostedDate(job.createdAt)}
        </time>
      </div>
    </article>
  )
}
