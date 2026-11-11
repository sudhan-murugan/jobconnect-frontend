import { screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, expect, it, vi } from 'vitest'
import LoginPage from './LoginPage.jsx'
import { makeAuth, renderWithProviders } from '../test/render.jsx'

// userEvent simulates real typing and clicking (focus, key presses, etc.).
async function fillAndSubmit(user, { email = 'asha@example.com', password = 'secret123' } = {}) {
  await user.type(screen.getByLabelText('Email'), email)
  await user.type(screen.getByLabelText('Password'), password)
  await user.click(screen.getByRole('button', { name: 'Log in' }))
}

describe('LoginPage', () => {
  it('logs in with the entered email and password', async () => {
    const auth = makeAuth({ login: vi.fn().mockResolvedValue({ role: 'job_seeker' }) })
    const user = userEvent.setup()
    renderWithProviders(<LoginPage />, { auth })

    await fillAndSubmit(user)

    expect(auth.login).toHaveBeenCalledWith({ email: 'asha@example.com', password: 'secret123' })
  })

  it('disables the button while logging in', async () => {
    // A promise we never resolve keeps the request "in flight".
    const auth = makeAuth({ login: vi.fn(() => new Promise(() => {})) })
    const user = userEvent.setup()
    renderWithProviders(<LoginPage />, { auth })

    await fillAndSubmit(user)

    expect(screen.getByRole('button', { name: /Logging in/ })).toBeDisabled()
  })

  it("shows the API's error message when login fails", async () => {
    const apiError = { response: { status: 401, data: { message: 'Invalid email or password' } } }
    const auth = makeAuth({ login: vi.fn().mockRejectedValue(apiError) })
    const user = userEvent.setup()
    renderWithProviders(<LoginPage />, { auth })

    await fillAndSubmit(user, { password: 'wrongpass1' })

    expect(await screen.findByRole('alert')).toHaveTextContent('Invalid email or password')
    expect(screen.getByRole('button', { name: 'Log in' })).toBeEnabled()
  })

  it('explains why the user was sent to the login page', () => {
    renderWithProviders(<LoginPage />, { route: { pathname: '/login', state: { from: { pathname: '/profile' } } } })

    expect(screen.getByText('Please log in to continue.')).toBeInTheDocument()
  })
})
