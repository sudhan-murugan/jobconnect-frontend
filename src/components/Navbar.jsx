import { useState } from 'react'
import { Link, NavLink, useNavigate } from 'react-router'
import { useAuth } from '../hooks/useAuth.js'
import { dashboardPathFor, ROLE_LABELS } from '../utils/roles.js'

// <NavLink> works like <Link> but tells us whether it matches the current URL,
// so we can highlight the active page. Both change the page without a full
// browser reload (client-side routing), unlike a plain <a href>.
function desktopLinkClass({ isActive }) {
  return `rounded-md px-3 py-2 text-sm font-medium transition-colors ${
    isActive ? 'bg-indigo-50 text-indigo-700' : 'text-slate-600 hover:text-slate-900'
  }`
}

function mobileLinkClass({ isActive }) {
  return `block rounded-md px-3 py-2 text-base font-medium ${
    isActive ? 'bg-indigo-50 text-indigo-700' : 'text-slate-700 hover:bg-slate-50'
  }`
}

// The links, shared by the desktop bar and the mobile menu. Defined outside
// Navbar: declaring a component inside another component would recreate it
// (and reset its state) on every render.
function NavItems({ user, linkClass, onNavigate, onLogout, isMobile }) {
  return (
    <>
      <NavLink to="/jobs" className={linkClass} onClick={onNavigate}>
        Find jobs
      </NavLink>
      {user ? (
        <>
          <NavLink to={dashboardPathFor(user.role)} className={linkClass} onClick={onNavigate}>
            Dashboard
          </NavLink>
          <span className={isMobile ? 'block px-3 pt-3 text-sm text-slate-500' : 'hidden text-sm text-slate-500 lg:inline'}>
            {user.name} · {ROLE_LABELS[user.role]}
          </span>
          <button
            type="button"
            onClick={onLogout}
            className={linkClass({ isActive: false }) + (isMobile ? ' w-full text-left' : '')}
          >
            Log out
          </button>
        </>
      ) : (
        <>
          <NavLink to="/login" className={linkClass} onClick={onNavigate}>
            Log in
          </NavLink>
          <Link
            to="/register"
            onClick={onNavigate}
            className={`rounded-md bg-indigo-600 px-3 py-2 font-semibold text-white hover:bg-indigo-700 ${
              isMobile ? 'block text-center text-base' : 'text-sm'
            }`}
          >
            Sign up
          </Link>
        </>
      )}
    </>
  )
}

export default function Navbar() {
  const { user, isLoading, logout } = useAuth()
  const navigate = useNavigate()
  const [isMenuOpen, setIsMenuOpen] = useState(false)

  const closeMenu = () => setIsMenuOpen(false)

  async function handleLogout() {
    closeMenu()
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
        <Link to="/" onClick={closeMenu} className="flex shrink-0 items-center gap-2 text-lg font-bold text-slate-900">
          <img src="/favicon.svg" alt="" className="h-7 w-7" />
          JobConnect
        </Link>

        {/* Render no auth links while the session is being checked, to avoid
            flashing "Log in" to a user who is actually logged in. */}
        {!isLoading && (
          <>
            {/* Desktop: inline links (hidden below the "sm" breakpoint) */}
            <div className="hidden items-center gap-2 sm:flex">
              <NavItems user={user} linkClass={desktopLinkClass} onLogout={handleLogout} />
            </div>

            {/* Mobile: menu button (hidden from "sm" up) */}
            <button
              type="button"
              onClick={() => setIsMenuOpen((open) => !open)}
              aria-expanded={isMenuOpen}
              aria-controls="mobile-menu"
              className="rounded-md p-2 text-slate-700 hover:bg-slate-100 sm:hidden"
            >
              <span className="sr-only">{isMenuOpen ? 'Close menu' : 'Open menu'}</span>
              <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2} aria-hidden="true">
                {isMenuOpen ? (
                  <path strokeLinecap="round" d="M6 6l12 12M18 6L6 18" />
                ) : (
                  <path strokeLinecap="round" d="M4 7h16M4 12h16M4 17h16" />
                )}
              </svg>
            </button>
          </>
        )}
      </nav>

      {isMenuOpen && (
        <div id="mobile-menu" className="space-y-1 border-t border-slate-200 px-4 py-3 sm:hidden">
          <NavItems
            user={user}
            linkClass={mobileLinkClass}
            onNavigate={closeMenu}
            onLogout={handleLogout}
            isMobile
          />
        </div>
      )}
    </header>
  )
}
