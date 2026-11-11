import { useCallback } from 'react'
import { useSearchParams } from 'react-router'
import { getJobs } from '../services/jobService.js'
import { useFetch } from '../hooks/useFetch.js'
import { useDocumentTitle } from '../hooks/useDocumentTitle.js'
import { isValidJobType } from '../utils/jobs.js'
import JobSearchForm from '../components/JobSearchForm.jsx'
import JobTypeFilter from '../components/JobTypeFilter.jsx'
import JobCard from '../components/JobCard.jsx'
import Pagination from '../components/Pagination.jsx'
import Button from '../components/Button.jsx'
import { JobListSkeleton } from '../components/JobCardSkeleton.jsx'
import { EmptyState, ErrorState } from '../components/StatusMessage.jsx'

const PAGE_SIZE = 10

export default function JobsPage() {
  useDocumentTitle('Find jobs')

  // The URL's query string (?keyword=react&page=2) is the single source of truth
  // for the search. That makes results shareable and the Back button work.
  const [searchParams, setSearchParams] = useSearchParams()
  const keyword = searchParams.get('keyword') ?? ''
  const location = searchParams.get('location') ?? ''
  const jobType = isValidJobType(searchParams.get('jobType')) ? searchParams.get('jobType') : ''
  const page = Math.max(1, Number.parseInt(searchParams.get('page'), 10) || 1)

  // Refetches whenever a search input changes (see hooks/useFetch.js).
  const fetchJobs = useCallback(
    (signal) => getJobs({ keyword, location, jobType, page, limit: PAGE_SIZE }, { signal }),
    [keyword, location, jobType, page],
  )
  const { data, error, isLoading, reload } = useFetch(fetchJobs)

  // Update some query params and go back to page 1 (new filters = new results).
  function updateFilters(changes) {
    setSearchParams((prev) => {
      const next = new URLSearchParams(prev)
      for (const [key, value] of Object.entries(changes)) {
        if (value) next.set(key, value)
        else next.delete(key)
      }
      next.delete('page')
      return next
    })
  }

  function getPageLink(pageNumber) {
    const next = new URLSearchParams(searchParams)
    if (pageNumber > 1) next.set('page', pageNumber)
    else next.delete('page')
    return `?${next}`
  }

  const hasFilters = Boolean(keyword || location || jobType)
  const jobs = data?.jobs ?? []
  const pagination = data?.pagination

  return (
    <div className="space-y-6">
      <header>
        <h1 className="text-2xl font-bold text-slate-900 sm:text-3xl">Find your next job</h1>
        <p className="mt-1 text-slate-600">Search by role, skill, company or location.</p>
      </header>

      <div className="space-y-3 rounded-xl border border-slate-200 bg-white p-4 shadow-sm">
        {/* Changing `key` remounts the form, resetting its inputs to match the
            URL, e.g. after the user presses Back. */}
        <JobSearchForm
          key={`${keyword}|${location}`}
          initialKeyword={keyword}
          initialLocation={location}
          onSearch={updateFilters}
        />
        <JobTypeFilter value={jobType} onChange={(value) => updateFilters({ jobType: value })} />
      </div>

      {error ? (
        <ErrorState error={error} onRetry={reload} title="We couldn't load jobs" />
      ) : !data ? (
        <JobListSkeleton count={5} />
      ) : (
        // While the next page loads, keep the old results visible but faded.
        <section aria-busy={isLoading} className={isLoading ? 'opacity-60 transition-opacity' : ''}>
          <p className="mb-3 text-sm text-slate-600" aria-live="polite">
            {pagination.total === 0
              ? 'No jobs found'
              : `${pagination.total} ${pagination.total === 1 ? 'job' : 'jobs'} found`}
            {pagination.totalPages > 1 && ` · page ${pagination.page} of ${pagination.totalPages}`}
          </p>

          {jobs.length === 0 ? (
            <EmptyState
              title={page > pagination.totalPages && pagination.total > 0 ? 'This page is empty' : 'No matching jobs'}
              action={
                hasFilters && (
                  <Button variant="secondary" onClick={() => setSearchParams({})}>
                    Clear all filters
                  </Button>
                )
              }
            >
              {hasFilters ? 'Try different keywords or remove some filters.' : 'New jobs will appear here.'}
            </EmptyState>
          ) : (
            <ul className="space-y-3">
              {jobs.map((job) => (
                <li key={job._id}>
                  <JobCard job={job} />
                </li>
              ))}
            </ul>
          )}

          <div className="mt-6">
            <Pagination page={page} totalPages={pagination.totalPages} getPageLink={getPageLink} />
          </div>
        </section>
      )}
    </div>
  )
}
