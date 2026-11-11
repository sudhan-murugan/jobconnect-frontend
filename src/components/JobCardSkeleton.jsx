// Grey placeholder shaped like a JobCard, shown while jobs load. Skeletons
// make loading feel faster than a spinner because the layout doesn't jump.
export default function JobCardSkeleton() {
  return (
    <div aria-hidden="true" className="animate-pulse rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
      <div className="flex justify-between gap-4">
        <div className="h-5 w-2/3 rounded bg-slate-200" />
        <div className="h-5 w-16 rounded-full bg-slate-200" />
      </div>
      <div className="mt-2 h-4 w-1/2 rounded bg-slate-200" />
      <div className="mt-4 h-4 w-1/3 rounded bg-slate-200" />
      <div className="mt-4 flex gap-2">
        <div className="h-5 w-14 rounded bg-slate-200" />
        <div className="h-5 w-16 rounded bg-slate-200" />
        <div className="h-5 w-12 rounded bg-slate-200" />
      </div>
    </div>
  )
}

// A list of skeleton cards plus a screen-reader-only "Loading" message.
export function JobListSkeleton({ count = 3, label = 'Loading jobs…' }) {
  return (
    <div className="space-y-3" role="status">
      <span className="sr-only">{label}</span>
      {Array.from({ length: count }, (_, index) => (
        <JobCardSkeleton key={index} />
      ))}
    </div>
  )
}
