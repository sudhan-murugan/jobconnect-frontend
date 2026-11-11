// Animated loading indicator. `label` is read out by screen readers.
export default function Spinner({ label = 'Loading…', className = 'h-5 w-5' }) {
  return (
    <svg
      className={`animate-spin text-current ${className}`}
      viewBox="0 0 24 24"
      fill="none"
      role="status"
      aria-label={label}
    >
      <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" className="opacity-25" />
      <path fill="currentColor" d="M4 12a8 8 0 0 1 8-8v4a4 4 0 0 0-4 4H4Z" className="opacity-75" />
    </svg>
  )
}

// Full-area version used while a page or the session is loading.
export function PageLoader({ label = 'Loading…' }) {
  return (
    <div className="flex justify-center py-20 text-indigo-600">
      <Spinner label={label} className="h-8 w-8" />
    </div>
  )
}
