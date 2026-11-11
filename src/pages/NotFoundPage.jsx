import { Link } from 'react-router'
import { useDocumentTitle } from '../hooks/useDocumentTitle.js'

export default function NotFoundPage() {
  useDocumentTitle('Page not found')
  return (
    <section className="py-16 text-center">
      <p className="text-sm font-semibold text-indigo-600">404</p>
      <h1 className="mt-2 text-3xl font-bold text-slate-900">Page not found</h1>
      <p className="mt-2 text-slate-600">The page you're looking for doesn't exist.</p>
      <Link
        to="/"
        className="mt-6 inline-block rounded-md bg-indigo-600 px-4 py-2 text-sm font-medium text-white hover:bg-indigo-700"
      >
        Back to home
      </Link>
    </section>
  )
}
