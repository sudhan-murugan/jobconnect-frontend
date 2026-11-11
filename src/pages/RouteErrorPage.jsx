import { isRouteErrorResponse, Link, useRouteError } from 'react-router'
import { useDocumentTitle } from '../hooks/useDocumentTitle.js'

// Shown by React Router when something throws while rendering a page (a bug),
// or when a page's code fails to download (e.g. a new version was deployed
// while the tab was open). It replaces the crashed page instead of a blank screen.
export default function RouteErrorPage() {
  useDocumentTitle('Something went wrong')
  const error = useRouteError()

  // Failed dynamic import of a page's JavaScript file (see lazy routes in App.jsx).
  const isChunkLoadError = error instanceof TypeError && /dynamically imported module|import/i.test(error.message)

  const details = isRouteErrorResponse(error) ? `${error.status} ${error.statusText}` : error?.message

  return (
    <section role="alert" className="py-16 text-center">
      <p className="text-sm font-semibold text-indigo-600">Error</p>
      <h1 className="mt-2 text-3xl font-bold text-slate-900">Something went wrong</h1>
      <p className="mx-auto mt-2 max-w-md text-slate-600">
        {isChunkLoadError
          ? 'A new version of JobConnect may be available. Reloading the page usually fixes this.'
          : 'An unexpected error occurred. Try reloading the page; if it keeps happening, go back to the home page.'}
      </p>
      {/* Technical details help while developing; hidden in production builds. */}
      {import.meta.env.DEV && details && (
        <pre className="mx-auto mt-4 max-w-xl overflow-x-auto rounded-md bg-slate-100 p-3 text-left text-xs text-slate-700">
          {details}
        </pre>
      )}
      <div className="mt-6 flex justify-center gap-3">
        <button
          type="button"
          onClick={() => window.location.reload()}
          className="rounded-md bg-indigo-600 px-4 py-2 text-sm font-semibold text-white hover:bg-indigo-700"
        >
          Reload page
        </button>
        <Link
          to="/"
          reloadDocument // a full page load, in case the app's state is broken
          className="rounded-md px-4 py-2 text-sm font-semibold text-slate-700 ring-1 ring-slate-300 ring-inset hover:bg-slate-50"
        >
          Go to home page
        </Link>
      </div>
    </section>
  )
}
