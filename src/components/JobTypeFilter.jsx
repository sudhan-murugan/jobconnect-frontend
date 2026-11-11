import FilterPills from './FilterPills.jsx'
import { JOB_TYPE_LABELS, JOB_TYPES } from '../utils/jobs.js'

const OPTIONS = [{ value: '', label: 'All types' }].concat(
  Object.values(JOB_TYPES).map((value) => ({ value, label: JOB_TYPE_LABELS[value] })),
)

// Job type filter for the jobs page; applies immediately on click.
export default function JobTypeFilter({ value, onChange }) {
  return <FilterPills label="Job type" options={OPTIONS} value={value} onChange={onChange} />
}
