import { screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, expect, it, vi } from 'vitest'
import JobForm from './JobForm.jsx'
import { renderWithProviders } from '../test/render.jsx'

function renderForm(props = {}) {
  const onSubmit = props.onSubmit ?? vi.fn().mockResolvedValue()
  renderWithProviders(
    <JobForm submitLabel="Publish job" submittingLabel="Publishing…" cancelTo="/" onSubmit={onSubmit} {...props} />,
  )
  return { onSubmit, user: userEvent.setup() }
}

async function fillRequiredFields(user) {
  await user.type(screen.getByLabelText('Job title'), 'Backend Engineer')
  await user.type(screen.getByLabelText('Company'), 'Test Co')
  await user.type(screen.getByLabelText('Location'), 'Singapore')
  await user.type(screen.getByLabelText('Description'), 'Design and build reliable REST APIs for our platform.')
}

describe('JobForm', () => {
  it('sends the API payload: skills as a list, salary as numbers', async () => {
    const { onSubmit, user } = renderForm()
    await fillRequiredFields(user)
    await user.selectOptions(screen.getByLabelText('Job type'), 'remote')
    await user.type(screen.getByLabelText('Skills'), 'Node.js, Express ,, MongoDB')
    await user.type(screen.getByLabelText('Minimum'), '6000')
    await user.type(screen.getByLabelText('Maximum'), '8000')

    await user.click(screen.getByRole('button', { name: 'Publish job' }))

    expect(onSubmit).toHaveBeenCalledWith({
      title: 'Backend Engineer',
      company: 'Test Co',
      location: 'Singapore',
      jobType: 'remote',
      description: 'Design and build reliable REST APIs for our platform.',
      skills: ['Node.js', 'Express', 'MongoDB'],
      salaryRange: { min: 6000, max: 8000, currency: 'SGD' },
    })
  })

  it('leaves out the salary when both amounts are empty', async () => {
    const { onSubmit, user } = renderForm()
    await fillRequiredFields(user)

    await user.click(screen.getByRole('button', { name: 'Publish job' }))

    expect(onSubmit.mock.calls[0][0]).not.toHaveProperty('salaryRange')
  })

  it('blocks submitting when the maximum salary is below the minimum', async () => {
    const { onSubmit, user } = renderForm()
    await fillRequiredFields(user)
    await user.type(screen.getByLabelText('Minimum'), '8000')
    await user.type(screen.getByLabelText('Maximum'), '6000')

    await user.click(screen.getByRole('button', { name: 'Publish job' }))

    expect(screen.getByText('Maximum must be at least the minimum')).toBeInTheDocument()
    expect(onSubmit).not.toHaveBeenCalled()
  })

  it('shows API validation errors under the matching inputs', async () => {
    const apiError = {
      response: {
        status: 400,
        data: { message: 'Validation failed', details: [{ field: 'salaryRange.currency', message: 'Currency must be a 3-letter code such as SGD' }] },
      },
    }
    const { user } = renderForm({ onSubmit: vi.fn().mockRejectedValue(apiError) })
    await fillRequiredFields(user)
    await user.type(screen.getByLabelText('Minimum'), '1000')
    await user.type(screen.getByLabelText('Maximum'), '2000')

    await user.click(screen.getByRole('button', { name: 'Publish job' }))

    expect(await screen.findByText('Currency must be a 3-letter code such as SGD')).toBeInTheDocument()
    expect(screen.getByLabelText('Currency')).toHaveAttribute('aria-invalid', 'true')
    expect(screen.getByRole('alert')).toHaveTextContent('Please fix the highlighted fields.')
  })

  it('pre-fills the form when editing a job', () => {
    renderForm({
      initialJob: {
        title: 'Data Analyst',
        company: 'Merlion Analytics',
        location: 'Singapore',
        jobType: 'part-time',
        description: 'Turn business questions into dashboards and insights.',
        skills: ['SQL', 'Python'],
        salaryRange: { min: 3000, max: 4000, currency: 'USD' },
      },
    })

    expect(screen.getByLabelText('Job title')).toHaveValue('Data Analyst')
    expect(screen.getByLabelText('Job type')).toHaveValue('part-time')
    expect(screen.getByLabelText('Skills')).toHaveValue('SQL, Python')
    expect(screen.getByLabelText('Minimum')).toHaveValue(3000)
    expect(screen.getByLabelText('Currency')).toHaveValue('USD')
  })
})
