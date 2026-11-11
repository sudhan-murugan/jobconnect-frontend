import { createBrowserRouter } from 'react-router'
import { RouterProvider } from 'react-router/dom'
import AuthProvider from './context/AuthProvider.jsx'
import Layout from './components/Layout.jsx'
import { PageLoader } from './components/Spinner.jsx'
import ProtectedRoute from './routes/ProtectedRoute.jsx'
import RoleRoute from './routes/RoleRoute.jsx'
import GuestRoute from './routes/GuestRoute.jsx'
import HomePage from './pages/HomePage.jsx'
import RouteErrorPage from './pages/RouteErrorPage.jsx'
import { ROLES } from './utils/roles.js'

// Code splitting: instead of one big JavaScript file with every page, each
// page below becomes its own small file that the browser downloads the first
// time that page is visited. The home page stays in the main bundle because
// almost every visit starts there.
const lazyPage = (importPage) => async () => ({ Component: (await importPage()).default })

// All app routes live in one place. Each route maps a URL path to the
// component to render. Child routes render inside their parent's <Outlet />.
//
// Routes WITHOUT a `path` are "layout routes": they don't add to the URL, they
// just wrap their children. We use them as guards (e.g. everything inside
// <ProtectedRoute> requires login) and as an error boundary.
const router = createBrowserRouter([
  {
    path: '/',
    element: <Layout />, // navbar + footer around every page
    errorElement: <RouteErrorPage />, // last resort, if the layout itself fails
    // Shown on the very first load while the first page's code downloads.
    hydrateFallbackElement: <PageLoader />,
    children: [
      {
        // If any page below throws, show RouteErrorPage inside the layout,
        // so the navbar stays usable.
        errorElement: <RouteErrorPage />,
        children: [
          { index: true, element: <HomePage /> }, // "index" = the parent's own path, "/"

          // Public
          { path: 'jobs', lazy: lazyPage(() => import('./pages/JobsPage.jsx')) },
          // ":id" is a URL parameter, read with useParams()
          { path: 'jobs/:id', lazy: lazyPage(() => import('./pages/JobDetailPage.jsx')) },

          // Logged-out visitors only
          {
            element: <GuestRoute />,
            children: [
              { path: 'login', lazy: lazyPage(() => import('./pages/LoginPage.jsx')) },
              { path: 'register', lazy: lazyPage(() => import('./pages/RegisterPage.jsx')) },
            ],
          },

          // Logged-in users only, then split by role
          {
            element: <ProtectedRoute />,
            children: [
              { path: 'profile', lazy: lazyPage(() => import('./pages/ProfilePage.jsx')) },
              {
                element: <RoleRoute allowedRoles={[ROLES.JOB_SEEKER]} />,
                children: [
                  { path: 'seeker/dashboard', lazy: lazyPage(() => import('./pages/SeekerDashboardPage.jsx')) },
                ],
              },
              {
                element: <RoleRoute allowedRoles={[ROLES.RECRUITER]} />,
                children: [
                  { path: 'recruiter/dashboard', lazy: lazyPage(() => import('./pages/RecruiterDashboardPage.jsx')) },
                  { path: 'recruiter/jobs/new', lazy: lazyPage(() => import('./pages/PostJobPage.jsx')) },
                  { path: 'recruiter/jobs/:id/edit', lazy: lazyPage(() => import('./pages/EditJobPage.jsx')) },
                  {
                    path: 'recruiter/jobs/:id/applicants',
                    lazy: lazyPage(() => import('./pages/ApplicantsPage.jsx')),
                  },
                ],
              },
            ],
          },

          // "*" matches any URL not listed above
          { path: '*', lazy: lazyPage(() => import('./pages/NotFoundPage.jsx')) },
        ],
      },
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
