// Test helpers: render components with the providers they need (auth + router).
import { render } from '@testing-library/react'
import { createMemoryRouter, MemoryRouter, RouterProvider } from 'react-router'
import { vi } from 'vitest'
import { AuthContext } from '../context/AuthContext.js'

// A fake value for AuthContext. Override any part, e.g. makeAuth({ user }).
export function makeAuth(overrides = {}) {
  const user = overrides.user ?? null
  return {
    user,
    isAuthenticated: Boolean(user),
    isLoading: false,
    login: vi.fn(),
    register: vi.fn(),
    logout: vi.fn(),
    updateUser: vi.fn(),
    ...overrides,
  }
}

// Renders a single component inside a router, with the given auth state.
export function renderWithProviders(ui, { auth = makeAuth(), route = '/' } = {}) {
  return render(
    <AuthContext.Provider value={auth}>
      <MemoryRouter initialEntries={[route]}>{ui}</MemoryRouter>
    </AuthContext.Provider>,
  )
}

// Renders a set of routes (like App.jsx does) starting at `route`, so tests
// can check redirects between pages. Returns the router to inspect its location.
export function renderRoutes(routes, { auth = makeAuth(), route = '/' } = {}) {
  const router = createMemoryRouter(routes, { initialEntries: [route] })
  render(
    <AuthContext.Provider value={auth}>
      <RouterProvider router={router} />
    </AuthContext.Provider>,
  )
  return router
}

export const jobSeeker = { _id: 'u1', name: 'Asha Tan', email: 'asha@example.com', role: 'job_seeker' }
export const recruiter = { _id: 'u2', name: 'Rachel Lim', email: 'rachel@example.com', role: 'recruiter' }
