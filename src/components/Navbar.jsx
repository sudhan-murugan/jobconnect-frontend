import { Link, NavLink } from 'react-router'

// <NavLink> works like <Link> but tells us whether it matches the current URL,
// so we can highlight the active page. Both change the page without a full
// browser reload (client-side routing), unlike a plain <a href>.
function navLinkClass({ isActive }) {
  return `rounded-md px-3 py-2 text-sm font-medium transition-colors ${
    isActive ? 'bg-indigo-50 text-indigo-700' : 'text-slate-600 hover:text-slate-900'
  }`
}

export default function Navbar() {
  return (
    <header className="border-b border-slate-200 bg-white">
      <nav className="mx-auto flex max-w-6xl items-center justify-between px-4 py-3 sm:px-6">
        <Link to="/" className="flex items-center gap-2 text-lg font-bold text-slate-900">
          <img src="/favicon.svg" alt="" className="h-7 w-7" />
          JobConnect
        </Link>

        <div className="flex items-center gap-1">
          {/* "end" makes "/" active only on the home page, not on every URL. */}
          <NavLink to="/" end className={navLinkClass}>
            Home
          </NavLink>
          {/* Phase 2+: Jobs, Dashboard, Login / Register or Logout links go here. */}
        </div>
      </nav>
    </header>
  )
}
