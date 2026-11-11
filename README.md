# JobConnect Frontend

React frontend for **JobConnect**, a job portal where recruiters post jobs and job seekers search and apply.

> **Status:** Phase 1 (scaffold). App shell with routing, layout and an API connection check; features are added phase by phase (see [Roadmap](#roadmap)).

Backend repo: [jobconnect-backend](https://github.com/sudhan-murugan/jobconnect-backend)

## Tech stack

- **React 19** with **Vite** (dev server and build)
- **React Router** for client-side routing
- **Axios** for HTTP requests (one shared instance in `src/services/api.js`)
- **Tailwind CSS v4** for responsive styling
- **ESLint** for linting
- **Planned:** React Context for auth state, React Testing Library

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
  components/  shared UI (Layout, Navbar, Footer, ApiStatus)
  context/     React Context providers (AuthContext, Phase 2)
  hooks/       custom React hooks
  pages/       one component per route (HomePage, NotFoundPage)
  routes/      route guards (ProtectedRoute, RoleRoute, Phase 2)
  services/    api.js: Axios instance for the backend
  App.jsx      route definitions
  main.jsx     entry point, mounts <App /> into index.html
```

## Roadmap

1. ✅ Scaffold: Vite + React + React Router, layout, Axios service
2. Authentication: register/login pages, AuthContext, protected routes
3. Jobs backend
4. Jobs UI: list, search/filter, detail, recruiter post/edit
5. Applications: apply, dashboards for job seekers and recruiters
6. Profile and UI polish
7. Testing
8. Deployment
9. Documentation
