import DashboardHeader from '../components/DashboardHeader.jsx'
import { useDocumentTitle } from '../hooks/useDocumentTitle.js'

// Job seeker home page. The applications list is built in Phase 5.
export default function SeekerDashboardPage() {
  useDocumentTitle('Dashboard')
  return (
    <div className="space-y-8">
      <DashboardHeader subtitle="Track the jobs you've applied to." />

      <section className="rounded-xl border border-dashed border-slate-300 bg-white p-8 text-center">
        <h2 className="font-semibold text-slate-900">My applications</h2>
        <p className="mt-1 text-sm text-slate-600">Jobs you apply to will appear here.</p>
      </section>
    </div>
  )
}
