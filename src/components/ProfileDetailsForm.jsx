import { useState } from 'react'
import FormField from './FormField.jsx'
import Button from './Button.jsx'
import Alert from './Alert.jsx'
import { updateProfile } from '../services/userService.js'
import { getErrorMessage, getFieldErrors } from '../services/api.js'
import { parseSkills } from '../utils/jobs.js'
import { ROLES } from '../utils/roles.js'

// Edit name, headline, location and (job seekers) skills.
// `onSaved(user)` receives the updated user from the API.
export default function ProfileDetailsForm({ user, onSaved }) {
  const isJobSeeker = user.role === ROLES.JOB_SEEKER
  const [form, setForm] = useState(() => ({
    name: user.name,
    headline: user.headline ?? '',
    location: user.location ?? '',
    skills: user.skills?.join(', ') ?? '',
  }))
  const [fieldErrors, setFieldErrors] = useState({})
  const [error, setError] = useState('')
  const [isSaved, setIsSaved] = useState(false)
  const [isSaving, setIsSaving] = useState(false)

  function handleChange(event) {
    const { name, value } = event.target
    setForm((prev) => ({ ...prev, [name]: value }))
    setFieldErrors((prev) => ({ ...prev, [name]: undefined }))
    setIsSaved(false) // hide "Saved" once there are new, unsaved edits
  }

  async function handleSubmit(event) {
    event.preventDefault()
    setError('')
    setIsSaved(false)
    setIsSaving(true)
    try {
      const updated = await updateProfile({
        name: form.name,
        headline: form.headline,
        location: form.location,
        // PUT replaces the whole profile; recruiters don't edit skills, so keep theirs.
        skills: isJobSeeker ? parseSkills(form.skills) : user.skills,
      })
      onSaved(updated)
      setIsSaved(true)
    } catch (err) {
      // "skills[3]" -> show under the skills input
      const apiErrors = Object.fromEntries(
        Object.entries(getFieldErrors(err)).map(([field, message]) => [field.startsWith('skills') ? 'skills' : field, message]),
      )
      setFieldErrors(apiErrors)
      setError(Object.keys(apiErrors).length > 0 ? 'Please fix the highlighted fields.' : getErrorMessage(err))
    } finally {
      setIsSaving(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {error && <Alert>{error}</Alert>}
      {isSaved && <Alert type="success">Profile saved.</Alert>}

      <div className="grid gap-4 sm:grid-cols-2">
        <FormField
          className="sm:col-span-2"
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
          className="sm:col-span-2"
          label="Headline"
          name="headline"
          maxLength={150}
          placeholder={isJobSeeker ? 'e.g. Frontend developer with 3 years of React' : 'e.g. Tech recruiter at Marina Bay Digital'}
          value={form.headline}
          onChange={handleChange}
          error={fieldErrors.headline}
          hint={isJobSeeker ? 'Recruiters see this when you apply.' : undefined}
        />
        <FormField
          label="Location"
          name="location"
          maxLength={100}
          placeholder="e.g. Singapore"
          value={form.location}
          onChange={handleChange}
          error={fieldErrors.location}
        />
        {isJobSeeker && (
          <FormField
            label="Skills"
            name="skills"
            placeholder="React, Node.js, MongoDB"
            value={form.skills}
            onChange={handleChange}
            error={fieldErrors.skills}
            hint="Separate skills with commas (up to 20)."
          />
        )}
      </div>

      <div className="flex justify-end">
        <Button type="submit" isLoading={isSaving} loadingText="Saving…">
          Save profile
        </Button>
      </div>
    </form>
  )
}
