import { useState } from 'react'
import { Link, useLocation } from 'react-router'
import { useAuth } from '../hooks/useAuth.js'
import { getErrorMessage, getFieldErrors } from '../services/api.js'
import { ROLES } from '../utils/roles.js'
import FormField from '../components/FormField.jsx'
import Button from '../components/Button.jsx'
import Alert from '../components/Alert.jsx'
import { useDocumentTitle } from '../hooks/useDocumentTitle.js'

const ROLE_OPTIONS = [
  { value: ROLES.JOB_SEEKER, title: "I'm looking for a job", text: 'Search jobs and apply' },
  { value: ROLES.RECRUITER, title: "I'm hiring", text: 'Post jobs and review applicants' },
]

const INITIAL_FORM = {
  name: '',
  email: '',
  password: '',
  confirmPassword: '',
  role: ROLES.JOB_SEEKER,
}

export default function RegisterPage() {
  useDocumentTitle('Create account')
  const { register } = useAuth()
  const location = useLocation()

  const [form, setForm] = useState(INITIAL_FORM)
  const [fieldErrors, setFieldErrors] = useState({}) // e.g. { email: 'Enter a valid email address' }
  const [error, setError] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)

  function handleChange(event) {
    const { name, value } = event.target
    setForm((prev) => ({ ...prev, [name]: value }))
    // Clear a field's error as soon as the user edits it.
    setFieldErrors((prev) => ({ ...prev, [name]: undefined }))
  }

  async function handleSubmit(event) {
    event.preventDefault()
    setError('')

    // Checks that only matter in the browser happen here; the server
    // re-validates everything else (never trust the client alone).
    if (form.password !== form.confirmPassword) {
      setFieldErrors({ confirmPassword: 'Passwords do not match' })
      return
    }

    setIsSubmitting(true)
    try {
      // Only send what the API expects (confirmPassword stays in the browser).
      const { name, email, password, role } = form
      await register({ name, email, password, role })
      // <GuestRoute> redirects to the dashboard once the user is set.
    } catch (err) {
      const errors = getFieldErrors(err)
      setFieldErrors(errors)
      // Show the summary message only if there are no per-field errors to show.
      if (Object.keys(errors).length === 0) setError(getErrorMessage(err))
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="mx-auto max-w-md">
      <div className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm sm:p-8">
        <h1 className="text-2xl font-bold text-slate-900">Create your account</h1>
        <p className="mt-1 text-sm text-slate-600">It takes less than a minute.</p>

        <form onSubmit={handleSubmit} className="mt-6 space-y-4">
          {error && <Alert>{error}</Alert>}

          {/* Role picker: radio inputs styled as cards. */}
          <fieldset>
            <legend className="text-sm font-medium text-slate-700">I want to</legend>
            <div className="mt-2 grid gap-3 sm:grid-cols-2">
              {ROLE_OPTIONS.map((option) => (
                <label
                  key={option.value}
                  className={`cursor-pointer rounded-lg border p-3 transition-colors has-focus-visible:ring-2 has-focus-visible:ring-indigo-300 ${
                    form.role === option.value
                      ? 'border-indigo-600 bg-indigo-50'
                      : 'border-slate-300 hover:border-slate-400'
                  }`}
                >
                  <input
                    type="radio"
                    name="role"
                    value={option.value}
                    checked={form.role === option.value}
                    onChange={handleChange}
                    className="sr-only"
                  />
                  <span className="block text-sm font-semibold text-slate-900">{option.title}</span>
                  <span className="block text-xs text-slate-600">{option.text}</span>
                </label>
              ))}
            </div>
            {fieldErrors.role && <p className="mt-1 text-sm text-red-600">{fieldErrors.role}</p>}
          </fieldset>

          <FormField
            label="Full name"
            name="name"
            autoComplete="name"
            required
            maxLength={100}
            value={form.name}
            onChange={handleChange}
            error={fieldErrors.name}
          />
          <FormField
            label="Email"
            name="email"
            type="email"
            autoComplete="email"
            required
            value={form.email}
            onChange={handleChange}
            error={fieldErrors.email}
          />
          <FormField
            label="Password"
            name="password"
            type="password"
            autoComplete="new-password"
            required
            minLength={8}
            maxLength={72}
            value={form.password}
            onChange={handleChange}
            error={fieldErrors.password}
            hint="At least 8 characters, with a letter and a number."
          />
          <FormField
            label="Confirm password"
            name="confirmPassword"
            type="password"
            autoComplete="new-password"
            required
            value={form.confirmPassword}
            onChange={handleChange}
            error={fieldErrors.confirmPassword}
          />

          <Button
            type="submit"
            isLoading={isSubmitting}
            loadingText="Creating account…"
            className="w-full"
          >
            Create account
          </Button>
        </form>
      </div>

      <p className="mt-6 text-center text-sm text-slate-600">
        Already have an account?{' '}
        <Link
          to="/login"
          state={location.state}
          className="font-semibold text-indigo-600 hover:text-indigo-700"
        >
          Log in
        </Link>
      </p>
    </div>
  )
}
