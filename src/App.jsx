import { createBrowserRouter } from 'react-router'
import { RouterProvider } from 'react-router/dom'
import AuthProvider from './context/AuthProvider.jsx'
import Layout from './components/Layout.jsx'
import ProtectedRoute from './routes/ProtectedRoute.jsx'
import RoleRoute from './routes/RoleRoute.jsx'
import GuestRoute from './routes/GuestRoute.jsx'
import HomePage from './pages/HomePage.jsx'
import JobsPage from './pages/JobsPage.jsx'
import JobDetailPage from './pages/JobDetailPage.jsx'
import LoginPage from './pages/LoginPage.jsx'
import RegisterPage from './pages/RegisterPage.jsx'
import SeekerDashboardPage from './pages/SeekerDashboardPage.jsx'
import RecruiterDashboardPage from './pages/RecruiterDashboardPage.jsx'
import PostJobPage from './pages/PostJobPage.jsx'
import EditJobPage from './pages/EditJobPage.jsx'
import NotFoundPage from './pages/NotFoundPage.jsx'
import { ROLES } from './utils/roles.js'

// All app routes live in one place. Each route maps a URL path to the element
// (component) to render. Child routes render inside their parent's <Outlet />.
//
// Routes WITHOUT a `path` are "layout routes": they don't add to the URL, they
// just wrap their children. We use them as guards, e.g. everything inside
// <ProtectedRoute> requires login.
const router = createBrowserRouter([
  {
    path: '/',
    element: <Layout />, // navbar + footer around every page
    children: [
      { index: true, element: <HomePage /> }, // "index" = the parent's own path, "/"

      // Public
      { path: 'jobs', element: <JobsPage /> },
      { path: 'jobs/:id', element: <JobDetailPage /> }, // ":id" is a URL parameter, read with useParams()

      // Logged-out visitors only
      {
        element: <GuestRoute />,
        children: [
          { path: 'login', element: <LoginPage /> },
          { path: 'register', element: <RegisterPage /> },
        ],
      },

      // Logged-in users only, then split by role
      {
        element: <ProtectedRoute />,
        children: [
          {
            element: <RoleRoute allowedRoles={[ROLES.JOB_SEEKER]} />,
            children: [{ path: 'seeker/dashboard', element: <SeekerDashboardPage /> }],
          },
          {
            element: <RoleRoute allowedRoles={[ROLES.RECRUITER]} />,
            children: [
              { path: 'recruiter/dashboard', element: <RecruiterDashboardPage /> },
              { path: 'recruiter/jobs/new', element: <PostJobPage /> },
              { path: 'recruiter/jobs/:id/edit', element: <EditJobPage /> },
            ],
          },
        ],
      },

      { path: '*', element: <NotFoundPage /> }, // "*" matches any URL not listed above
    ],
  },
])

export default function App() {
  // AuthProvider wraps the router so every page can use useAuth().
  return (
    <AuthProvider>
      <RouterProvider router={router} />
    </AuthProvider>
  )
}
