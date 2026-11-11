import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import { formatPostedDate, formatSalary, isValidJobType, parseSkills } from './jobs.js'
import { formatFileSize, validateResumeFile } from './applications.js'

describe('formatSalary', () => {
  it('formats a monthly range with the currency', () => {
    expect(formatSalary({ min: 5000, max: 7000, currency: 'SGD' })).toBe('SGD 5,000 – 7,000 / month')
  })

  it('shows a single amount when min and max are equal', () => {
    expect(formatSalary({ min: 4000, max: 4000, currency: 'USD' })).toBe('USD 4,000 / month')
  })

  it('returns null when there is no salary', () => {
    expect(formatSalary(undefined)).toBeNull()
  })
})

describe('parseSkills', () => {
  it('splits on commas, trims and drops empty entries', () => {
    expect(parseSkills(' React, Node.js ,, MongoDB ,')).toEqual(['React', 'Node.js', 'MongoDB'])
  })
})

describe('isValidJobType', () => {
  it('accepts only the known job types', () => {
    expect(isValidJobType('remote')).toBe(true)
    expect(isValidJobType('intern')).toBe(false)
    expect(isValidJobType(null)).toBe(false)
  })
})

describe('formatPostedDate', () => {
  // Freeze "now" so the relative dates are predictable.
  beforeEach(() => {
    vi.useFakeTimers()
    vi.setSystemTime(new Date('2026-11-11T12:00:00Z'))
  })
  afterEach(() => vi.useRealTimers())

  it.each([
    ['2026-11-11T08:00:00Z', 'today'],
    ['2026-11-10T08:00:00Z', 'yesterday'],
    ['2026-11-08T12:00:00Z', '3 days ago'],
    ['2026-10-28T12:00:00Z', '2 weeks ago'],
  ])('%s -> %s', (date, expected) => {
    expect(formatPostedDate(date)).toBe(expected)
  })

  it('shows the full date for anything older than a month', () => {
    expect(formatPostedDate('2026-08-01T12:00:00Z')).toBe('1 Aug 2026')
  })
})

describe('resume file helpers', () => {
  const file = (name, type, size) => new File([new Uint8Array(size)], name, { type })

  it('accepts a PDF under 5 MB', () => {
    expect(validateResumeFile(file('cv.pdf', 'application/pdf', 1000))).toBeNull()
  })

  it.each([
    ['no file', null, 'Attach your resume as a PDF'],
    ['a Word document', file('cv.docx', 'application/msword', 1000), 'Resume must be a PDF file'],
    ['a PDF over 5 MB', file('cv.pdf', 'application/pdf', 6 * 1024 * 1024), 'Resume must be 5 MB or smaller'],
  ])('rejects %s', (_, input, message) => {
    expect(validateResumeFile(input)).toBe(message)
  })

  it('formats file sizes', () => {
    expect(formatFileSize(512)).toBe('512 B')
    expect(formatFileSize(84213)).toBe('82 KB')
    expect(formatFileSize(2.5 * 1024 * 1024)).toBe('2.5 MB')
  })
})
