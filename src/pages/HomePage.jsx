// Placeholder landing page. Job search arrives in Phase 4.

// Keeping content in an array and rendering it with .map() avoids repeating markup.
const FEATURES = [
  {
    title: 'Search jobs',
    text: 'Filter openings by keyword, location and job type.',
  },
  {
    title: 'Apply in minutes',
    text: 'Send your resume and a short cover note straight to the recruiter.',
  },
  {
    title: 'Track progress',
    text: 'See whether each application is applied, shortlisted or rejected.',
  },
]

export default function HomePage() {
  return (
    <>
      <section className="py-10 text-center sm:py-16">
        <h1 className="text-4xl font-bold tracking-tight text-slate-900 sm:text-5xl">
          Find your next role
        </h1>
        <p className="mx-auto mt-4 max-w-2xl text-lg text-slate-600">
          JobConnect brings recruiters and job seekers together. Search openings, apply with your
          resume, and track every application in one place.
        </p>
      </section>

      <section className="grid gap-4 sm:grid-cols-3">
        {FEATURES.map((feature) => (
          // React needs a unique, stable "key" for each item in a list so it
          // can tell items apart when the list changes.
          <article
            key={feature.title}
            className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm"
          >
            <h2 className="font-semibold text-slate-900">{feature.title}</h2>
            <p className="mt-2 text-sm text-slate-600">{feature.text}</p>
          </article>
        ))}
      </section>
    </>
  )
}
