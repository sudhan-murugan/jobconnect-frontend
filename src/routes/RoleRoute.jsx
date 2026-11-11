import { Outlet } from 'react-router'
import { useAuth } from '../hooks/useAuth.js'
import ForbiddenPage from '../pages/ForbiddenPage.jsx'

// Guards routes by role, e.g. <RoleRoute allowedRoles={['recruiter']} />.
// Always place it INSIDE <ProtectedRoute>, which guarantees a logged-in user.
//
// This only controls what the UI shows. The real security is on the backend
// (authorize middleware), because anyone can call the API directly.
export default function RoleRoute({ allowedRoles }) {
  const { user } = useAuth()

  if (!allowedRoles.includes(user?.role)) {
    return <ForbiddenPage />
  }

  return <Outlet />
}
