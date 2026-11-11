import { useAuth } from '../hooks/useAuth.js'
import { ROLE_LABELS } from '../utils/roles.js'

// Greeting shown at the top of both dashboards.
export default function DashboardHeader({ subtitle }) {
  const { user } = useAuth()
  const firstName = user.name.split(' ')[0]

  return (
    <header>
      <span className="inline-block rounded-full bg-indigo-50 px-2.5 py-0.5 text-xs font-medium text-indigo-700">
        {ROLE_LABELS[user.role]}
      </span>
      <h1 className="mt-2 text-2xl font-bold text-slate-900 sm:text-3xl">Welcome, {firstName}</h1>
      <p className="mt-1 text-slate-600">{subtitle}</p>
    </header>
  )
}
