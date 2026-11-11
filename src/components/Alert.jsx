const STYLES = {
  error: 'border-red-200 bg-red-50 text-red-700',
  success: 'border-emerald-200 bg-emerald-50 text-emerald-700',
  info: 'border-indigo-200 bg-indigo-50 text-indigo-700',
}

// A message box. role="alert" makes screen readers announce it as soon as it appears.
export default function Alert({ type = 'error', children }) {
  return (
    <div role="alert" className={`rounded-md border px-4 py-3 text-sm ${STYLES[type]}`}>
      {children}
    </div>
  )
}
