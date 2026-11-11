import { screen } from '@testing-library/react'
import { describe, expect, it } from 'vitest'
import JobCard from './JobCard.jsx'
import { renderWithProviders } from '../test/render.jsx'

const job = {
  _id: 'job123',
  title: 'Frontend Developer (React)',
  company: 'Marina Bay Digital',
  location: 'Singapore',
  jobType: 'full-time',
  salaryRange: { min: 5000, max: 7000, currency: 'SGD' },
  skills: ['React', 'JavaScript', 'CSS', 'Testing Library', 'Vite', 'Tailwind CSS', 'Git'],
  createdAt: new Date().toISOString(),
}

describe('JobCard', () => {
  it('shows the key details of a job', () => {
    renderWithProviders(<JobCard job={job} />)

    expect(screen.getByText('Marina Bay Digital · Singapore')).toBeInTheDocument()
    expect(screen.getByText('Full-time')).toBeInTheDocument()
    expect(screen.getByText('SGD 5,000 – 7,000 / month')).toBeInTheDocument()
    expect(screen.getByText('Posted today')).toBeInTheDocument()
  })

  it('links the title to the job page', () => {
    renderWithProviders(<JobCard job={job} />)

    expect(screen.getByRole('link', { name: 'Frontend Developer (React)' })).toHaveAttribute('href', '/jobs/job123')
  })

  it('shows the first five skills and how many more there are', () => {
    renderWithProviders(<JobCard job={job} />)

    const skills = screen.getByRole('list', { name: 'Skills' })
    expect(skills).toHaveTextContent('React')
    expect(skills).not.toHaveTextContent('Git')
    expect(screen.getByText('+2 more')).toBeInTheDocument()
  })

  it('leaves out the salary when the job has none', () => {
    renderWithProviders(<JobCard job={{ ...job, salaryRange: undefined }} />)

    expect(screen.queryByText(/\/ month/)).not.toBeInTheDocument()
  })
})
