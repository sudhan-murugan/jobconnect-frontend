// Entry point: Vite loads this file (see index.html) and React takes over the
// <div id="root"> element. Everything on screen is rendered from <App />.
import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'

createRoot(document.getElementById('root')).render(
  // StrictMode runs extra checks in development only (e.g. it runs effects
  // twice to surface missing cleanups). It has no effect in production builds.
  <StrictMode>
    <App />
  </StrictMode>,
)
