// A row of toggle buttons where one option is active, e.g. job type or
// application status filters. Options: [{ value, label, count? }]
export default function FilterPills({ label, options, value, onChange }) {
  return (
    <div role="group" aria-label={label} className="flex flex-wrap gap-2">
      {options.map((option) => {
        const isActive = value === option.value
        return (
          <button
            key={option.value || 'all'}
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
            {option.count !== undefined && (
              <span className={`ml-1.5 ${isActive ? 'text-indigo-100' : 'text-slate-500'}`}>{option.count}</span>
            )}
          </button>
        )
      })}
    </div>
  )
}
