import { useState } from 'react'
import Button from './Button.jsx'

// Keyword + location search box, used on the home page and the jobs page.
// It keeps its own input state and reports the values only on submit.
export default function JobSearchForm({ initialKeyword = '', initialLocation = '', onSearch }) {
  const [keyword, setKeyword] = useState(initialKeyword)
  const [location, setLocation] = useState(initialLocation)

  function handleSubmit(event) {
    event.preventDefault()
    onSearch({ keyword: keyword.trim(), location: location.trim() })
  }

  const inputClass =
    'block w-full rounded-md border border-slate-300 bg-white px-3 py-2.5 text-slate-900 shadow-sm placeholder:text-slate-400 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 focus:outline-none'

  return (
    <form role="search" onSubmit={handleSubmit} className="flex flex-col gap-2 sm:flex-row">
      {/* Visually hidden labels (sr-only) still name the inputs for screen readers. */}
      <label className="flex-1">
        <span className="sr-only">Keyword</span>
        <input
          type="search"
          value={keyword}
          onChange={(event) => setKeyword(event.target.value)}
          placeholder="Job title, skill or company"
          maxLength={100}
          className={inputClass}
        />
      </label>
      <label className="sm:w-56">
        <span className="sr-only">Location</span>
        <input
          type="search"
          value={location}
          onChange={(event) => setLocation(event.target.value)}
          placeholder="Location"
          maxLength={100}
          className={inputClass}
        />
      </label>
      <Button type="submit" className="py-2.5 sm:px-6">
        Search
      </Button>
    </form>
  )
}
