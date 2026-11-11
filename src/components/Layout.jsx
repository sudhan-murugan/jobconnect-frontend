import { Outlet } from 'react-router'
import Navbar from './Navbar.jsx'
import Footer from './Footer.jsx'

// The page frame shared by every route. <Outlet /> is a placeholder that
// React Router fills with whichever child route matches the current URL.
export default function Layout() {
  return (
    <div className="flex min-h-screen flex-col bg-slate-50 text-slate-800">
      <Navbar />
      <main className="flex-1">
        <div className="mx-auto max-w-6xl px-4 py-10 sm:px-6">
          <Outlet />
        </div>
      </main>
      <Footer />
    </div>
  )
}
