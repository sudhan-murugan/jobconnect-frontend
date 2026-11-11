import { APPLICATION_STATUSES, STATUS_LABELS } from '../utils/applications.js'

const COLORS = {
  [APPLICATION_STATUSES.APPLIED]: 'bg-slate-100 text-slate-700 ring-slate-300',
  [APPLICATION_STATUSES.SHORTLISTED]: 'bg-emerald-50 text-emerald-700 ring-emerald-200',
  [APPLICATION_STATUSES.REJECTED]: 'bg-red-50 text-red-700 ring-red-200',
}

// Shows an application's status as a coloured pill.
export default function StatusBadge({ status }) {
  return (
    <span
      className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ring-1 ring-inset ${COLORS[status]}`}
    >
      {STATUS_LABELS[status]}
    </span>
  )
}
