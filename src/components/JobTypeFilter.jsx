import { JOB_TYPE_LABELS, JOB_TYPES } from '../utils/jobs.js'

const OPTIONS = [{ value: '', label: 'All types' }].concat(
  Object.values(JOB_TYPES).map((value) => ({ value, label: JOB_TYPE_LABELS[value] })),
)

// A row of toggle buttons for the job type filter; applies immediately on click.
export default function JobTypeFilter({ value, onChange }) {
  return (
    <div role="group" aria-label="Job type" className="flex flex-wrap gap-2">
      {OPTIONS.map((option) => {
        const isActive = value === option.value
        return (
          <button
            key={option.label}
            type="button"
            aria-pressed={isActive}
            onClick={() => onChange(option.value)}
            className={`rounded-full px-3 py-1.5 text-sm font-medium ring-1 transition-colors ring-inset ${
              isActive
                ? 'bg-indigo-600 text-white ring-indigo-600'
                : 'bg-white text-slate-700 ring-slate-300 hover:bg-slate-50'
            }`}
          >
            {option.label}
          </button>
        )
      })}
    </div>
  )
}
