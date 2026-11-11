// Role values must match the backend exactly.
export const ROLES = Object.freeze({
  JOB_SEEKER: 'job_seeker',
  RECRUITER: 'recruiter',
})

export const ROLE_LABELS = {
  [ROLES.JOB_SEEKER]: 'Job seeker',
  [ROLES.RECRUITER]: 'Recruiter',
}

// Each role has its own home page after logging in.
export function dashboardPathFor(role) {
  return role === ROLES.RECRUITER ? '/recruiter/dashboard' : '/seeker/dashboard'
}
