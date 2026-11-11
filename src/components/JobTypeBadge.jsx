import { JOB_TYPE_LABELS, JOB_TYPES } from '../utils/jobs.js'

const COLORS = {
  [JOB_TYPES.FULL_TIME]: 'bg-indigo-50 text-indigo-700 ring-indigo-200',
  [JOB_TYPES.PART_TIME]: 'bg-amber-50 text-amber-800 ring-amber-200',
  [JOB_TYPES.REMOTE]: 'bg-emerald-50 text-emerald-700 ring-emerald-200',
}

export default function JobTypeBadge({ jobType }) {
  return (
    <span
      className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ring-1 ring-inset ${COLORS[jobType]}`}
    >
      {JOB_TYPE_LABELS[jobType]}
    </span>
  )
}
