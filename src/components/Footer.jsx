import ApiStatus from './ApiStatus.jsx'

const SOURCE_LINKS = [
  { href: 'https://github.com/sudhan-murugan/jobconnect-frontend', label: 'Frontend' },
  { href: 'https://github.com/sudhan-murugan/jobconnect-backend', label: 'API' },
]

export default function Footer() {
  return (
    <footer className="border-t border-slate-200 bg-white">
      <div className="mx-auto flex max-w-6xl flex-col gap-2 px-4 py-6 text-sm text-slate-500 sm:flex-row sm:items-center sm:justify-between sm:px-6">
        <p>
          © {new Date().getFullYear()} JobConnect · Source code:{' '}
          {SOURCE_LINKS.map((link, index) => (
            <span key={link.href}>
              {index > 0 && ' · '}
              {/* rel="noreferrer" stops the new tab from accessing this page (window.opener). */}
              <a href={link.href} target="_blank" rel="noreferrer" className="hover:text-slate-700 hover:underline">
                {link.label}
              </a>
            </span>
          ))}
        </p>
        <ApiStatus />
      </div>
    </footer>
  )
}
