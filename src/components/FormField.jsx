import { useId } from 'react'

// Label + input + hint/error message, wired together for accessibility:
// clicking the label focuses the input, and screen readers announce the
// error or hint together with the input.
//
// `as` picks the element: 'input' (default), 'textarea' or 'select'
// (pass <option>s as children for a select).
export default function FormField({
  label,
  error,
  hint,
  as: Component = 'input',
  children,
  className = '',
  ...inputProps
}) {
  // useId() creates a unique id that stays the same across re-renders.
  const id = useId()
  const messageId = `${id}-message`
  const message = error || hint

  return (
    <div className={className}>
      <label htmlFor={id} className="block text-sm font-medium text-slate-700">
        {label}
      </label>
      <Component
        id={id}
        aria-invalid={Boolean(error)}
        aria-describedby={message ? messageId : undefined}
        className={`mt-1 block w-full rounded-md border bg-white px-3 py-2 text-slate-900 shadow-sm placeholder:text-slate-400 focus:ring-2 focus:outline-none ${
          error
            ? 'border-red-400 focus:border-red-500 focus:ring-red-200'
            : 'border-slate-300 focus:border-indigo-500 focus:ring-indigo-200'
        }`}
        {...inputProps}
      >
        {children}
      </Component>
      {message && (
        <p id={messageId} className={`mt-1 text-sm ${error ? 'text-red-600' : 'text-slate-500'}`}>
          {message}
        </p>
      )}
    </div>
  )
}
