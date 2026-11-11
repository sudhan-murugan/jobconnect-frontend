import { useEffect, useState } from 'react'
import { useLocation, useNavigate } from 'react-router'

/**
 * Reads a one-time success message passed along with a navigation, e.g.
 *   navigate(`/jobs/${id}`, { state: { flash: 'Job posted' } })
 *
 * The message is copied into state once, then removed from the browser history
 * entry, so it doesn't reappear when the user refreshes or comes back later.
 */
export function useFlashMessage() {
  const location = useLocation()
  const navigate = useNavigate()
  // The initializer function runs only on the first render.
  const [message] = useState(() => location.state?.flash ?? null)

  useEffect(() => {
    if (location.state?.flash) {
      // Keep any other state, minus the flash message.
      const remainingState = { ...location.state }
      delete remainingState.flash
      navigate(`${location.pathname}${location.search}`, { replace: true, state: remainingState })
    }
  }, [location, navigate])

  return message
}
