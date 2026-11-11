import { Outlet, ScrollRestoration, useNavigation } from 'react-router'
import Navbar from './Navbar.jsx'
import Footer from './Footer.jsx'

// A thin animated bar at the top of the page while React Router is loading the
// next page's code. Without it, clicking a link on a slow connection would
// seem to do nothing for a moment.
function NavigationProgress() {
  const navigation = useNavigation()
  if (navigation.state === 'idle') return null
  return (
    <div role="progressbar" aria-label="Loading page" className="fixed inset-x-0 top-0 z-50 h-1 overflow-hidden bg-indigo-100">
      <div className="h-full w-1/3 animate-[progress_1s_ease-in-out_infinite] bg-indigo-600" />
    </div>
  )
}

// The page frame shared by every route. <Outlet /> is a placeholder that
// React Router fills with whichever child route matches the current URL.
export default function Layout() {
  return (
    <div className="flex min-h-screen flex-col bg-slate-50 text-slate-800">
      {/* Lets keyboard users jump past the navbar; visible only when focused. */}
      <a
        href="#main-content"
        className="sr-only focus:not-sr-only focus:fixed focus:top-2 focus:left-2 focus:z-50 focus:rounded-md focus:bg-white focus:px-4 focus:py-2 focus:text-sm focus:font-semibold focus:text-indigo-700 focus:shadow"
      >
        Skip to main content
      </a>
      <NavigationProgress />
      <Navbar />
      <main id="main-content" tabIndex={-1} className="flex-1 focus:outline-none">
        <div className="mx-auto max-w-6xl px-4 py-10 sm:px-6">
          <Outlet />
        </div>
      </main>
      <Footer />
      {/* Scrolls to the top on each new page, and restores the previous
          position when going Back, like a traditional multi-page site. */}
      <ScrollRestoration />
    </div>
  )
}
