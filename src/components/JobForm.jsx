import { useState } from 'react'
import { Link } from 'react-router'
import FormField from './FormField.jsx'
import Button from './Button.jsx'
import Alert from './Alert.jsx'
import { getErrorMessage, getFieldErrors } from '../services/api.js'
import { JOB_TYPE_LABELS, JOB_TYPES, parseSkills } from '../utils/jobs.js'

const DESCRIPTION_MAX = 5000

// Form state holds strings (that's what inputs give us); toPayload() converts
// them into the shape the API expects.
function toFormState(job) {
  return {
    title: job?.title ?? '',
    company: job?.company ?? '',
    location: job?.location ?? '',
    jobType: job?.jobType ?? JOB_TYPES.FULL_TIME,
    description: job?.description ?? '',
    skills: job?.skills?.join(', ') ?? '',
    salaryMin: job?.salaryRange?.min?.toString() ?? '',
    salaryMax: job?.salaryRange?.max?.toString() ?? '',
    currency: job?.salaryRange?.currency ?? 'SGD',
  }
}

function toPayload(form) {
  const payload = {
    title: form.title,
    company: form.company,
    location: form.location,
    jobType: form.jobType,
    description: form.description,
    skills: parseSkills(form.skills),
  }
  // Salary is optional: only send it if the recruiter filled it in.
  if (form.salaryMin !== '' || form.salaryMax !== '') {
    payload.salaryRange = {
      min: Number(form.salaryMin),
      max: Number(form.salaryMax),
      currency: form.currency.trim().toUpperCase() || 'SGD',
    }
  }
  return payload
}

// Checks that are quicker to do in the browser. The API validates everything again.
function validateSalary(form) {
  const errors = {}
  const hasMin = form.salaryMin !== ''
  const hasMax = form.salaryMax !== ''
  if (hasMin && !hasMax) errors.salaryMax = 'Enter a maximum too, or clear the minimum'
  if (hasMax && !hasMin) errors.salaryMin = 'Enter a minimum too, or clear the maximum'
  if (hasMin && hasMax && Number(form.salaryMax) < Number(form.salaryMin)) {
    errors.salaryMax = 'Maximum must be at least the minimum'
  }
  return errors
}

// The API names some fields differently from our inputs, e.g. "salaryRange.max"
// or "skills[2]". Map them so each error shows under the right input.
function mapApiFieldErrors(apiErrors) {
  const errors = {}
  for (const [field, message] of Object.entries(apiErrors)) {
    if (field === 'salaryRange.min' || field === 'salaryRange') errors.salaryMin = message
    else if (field === 'salaryRange.max') errors.salaryMax = message
    else if (field === 'salaryRange.currency') errors.currency = message
    else if (field.startsWith('skills')) errors.skills = message
    else errors[field] = message
  }
  return errors
}

// Shared by "Post a job" and "Edit job". `onSubmit` receives the API payload
// and should return a promise; errors it throws are shown on the form.
export default function JobForm({ initialJob, submitLabel, submittingLabel, cancelTo, onSubmit }) {
  const [form, setForm] = useState(() => toFormState(initialJob))
  const [fieldErrors, setFieldErrors] = useState({})
  const [error, setError] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)

  function handleChange(event) {
    const { name, value } = event.target
    setForm((prev) => ({ ...prev, [name]: value }))
    setFieldErrors((prev) => ({ ...prev, [name]: undefined }))
  }

  async function handleSubmit(event) {
    event.preventDefault()
    setError('')

    const clientErrors = validateSalary(form)
    if (Object.keys(clientErrors).length > 0) {
      setFieldErrors(clientErrors)
      return
    }

    setIsSubmitting(true)
    try {
      await onSubmit(toPayload(form))
      // On success the parent navigates away, so there's nothing else to do here.
    } catch (err) {
      const apiErrors = mapApiFieldErrors(getFieldErrors(err))
      setFieldErrors(apiErrors)
      setError(
        Object.keys(apiErrors).length > 0 ? 'Please fix the highlighted fields.' : getErrorMessage(err),
      )
      setIsSubmitting(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {error && <Alert>{error}</Alert>}

      <section className="grid gap-4 sm:grid-cols-2">
        <FormField
          className="sm:col-span-2"
          label="Job title"
          name="title"
          required
          maxLength={120}
          placeholder="e.g. Frontend Developer (React)"
          value={form.title}
          onChange={handleChange}
          error={fieldErrors.title}
        />
        <FormField
          label="Company"
          name="company"
          required
          maxLength={100}
          value={form.company}
          onChange={handleChange}
          error={fieldErrors.company}
        />
        <FormField
          label="Location"
          name="location"
          required
          maxLength={100}
          placeholder="e.g. Singapore (Hybrid)"
          value={form.location}
          onChange={handleChange}
          error={fieldErrors.location}
        />
        <FormField
          as="select"
          label="Job type"
          name="jobType"
          value={form.jobType}
          onChange={handleChange}
          error={fieldErrors.jobType}
        >
          {Object.values(JOB_TYPES).map((type) => (
            <option key={type} value={type}>
              {JOB_TYPE_LABELS[type]}
            </option>
          ))}
        </FormField>
        <FormField
          label="Skills"
          name="skills"
          placeholder="React, Node.js, MongoDB"
          value={form.skills}
          onChange={handleChange}
          error={fieldErrors.skills}
          hint="Separate skills with commas (up to 20)."
        />
      </section>

      <fieldset>
        <legend className="text-sm font-medium text-slate-700">
          Monthly salary <span className="font-normal text-slate-500">(optional)</span>
        </legend>
        <div className="mt-1 grid grid-cols-2 gap-4 sm:grid-cols-[1fr_1fr_8rem]">
          <FormField
            label="Minimum"
            name="salaryMin"
            type="number"
            inputMode="numeric"
            min={0}
            step={100}
            value={form.salaryMin}
            onChange={handleChange}
            error={fieldErrors.salaryMin}
          />
          <FormField
            label="Maximum"
            name="salaryMax"
            type="number"
            inputMode="numeric"
            min={0}
            step={100}
            value={form.salaryMax}
            onChange={handleChange}
            error={fieldErrors.salaryMax}
          />
          <FormField
            label="Currency"
            name="currency"
            maxLength={3}
            value={form.currency}
            onChange={handleChange}
            error={fieldErrors.currency}
          />
        </div>
      </fieldset>

      <FormField
        as="textarea"
        label="Description"
        name="description"
        required
        minLength={30}
        maxLength={DESCRIPTION_MAX}
        rows={10}
        placeholder="What will the person do? What do you offer? What experience do they need?"
        value={form.description}
        onChange={handleChange}
        error={fieldErrors.description}
        hint={`${form.description.length} / ${DESCRIPTION_MAX} characters (minimum 30)`}
      />

      <div className="flex flex-col-reverse gap-2 border-t border-slate-200 pt-6 sm:flex-row sm:justify-end">
        <Link
          to={cancelTo}
          className="inline-flex items-center justify-center rounded-md px-4 py-2 text-sm font-semibold text-slate-700 ring-1 ring-slate-300 ring-inset hover:bg-slate-50"
        >
          Cancel
        </Link>
        <Button type="submit" isLoading={isSubmitting} loadingText={submittingLabel}>
          {submitLabel}
        </Button>
      </div>
    </form>
  )
}
