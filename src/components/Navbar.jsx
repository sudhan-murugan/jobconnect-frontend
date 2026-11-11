import { Link, NavLink, useNavigate } from 'react-router'
import { useAuth } from '../hooks/useAuth.js'
import { dashboardPathFor, ROLE_LABELS } from '../utils/roles.js'

// <NavLink> works like <Link> but tells us whether it matches the current URL,
// so we can highlight the active page. Both change the page without a full
// browser reload (client-side routing), unlike a plain <a href>.
function navLinkClass({ isActive }) {
  return `rounded-md px-3 py-2 text-sm font-medium transition-colors ${
    isActive ? 'bg-indigo-50 text-indigo-700' : 'text-slate-600 hover:text-slate-900'
  }`
}

export default function Navbar() {
  const { user, isLoading, logout } = useAuth()
  const navigate = useNavigate()

  async function handleLogout() {
    // Leave the page FIRST, then clear the user. In the other order, a
    // protected page would still be on screen for a moment with no user, and
    // <ProtectedRoute> would redirect to /login instead of home.
    // React Router normally applies navigations as a low-priority "transition";
    // flushSync makes it render the home page immediately, before logout() runs.
    await navigate('/', { flushSync: true })
    logout()
  }

  return (
    <header className="border-b border-slate-200 bg-white">
      <nav className="mx-auto flex max-w-6xl items-center justify-between gap-4 px-4 py-3 sm:px-6">
        <Link to="/" className="flex shrink-0 items-center gap-2 text-lg font-bold text-slate-900">
          <img src="/favicon.svg" alt="" className="h-7 w-7" />
          JobConnect
        </Link>

        <div className="flex items-center gap-1 sm:gap-2">
          {/* The logo already links home, so hide this on small screens to save space. */}
          <NavLink to="/" end className={(state) => `hidden sm:block ${navLinkClass(state)}`}>
            Home
          </NavLink>

          {/* Render nothing for the auth links while the session is being checked,
              to avoid flashing "Log in" to a user who is actually logged in. */}
          {!isLoading &&
            (user ? (
              <>
                <NavLink to={dashboardPathFor(user.role)} className={navLinkClass}>
                  Dashboard
                </NavLink>
                <span className="hidden text-sm text-slate-500 md:inline">
                  {user.name} · {ROLE_LABELS[user.role]}
                </span>
                <button
                  type="button"
                  onClick={handleLogout}
                  className="rounded-md px-3 py-2 text-sm font-medium text-slate-600 hover:text-slate-900"
                >
                  Log out
                </button>
              </>
            ) : (
              <>
                <NavLink to="/login" className={navLinkClass}>
                  Log in
                </NavLink>
                <Link
                  to="/register"
                  className="rounded-md bg-indigo-600 px-3 py-2 text-sm font-semibold text-white hover:bg-indigo-700"
                >
                  Sign up
                </Link>
              </>
            ))}
        </div>
      </nav>
    </header>
  )
}
