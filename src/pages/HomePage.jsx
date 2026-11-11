// Landing page. Job search arrives in Phase 4.
import { Link } from 'react-router'
import { useAuth } from '../hooks/useAuth.js'
import { dashboardPathFor } from '../utils/roles.js'

const PRIMARY_BUTTON =
  'rounded-md bg-indigo-600 px-5 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-indigo-700'
const SECONDARY_BUTTON =
  'rounded-md bg-white px-5 py-2.5 text-sm font-semibold text-slate-700 shadow-sm ring-1 ring-slate-300 ring-inset hover:bg-slate-50'

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
  const { user, isLoading } = useAuth()

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

        {/* Conditional rendering: show different buttons depending on login state. */}
        {!isLoading && (
          <div className="mt-8 flex flex-wrap justify-center gap-3">
            {user ? (
              <Link to={dashboardPathFor(user.role)} className={PRIMARY_BUTTON}>
                Go to your dashboard
              </Link>
            ) : (
              <>
                <Link to="/register" className={PRIMARY_BUTTON}>
                  Create an account
                </Link>
                <Link to="/login" className={SECONDARY_BUTTON}>
                  Log in
                </Link>
              </>
            )}
          </div>
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
