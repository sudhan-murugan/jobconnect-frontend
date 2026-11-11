import { useAuth } from '../hooks/useAuth.js'
import { useDocumentTitle } from '../hooks/useDocumentTitle.js'
import { ROLE_LABELS, ROLES } from '../utils/roles.js'
import { formatFullDate } from '../utils/jobs.js'
import ProfileDetailsForm from '../components/ProfileDetailsForm.jsx'
import ProfileResumeCard from '../components/ProfileResumeCard.jsx'

function Section({ title, description, children }) {
  return (
    <section className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm sm:p-8">
      <h2 className="text-lg font-semibold text-slate-900">{title}</h2>
      {description && <p className="mt-1 text-sm text-slate-600">{description}</p>}
      <div className="mt-5">{children}</div>
    </section>
  )
}

// The logged-in user's profile (any role). Changes are saved to the API and
// pushed into AuthContext with updateUser(), so the whole app sees them.
export default function ProfilePage() {
  useDocumentTitle('Profile')
  const { user, updateUser } = useAuth()
  const isJobSeeker = user.role === ROLES.JOB_SEEKER

  return (
    <div className="mx-auto max-w-3xl space-y-6">
      <header>
        <h1 className="text-2xl font-bold text-slate-900 sm:text-3xl">Your profile</h1>
        <p className="mt-1 text-slate-600">
          {isJobSeeker
            ? 'Recruiters see your name, headline, location and skills when you apply.'
            : 'This is how you appear on JobConnect.'}
        </p>
      </header>

      <Section title="Profile details">
        <ProfileDetailsForm user={user} onSaved={updateUser} />
      </Section>

      {isJobSeeker && (
        <Section title="Resume" description="Your default resume for job applications.">
          <ProfileResumeCard user={user} onUserChange={updateUser} />
        </Section>
      )}

      <Section title="Account">
        <dl className="grid gap-4 text-sm sm:grid-cols-3">
          <div className="min-w-0">
            <dt className="text-slate-500">Email</dt>
            <dd className="truncate font-medium text-slate-900" title={user.email}>
              {user.email}
            </dd>
          </div>
          <div>
            <dt className="text-slate-500">Account type</dt>
            <dd className="font-medium text-slate-900">{ROLE_LABELS[user.role]}</dd>
          </div>
          <div>
            <dt className="text-slate-500">Member since</dt>
            <dd className="font-medium text-slate-900">{formatFullDate(user.createdAt)}</dd>
          </div>
        </dl>
      </Section>
    </div>
  )
}
