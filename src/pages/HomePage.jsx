// Landing page: a job search box plus a short intro.
import { createSearchParams, Link, useNavigate } from 'react-router'
import { useAuth } from '../hooks/useAuth.js'
import { useDocumentTitle } from '../hooks/useDocumentTitle.js'
import { dashboardPathFor, ROLES } from '../utils/roles.js'
import JobSearchForm from '../components/JobSearchForm.jsx'

const TEXT_LINK = 'font-semibold text-indigo-600 hover:text-indigo-700'

// Keeping content in an array and rendering it with .map() avoids repeating markup.
const FEATURES = [
  {
    title: 'Search jobs',
    text: 'Filter openings by keyword, location and job type.',
  },
  {
    title: 'Apply in minutes',
    text: 'Send your resume and a short cover note straight to the recruiter.',
  },
  {
    title: 'Track progress',
    text: 'See whether each application is applied, shortlisted or rejected.',
  },
]

export default function HomePage() {
  useDocumentTitle(null) // just "JobConnect"
  const { user, isLoading } = useAuth()
  const navigate = useNavigate()

  // Send the search to the jobs page as URL query params, skipping empty ones.
  function handleSearch({ keyword, location }) {
    const params = Object.fromEntries(Object.entries({ keyword, location }).filter(([, value]) => value))
    navigate({ pathname: '/jobs', search: `?${createSearchParams(params)}` })
  }

  return (
    <>
      <section className="py-10 text-center sm:py-16">
        <h1 className="text-4xl font-bold tracking-tight text-slate-900 sm:text-5xl">
          Find your next role
        </h1>
        <p className="mx-auto mt-4 max-w-2xl text-lg text-slate-600">
          JobConnect brings recruiters and job seekers together. Search openings, apply with your
          resume, and track every application in one place.
        </p>

        <div className="mx-auto mt-8 max-w-2xl text-left">
          <JobSearchForm onSearch={handleSearch} />
        </div>

        {/* Conditional rendering: show different links depending on login state. */}
        {!isLoading && (
          <p className="mt-6 text-sm text-slate-600">
            <Link to="/jobs" className={TEXT_LINK}>
              Browse all jobs
            </Link>
            <span aria-hidden="true"> · </span>
            {user ? (
              <>
                <Link to={dashboardPathFor(user.role)} className={TEXT_LINK}>
                  Go to your dashboard
                </Link>
                {user.role === ROLES.RECRUITER && (
                  <>
                    <span aria-hidden="true"> · </span>
                    <Link to="/recruiter/jobs/new" className={TEXT_LINK}>
                      Post a job
                    </Link>
                  </>
                )}
              </>
            ) : (
              <>
                Hiring?{' '}
                <Link to="/register" className={TEXT_LINK}>
                  Create a recruiter account
                </Link>
              </>
            )}
          </p>
        )}
      </section>

      <section className="grid gap-4 sm:grid-cols-3">
        {FEATURES.map((feature) => (
          // React needs a unique, stable "key" for each item in a list so it
          // can tell items apart when the list changes.
          <article
            key={feature.title}
            className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm"
          >
            <h2 className="font-semibold text-slate-900">{feature.title}</h2>
            <p className="mt-2 text-sm text-slate-600">{feature.text}</p>
          </article>
        ))}
      </section>
    </>
  )
}
