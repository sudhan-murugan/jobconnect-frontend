import DashboardHeader from '../components/DashboardHeader.jsx'

// Recruiter home page. Job posting and applicant review are built in Phases 4–5.
export default function RecruiterDashboardPage() {
  return (
    <div className="space-y-8">
      <DashboardHeader subtitle="Manage your job posts and applicants." />

      <section className="rounded-xl border border-dashed border-slate-300 bg-white p-8 text-center">
        <h2 className="font-semibold text-slate-900">My job posts</h2>
        <p className="mt-1 text-sm text-slate-600">Jobs you post will appear here.</p>
      </section>
    </div>
  )
}
