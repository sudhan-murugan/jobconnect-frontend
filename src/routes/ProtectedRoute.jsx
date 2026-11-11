import { Navigate, Outlet, useLocation } from 'react-router'
import { useAuth } from '../hooks/useAuth.js'
import { PageLoader } from '../components/Spinner.jsx'

// Guards a group of routes so only logged-in users can see them.
// Used as a "layout route" in App.jsx: its child routes render in <Outlet />.
export default function ProtectedRoute() {
  const { user, isLoading } = useAuth()
  const location = useLocation()

  // Still checking a saved token, so don't redirect yet.
  if (isLoading) return <PageLoader label="Checking your session…" />

  if (!user) {
    // Remember where the user was going, so login can send them back there.
    // `replace` swaps the history entry, so "Back" doesn't return to this page.
    return <Navigate to="/login" replace state={{ from: location }} />
  }

  return <Outlet />
}
