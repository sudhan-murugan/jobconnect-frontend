import { Link } from 'react-router'

// Which page numbers to show, e.g. for page 6 of 12: [1, '…', 5, 6, 7, '…', 12]
function getPageItems(page, totalPages) {
  const pages = new Set([1, totalPages, page - 1, page, page + 1])
  const sorted = [...pages].filter((p) => p >= 1 && p <= totalPages).sort((a, b) => a - b)

  const items = []
  sorted.forEach((p, index) => {
    if (index > 0 && p - sorted[index - 1] > 1) items.push('…')
    items.push(p)
  })
  return items
}

// Pagination built from real links (not buttons), so each page has its own
// URL: it can be bookmarked, shared, or opened in a new tab.
// `getPageLink(n)` returns the URL for page n.
export default function Pagination({ page, totalPages, getPageLink }) {
  if (totalPages <= 1) return null

  const baseClass = 'inline-flex min-w-9 items-center justify-center rounded-md px-3 py-2 text-sm font-medium'
  const linkClass = `${baseClass} text-slate-700 ring-1 ring-slate-300 ring-inset hover:bg-slate-50`
  const disabledClass = `${baseClass} cursor-not-allowed text-slate-300 ring-1 ring-slate-200 ring-inset`

  return (
    <nav aria-label="Pagination" className="flex flex-wrap items-center justify-center gap-1.5">
      {page > 1 ? (
        <Link to={getPageLink(page - 1)} className={linkClass}>
          ← Prev
        </Link>
      ) : (
        <span className={disabledClass}>← Prev</span>
      )}

      {getPageItems(page, totalPages).map((item, index) =>
        item === '…' ? (
          <span key={`gap-${index}`} className="hidden px-1 text-slate-400 sm:inline">
            …
          </span>
        ) : (
          <Link
            key={item}
            to={getPageLink(item)}
            aria-current={item === page ? 'page' : undefined}
            className={
              item === page ? `${baseClass} bg-indigo-600 text-white` : `${linkClass} hidden sm:inline-flex`
            }
          >
            {item}
          </Link>
        ),
      )}

      {page < totalPages ? (
        <Link to={getPageLink(page + 1)} className={linkClass}>
          Next →
        </Link>
      ) : (
        <span className={disabledClass}>Next →</span>
      )}
    </nav>
  )
}
