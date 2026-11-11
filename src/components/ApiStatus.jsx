import { useEffect, useState } from 'react'
import { getHealth } from '../services/api.js'

const STATUS_STYLES = {
  checking: { dot: 'bg-slate-400', label: 'Checking API…' },
  online: { dot: 'bg-emerald-500', label: 'API online' },
  offline: { dot: 'bg-red-500', label: 'API offline' },
}

// Small indicator that calls the backend's /health endpoint, to confirm the
// frontend can reach the API (correct URL in .env and CORS set up).
export default function ApiStatus() {
  // useState holds data that, when changed, re-renders the component.
  const [status, setStatus] = useState('checking')

  // useEffect runs side effects (like network requests) AFTER render.
  // The empty dependency array [] means "run once when the component mounts".
  useEffect(() => {
    let ignore = false

    getHealth()
      .then(() => !ignore && setStatus('online'))
      .catch(() => !ignore && setStatus('offline'))

    // Cleanup: if the component unmounts before the request finishes, skip
    // the state update for this (now outdated) request.
    return () => {
      ignore = true
    }
  }, [])

  const { dot, label } = STATUS_STYLES[status]

  return (
    <span className="inline-flex items-center gap-2" role="status">
      <span className={`h-2 w-2 rounded-full ${dot}`} aria-hidden="true" />
      {label}
    </span>
  )
}
