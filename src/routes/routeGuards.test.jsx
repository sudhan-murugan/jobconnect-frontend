import { screen } from '@testing-library/react'
import { describe, expect, it } from 'vitest'
import ProtectedRoute from './ProtectedRoute.jsx'
import RoleRoute from './RoleRoute.jsx'
import GuestRoute from './GuestRoute.jsx'
import { jobSeeker, makeAuth, recruiter, renderRoutes } from '../test/render.jsx'

// A tiny app with the same guard structure as App.jsx.
const routes = [
  {
    element: <GuestRoute />,
    children: [{ path: '/login', element: <h1>Login page</h1> }],
  },
  {
    element: <ProtectedRoute />,
    children: [
      { path: '/profile', element: <h1>Profile page</h1> },
      {
        element: <RoleRoute allowedRoles={['recruiter']} />,
        children: [{ path: '/recruiter/dashboard', element: <h1>Recruiter dashboard</h1> }],
      },
      {
        element: <RoleRoute allowedRoles={['job_seeker']} />,
        children: [{ path: '/seeker/dashboard', element: <h1>Seeker dashboard</h1> }],
      },
    ],
  },
]

describe('ProtectedRoute', () => {
  it('sends logged-out visitors to /login and remembers where they were going', async () => {
    const router = renderRoutes(routes, { route: '/profile' })

    expect(await screen.findByRole('heading', { name: 'Login page' })).toBeInTheDocument()
    expect(router.state.location.state.from.pathname).toBe('/profile')
  })

  it('shows the page to logged-in users', async () => {
    renderRoutes(routes, { route: '/profile', auth: makeAuth({ user: jobSeeker }) })

    expect(await screen.findByRole('heading', { name: 'Profile page' })).toBeInTheDocument()
  })

  it('waits (spinner, no redirect) while the session is being checked', () => {
    const router = renderRoutes(routes, { route: '/profile', auth: makeAuth({ isLoading: true }) })

    expect(screen.getByRole('status', { name: 'Checking your session…' })).toBeInTheDocument()
    expect(router.state.location.pathname).toBe('/profile')
  })
})

describe('RoleRoute', () => {
  it('shows a 403 page to users with the wrong role', async () => {
    renderRoutes(routes, { route: '/recruiter/dashboard', auth: makeAuth({ user: jobSeeker }) })

    expect(await screen.findByText("You don't have access to this page")).toBeInTheDocument()
    expect(screen.queryByRole('heading', { name: 'Recruiter dashboard' })).not.toBeInTheDocument()
  })

  it('shows the page to users with the right role', async () => {
    renderRoutes(routes, { route: '/recruiter/dashboard', auth: makeAuth({ user: recruiter }) })

    expect(await screen.findByRole('heading', { name: 'Recruiter dashboard' })).toBeInTheDocument()
  })
})

describe('GuestRoute', () => {
  it("sends logged-in users from /login to their role's dashboard", async () => {
    renderRoutes(routes, { route: '/login', auth: makeAuth({ user: recruiter }) })

    expect(await screen.findByRole('heading', { name: 'Recruiter dashboard' })).toBeInTheDocument()
  })

  it('shows the login page to logged-out visitors', async () => {
    renderRoutes(routes, { route: '/login' })

    expect(await screen.findByRole('heading', { name: 'Login page' })).toBeInTheDocument()
  })
})
