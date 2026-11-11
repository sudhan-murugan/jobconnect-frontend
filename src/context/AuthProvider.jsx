import { useCallback, useEffect, useMemo, useState } from 'react'
import { AuthContext } from './AuthContext.js'
import { tokenStorage } from '../services/tokenStorage.js'
import { setUnauthorizedHandler } from '../services/api.js'
import { fetchCurrentUser, loginUser, registerUser } from '../services/authService.js'

// Holds the auth state for the whole app and shares it through AuthContext.
// Wrap the app in <AuthProvider>, then read it anywhere with useAuth().
export default function AuthProvider({ children }) {
  const [user, setUser] = useState(null)
  // If a token is saved from a previous visit, we must ask the API who it
  // belongs to before deciding whether the user is logged in. Until then,
  // isLoading is true so protected pages wait instead of redirecting to /login.
  const [isLoading, setIsLoading] = useState(() => Boolean(tokenStorage.get()))

  // On first load: restore the session from a saved token.
  useEffect(() => {
    if (!tokenStorage.get()) return

    let ignore = false
    fetchCurrentUser()
      .then((currentUser) => {
        if (!ignore) setUser(currentUser)
      })
      .catch((error) => {
        // 401 = token expired or invalid, so forget it. On other errors (e.g.
        // server down) keep the token so the next page load can try again.
        if (error.response?.status === 401) tokenStorage.clear()
      })
      .finally(() => {
        if (!ignore) setIsLoading(false)
      })

    return () => {
      ignore = true
    }
  }, [])

  // If any API call later returns 401 (e.g. the token expired mid-session),
  // log out locally. Protected pages will then redirect to /login.
  useEffect(() => {
    setUnauthorizedHandler(() => {
      tokenStorage.clear()
      setUser(null)
    })
    return () => setUnauthorizedHandler(null)
  }, [])

  // useCallback keeps the same function between renders, so components using
  // these functions don't re-render just because the provider re-rendered.
  const login = useCallback(async (credentials) => {
    const { token, user: loggedInUser } = await loginUser(credentials)
    tokenStorage.set(token)
    setUser(loggedInUser)
    return loggedInUser
  }, [])

  const register = useCallback(async (details) => {
    const { token, user: newUser } = await registerUser(details)
    tokenStorage.set(token)
    setUser(newUser)
    return newUser
  }, [])

  // JWTs are stateless: the server keeps no session, so logging out just
  // means forgetting the token on this device.
  const logout = useCallback(() => {
    tokenStorage.clear()
    setUser(null)
  }, [])

  // After the profile changes (e.g. PUT /api/users/me), store the user the API
  // returned so the navbar, dashboards etc. show the new details right away.
  const updateUser = useCallback((updatedUser) => setUser(updatedUser), [])

  // useMemo: only create a new value object when something in it changes,
  // otherwise every consumer would re-render on every provider render.
  const value = useMemo(
    () => ({ user, isAuthenticated: Boolean(user), isLoading, login, register, logout, updateUser }),
    [user, isLoading, login, register, logout, updateUser],
  )

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}
