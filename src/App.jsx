import { createBrowserRouter } from 'react-router'
import { RouterProvider } from 'react-router/dom'
import Layout from './components/Layout.jsx'
import HomePage from './pages/HomePage.jsx'
import NotFoundPage from './pages/NotFoundPage.jsx'

// All app routes live in one place. Each route maps a URL path to the element
// (component) to render. Child routes render inside their parent's <Outlet />,
// so every page below shares the Layout (navbar + footer).
//
// Later phases add pages here (login, jobs, dashboards) and wrap private ones
// in <ProtectedRoute> / <RoleRoute>.
const router = createBrowserRouter([
  {
    path: '/',
    element: <Layout />,
    children: [
      { index: true, element: <HomePage /> }, // "index" = the parent's own path, "/"
      { path: '*', element: <NotFoundPage /> }, // "*" matches any URL not listed above
    ],
  },
])

export default function App() {
  return <RouterProvider router={router} />
}
