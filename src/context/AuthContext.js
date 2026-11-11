import { createContext } from 'react'

// Context lets any component read shared data (here: the logged-in user)
// without passing props down through every level of the tree.
//
// The context object lives in its own file, separate from <AuthProvider> and
// the useAuth() hook, because Vite's fast refresh works best when a .jsx file
// exports only components.
export const AuthContext = createContext(null)
