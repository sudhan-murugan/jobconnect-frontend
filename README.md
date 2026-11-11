# JobConnect Frontend

React frontend for **JobConnect**, a job portal where recruiters post jobs and job seekers search and apply.

> **Status:** Phase 2 (authentication). Register, log in, log out, and role-based dashboards behind protected routes; features are added phase by phase (see [Roadmap](#roadmap)).

Backend repo: [jobconnect-backend](https://github.com/sudhan-murugan/jobconnect-backend)

## Tech stack

- **React 19** with **Vite** (dev server and build)
- **React Router** for client-side routing
- **Axios** for HTTP requests (one shared instance in `src/services/api.js`, with a JWT interceptor)
- **React Context** for auth state (`AuthProvider` + `useAuth()` hook)
- **Tailwind CSS v4** for responsive styling
- **ESLint** for linting
- **Planned:** React Testing Library

## Features so far

- Sign up as a **job seeker** or a **recruiter**, log in, log out
- Session survives page reloads (token saved, user restored via `GET /api/auth/me`)
- Protected routes: logged-out visitors are sent to login, then back to the page they wanted
- Role-based routes: each role has its own dashboard; other roles see a 403 page
- Form validation messages from the API shown under the matching field
- Expired or invalid tokens log the user out automatically

## Routes

| Path                   | Who can see it         |
| ---------------------- | ---------------------- |
| `/`                    | Everyone               |
| `/login`, `/register`  | Logged-out visitors    |
| `/seeker/dashboard`    | Job seekers            |
| `/recruiter/dashboard` | Recruiters             |

## How auth works

1. `LoginPage` / `RegisterPage` call `login()` / `register()` from `useAuth()`.
2. `AuthProvider` sends the request, saves the returned JWT in `localStorage`, and stores the user in React state.
3. The Axios request interceptor adds `Authorization: Bearer <token>` to every API call.
4. Route guards in `src/routes/` read the auth state: `ProtectedRoute` (must be logged in), `RoleRoute` (must have the right role) and `GuestRoute` (must be logged out).
5. If the API ever answers 401, the response interceptor clears the session and protected pages redirect to login.

Route guards only control what the UI shows. The backend enforces the same rules on every request.

## Getting started

### Prerequisites

- Node.js 22.22 or newer
- The [backend](https://github.com/sudhan-murugan/jobconnect-backend) running locally (default `http://localhost:5000`)

### Setup

```bash
git clone https://github.com/sudhan-murugan/jobconnect-frontend.git
cd jobconnect-frontend
npm install
cp .env.example .env   # points the app at the backend
npm run dev            # http://localhost:5173
```

The footer shows **API online** when the frontend can reach the backend.

### Scripts

| Script            | What it does                          |
| ----------------- | ------------------------------------- |
| `npm run dev`     | Start the dev server with hot reload  |
| `npm run build`   | Production build into `dist/`         |
| `npm run preview` | Serve the production build locally    |
| `npm run lint`    | Run ESLint                            |

## Environment variables

| Variable       | Required | Default                 | Description                                  |
| -------------- | -------- | ----------------------- | -------------------------------------------- |
| `VITE_API_URL` | no       | `http://localhost:5000` | Backend server address (no trailing slash)   |

Vite bakes `VITE_*` variables into the JavaScript bundle at build time, so they are public. Never put secrets in them.

## Project structure

```
src/
  components/  shared UI (Layout, Navbar, Footer, Button, FormField, Alert, Spinner...)
  context/     AuthContext + AuthProvider (logged-in user, login/register/logout)
  hooks/       custom hooks (useAuth)
  pages/       one component per route (Home, Login, Register, dashboards, 404, 403)
  routes/      route guards (ProtectedRoute, RoleRoute, GuestRoute)
  services/    api.js (Axios + interceptors), authService.js, tokenStorage.js
  utils/       roles and helpers
  App.jsx      route definitions
  main.jsx     entry point, mounts <App /> into index.html
```

## Roadmap

1. ✅ Scaffold: Vite + React + React Router, layout, Axios service
2. ✅ Authentication: register/login pages, AuthContext, protected routes
3. Jobs backend
4. Jobs UI: list, search/filter, detail, recruiter post/edit
5. Applications: apply, dashboards for job seekers and recruiters
6. Profile and UI polish
7. Testing
8. Deployment
9. Documentation
