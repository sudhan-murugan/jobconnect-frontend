import { Link } from 'react-router'
import { useAuth } from '../hooks/useAuth.js'
import { dashboardPathFor } from '../utils/roles.js'

// Shown when a logged-in user opens a page their role can't access (HTTP 403 idea).
export default function ForbiddenPage() {
  const { user } = useAuth()

  return (
    <section className="py-16 text-center">
      <p className="text-sm font-semibold text-indigo-600">403</p>
      <h1 className="mt-2 text-3xl font-bold text-slate-900">You don't have access to this page</h1>
      <p className="mt-2 text-slate-600">This page is for a different type of account.</p>
      <Link
        to={user ? dashboardPathFor(user.role) : '/'}
        className="mt-6 inline-block rounded-md bg-indigo-600 px-4 py-2 text-sm font-medium text-white hover:bg-indigo-700"
      >
        Go to your dashboard
      </Link>
    </section>
  )
}
