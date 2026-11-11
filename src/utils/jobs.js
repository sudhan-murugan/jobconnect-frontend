// Job-related constants and display helpers. Values must match the backend.
export const JOB_TYPES = Object.freeze({
  FULL_TIME: 'full-time',
  PART_TIME: 'part-time',
  REMOTE: 'remote',
})

export const JOB_TYPE_LABELS = {
  [JOB_TYPES.FULL_TIME]: 'Full-time',
  [JOB_TYPES.PART_TIME]: 'Part-time',
  [JOB_TYPES.REMOTE]: 'Remote',
}

export function isValidJobType(value) {
  return Object.values(JOB_TYPES).includes(value)
}

// Intl.* are built into JavaScript and format numbers and dates for a locale.
const numberFormat = new Intl.NumberFormat('en-SG')
const dateFormat = new Intl.DateTimeFormat('en-SG', { dateStyle: 'medium' })
const relativeFormat = new Intl.RelativeTimeFormat('en', { numeric: 'auto' })

// { min: 5000, max: 7000, currency: 'SGD' } -> "SGD 5,000 – 7,000 / month"
export function formatSalary(salaryRange) {
  if (!salaryRange) return null
  const { min, max, currency = 'SGD' } = salaryRange
  const amount =
    min === max ? numberFormat.format(min) : `${numberFormat.format(min)} – ${numberFormat.format(max)}`
  return `${currency} ${amount} / month`
}

// "2026-11-10T..." -> "today", "yesterday", "3 days ago", "2 weeks ago"...
export function formatPostedDate(isoDate) {
  const days = Math.floor((Date.now() - new Date(isoDate).getTime()) / (24 * 60 * 60 * 1000))
  if (days < 7) return relativeFormat.format(-days, 'day')
  if (days < 30) return relativeFormat.format(-Math.floor(days / 7), 'week')
  return dateFormat.format(new Date(isoDate))
}

export function formatFullDate(isoDate) {
  return dateFormat.format(new Date(isoDate))
}

// "React, Node.js ,, MongoDB" -> ["React", "Node.js", "MongoDB"]
export function parseSkills(text) {
  return text
    .split(',')
    .map((skill) => skill.trim())
    .filter(Boolean)
}
