import Button from './Button.jsx'
import { getErrorMessage } from '../services/api.js'

// A centred message with an optional action, for empty results and the like.
export function EmptyState({ title, children, action }) {
  return (
    <div className="rounded-xl border border-dashed border-slate-300 bg-white px-6 py-12 text-center">
      <h2 className="font-semibold text-slate-900">{title}</h2>
      {children && <p className="mt-1 text-sm text-slate-600">{children}</p>}
      {action && <div className="mt-4">{action}</div>}
    </div>
  )
}

// Shown when loading data failed, with a "Try again" button.
export function ErrorState({ error, onRetry, title = "We couldn't load this" }) {
  return (
    <div role="alert" className="rounded-xl border border-red-200 bg-red-50 px-6 py-10 text-center">
      <h2 className="font-semibold text-red-800">{title}</h2>
      <p className="mt-1 text-sm text-red-700">{getErrorMessage(error)}</p>
      {onRetry && (
        <Button variant="secondary" onClick={onRetry} className="mt-4">
          Try again
        </Button>
      )}
    </div>
  )
}
