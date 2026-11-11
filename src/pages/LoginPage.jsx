import { useState } from 'react'
import { Link, useLocation } from 'react-router'
import { useAuth } from '../hooks/useAuth.js'
import { getErrorMessage } from '../services/api.js'
import FormField from '../components/FormField.jsx'
import Button from '../components/Button.jsx'
import Alert from '../components/Alert.jsx'

export default function LoginPage() {
  const { login } = useAuth()
  const location = useLocation()

  // A "controlled form": React state is the single source of truth for each
  // input's value, and every keystroke updates that state.
  const [form, setForm] = useState({ email: '', password: '' })
  const [error, setError] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)

  // One change handler for all inputs, using each input's `name` attribute.
  function handleChange(event) {
    const { name, value } = event.target
    // Copy the previous state and overwrite one field. Never mutate state directly.
    setForm((prev) => ({ ...prev, [name]: value }))
  }

  async function handleSubmit(event) {
    event.preventDefault() // stop the browser's default full-page form submit
    setError('')
    setIsSubmitting(true)
    try {
      await login(form)
      // No navigate() needed: once the user is set, <GuestRoute> redirects
      // to the page they originally wanted, or to their dashboard.
    } catch (err) {
      setError(getErrorMessage(err))
    } finally {
      setIsSubmitting(false)
    }
  }

  // Set by <ProtectedRoute> when it redirected the user here.
  const wasRedirected = Boolean(location.state?.from)

  return (
    <div className="mx-auto max-w-md">
      <div className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm sm:p-8">
        <h1 className="text-2xl font-bold text-slate-900">Log in</h1>
        <p className="mt-1 text-sm text-slate-600">Welcome back to JobConnect.</p>

        <form onSubmit={handleSubmit} className="mt-6 space-y-4">
          {wasRedirected && !error && <Alert type="info">Please log in to continue.</Alert>}
          {error && <Alert>{error}</Alert>}

          <FormField
            label="Email"
            name="email"
            type="email"
            autoComplete="email"
            required
            value={form.email}
            onChange={handleChange}
          />
          <FormField
            label="Password"
            name="password"
            type="password"
            autoComplete="current-password"
            required
            value={form.password}
            onChange={handleChange}
          />

          <Button type="submit" isLoading={isSubmitting} loadingText="Logging in…" className="w-full">
            Log in
          </Button>
        </form>
      </div>

      <p className="mt-6 text-center text-sm text-slate-600">
        New to JobConnect?{' '}
        {/* Pass `state` along so a redirect target survives switching to Register. */}
        <Link
          to="/register"
          state={location.state}
          className="font-semibold text-indigo-600 hover:text-indigo-700"
        >
          Create an account
        </Link>
      </p>
    </div>
  )
}
