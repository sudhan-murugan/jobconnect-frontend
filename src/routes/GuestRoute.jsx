import { Navigate, Outlet, useLocation } from 'react-router'
import { useAuth } from '../hooks/useAuth.js'
import { PageLoader } from '../components/Spinner.jsx'
import { dashboardPathFor } from '../utils/roles.js'

// The opposite of ProtectedRoute: pages only for logged-OUT visitors (login,
// register). As soon as `user` is set, this component redirects. That covers
// both "already logged in and opened /login" and "just logged in".
export default function GuestRoute() {
  const { user, isLoading } = useAuth()
  const location = useLocation()

  if (isLoading) return <PageLoader />

  if (user) {
    // ProtectedRoute stores the page the user originally wanted in
    // location.state.from; send them there, otherwise to their dashboard.
    const from = location.state?.from
    const target = from ? `${from.pathname}${from.search}` : dashboardPathFor(user.role)
    return <Navigate to={target} replace />
  }

  return <Outlet />
}
