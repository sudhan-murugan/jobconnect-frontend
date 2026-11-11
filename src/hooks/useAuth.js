import { useContext } from 'react'
import { AuthContext } from '../context/AuthContext.js'

// A custom hook is a function whose name starts with "use" and that calls
// other hooks. This one gives any component the auth state:
//   const { user, login, logout } = useAuth()
export function useAuth() {
  const context = useContext(AuthContext)
  if (!context) {
    throw new Error('useAuth() must be used inside <AuthProvider>')
  }
  return context
}
