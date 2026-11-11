import Spinner from './Spinner.jsx'

const VARIANTS = {
  primary: 'bg-indigo-600 text-white hover:bg-indigo-700 focus-visible:outline-indigo-600',
  secondary:
    'bg-white text-slate-700 ring-1 ring-slate-300 ring-inset hover:bg-slate-50 focus-visible:outline-slate-400',
  danger: 'bg-red-600 text-white hover:bg-red-700 focus-visible:outline-red-600',
  'danger-outline':
    'bg-white text-red-700 ring-1 ring-red-200 ring-inset hover:bg-red-50 focus-visible:outline-red-600',
}

// Note: to change a variant's colours, add a new variant rather than passing
// e.g. "text-red-700" in className. When two Tailwind classes set the same
// property, the one later in the generated CSS wins, not the one later in className.

// A button with a built-in loading state. While `isLoading` is true it shows a
// spinner and is disabled, which also prevents double form submissions.
// `...props` passes any other attributes (type, onClick...) to the <button>.
export default function Button({
  variant = 'primary',
  isLoading = false,
  loadingText,
  className = '',
  children,
  disabled,
  ...props
}) {
  return (
    <button
      {...props}
      disabled={disabled || isLoading}
      className={`inline-flex items-center justify-center gap-2 rounded-md px-4 py-2 text-sm font-semibold shadow-sm transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 disabled:cursor-not-allowed disabled:opacity-60 ${VARIANTS[variant]} ${className}`}
    >
      {isLoading && <Spinner className="h-4 w-4" label={loadingText || 'Loading…'} />}
      {isLoading && loadingText ? loadingText : children}
    </button>
  )
}
