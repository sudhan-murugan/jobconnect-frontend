# JobConnect Frontend

React frontend for **JobConnect**, a job portal where recruiters post jobs and job seekers search and apply.

> **Status:** Phase 5 (applications). Job search, applying with a PDF resume, a job seeker dashboard that tracks every application, and recruiter tools to post jobs and review applicants; features are added phase by phase (see [Roadmap](#roadmap)).

Backend repo: [jobconnect-backend](https://github.com/sudhan-murugan/jobconnect-backend)

## Tech stack

- **React 19** with **Vite** (dev server and build)
- **React Router** for client-side routing (URL search params hold the job search state)
- **Axios** for HTTP requests (one shared instance in `src/services/api.js`, with a JWT interceptor)
- **React Context** for auth state (`AuthProvider` + `useAuth()` hook)
- **Tailwind CSS v4** for responsive styling
- **ESLint** for linting
- **Planned:** React Testing Library

## Features so far

**Everyone**
- Search jobs by keyword and location, filter by job type, page through results
- Search state lives in the URL (`/jobs?keyword=react&jobType=remote&page=2`): shareable, bookmarkable, and the Back button works
- Job pages with salary, skills and posting date; "Back to jobs" returns to the same search

**Accounts**
- Sign up as a **job seeker** or a **recruiter**, log in, log out; session survives page reloads
- Protected routes send logged-out visitors to login, then back to the page they wanted
- Role-based routes: each role has its own dashboard; other roles see a 403 page

**Job seekers**
- Apply to a job with a PDF resume and an optional cover note, with upload progress
- Instant checks for file type and size; the server's checks (e.g. "not a valid PDF") show under the field
- The job page shows "You applied" with the current status instead of the Apply button
- Dashboard with totals per status and every application (job, date, status, submitted resume)

**Recruiters**
- Dashboard listing your own job posts with applicant counts ("3 applicants · 1 shortlisted")
- Applicants page per job: profile, email, skills, cover note and resume for each applicant
- Change an applicant's status (applied / shortlisted / rejected) and filter by status
- Post, edit and delete jobs (with a confirmation dialog); only the job's owner sees Edit/Delete
- Form errors from the API appear under the matching field

**UI**
- Loading, empty and error states (with "Try again") on every data view
- Responsive layout with a mobile menu
- Page titles per route; scroll position restored on Back

## Routes

| Path                       | Who can see it                 |
| -------------------------- | ------------------------------ |
| `/`                        | Everyone                       |
| `/jobs`                    | Everyone (search and filters)  |
| `/jobs/:id`                | Everyone                       |
| `/login`, `/register`      | Logged-out visitors            |
| `/seeker/dashboard`        | Job seekers                    |
| `/recruiter/dashboard`     | Recruiters                     |
| `/recruiter/jobs/new`      | Recruiters                     |
| `/recruiter/jobs/:id/edit` | The recruiter who posted the job |
| `/recruiter/jobs/:id/applicants` | The recruiter who posted the job |

## How it works

### Auth

1. `LoginPage` / `RegisterPage` call `login()` / `register()` from `useAuth()`.
2. `AuthProvider` sends the request, saves the returned JWT in `localStorage`, and stores the user in React state.
3. The Axios request interceptor adds `Authorization: Bearer <token>` to every API call.
4. Route guards in `src/routes/` read the auth state: `ProtectedRoute` (must be logged in), `RoleRoute` (must have the right role) and `GuestRoute` (must be logged out).
5. If the API ever answers 401, the response interceptor clears the session and protected pages redirect to login.

Route guards only control what the UI shows. The backend enforces the same rules on every request.

### Data fetching

Pages load data with a small custom hook, `useFetch` (`src/hooks/useFetch.js`). It:

- refetches when its inputs change (e.g. the search params),
- cancels outdated requests with `AbortController`, so a slow old response can never overwrite newer results,
- keeps the previous results on screen (faded) while the next page loads,
- exposes `reload()` for "Try again" buttons and for refreshing after a delete.

In a larger app, a library such as TanStack Query would add caching and background refetching on top of this.

### Uploading and viewing resumes

- **Upload:** the apply form sends a `FormData` body (`multipart/form-data`), the format browsers use for files. Axios reports upload progress, shown on the submit button.
- **Viewing:** resumes are private, so the API only serves them with the login token. A normal `<a href>` link can't send that header. Instead, `openResume()` downloads the PDF with Axios as a `Blob`, creates a temporary object URL, and opens it in a new tab. The tab is opened during the click, so pop-up blockers allow it.

## Getting started

### Prerequisites

- Node.js 22.22 or newer
- The [backend](https://github.com/sudhan-murugan/jobconnect-backend) running locally (default `http://localhost:5000`). Run `npm run seed` there for demo data.

### Setup

```bash
git clone https://github.com/sudhan-murugan/jobconnect-frontend.git
cd jobconnect-frontend
npm install
cp .env.example .env   # points the app at the backend
npm run dev            # http://localhost:5173
```

The footer shows **API online** when the frontend can reach the backend.

**Demo accounts** (after seeding the backend), password `Demo1234`:
`demo.recruiter@example.com` (recruiter) and `demo.seeker@example.com` (job seeker).

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
  components/  shared UI: layout and navbar, form controls, job cards, filters,
               pagination, dialogs, loading/empty/error states
  context/     AuthContext + AuthProvider (logged-in user, login/register/logout)
  hooks/       useAuth, useFetch, useDocumentTitle, useFlashMessage
  pages/       one component per route (jobs, job detail, post/edit job, applicants, dashboards...)
  routes/      route guards (ProtectedRoute, RoleRoute, GuestRoute)
  services/    api.js (Axios + interceptors), authService.js, jobService.js,
               applicationService.js, tokenStorage.js
  utils/       roles, job types, application statuses and formatting helpers
  App.jsx      route definitions
  main.jsx     entry point, mounts <App /> into index.html
```

## Roadmap

1. ✅ Scaffold: Vite + React + React Router, layout, Axios service
2. ✅ Authentication: register/login pages, AuthContext, protected routes
3. ✅ Jobs backend (API in the backend repo)
4. ✅ Jobs UI: list, search/filter, detail, recruiter post/edit
5. ✅ Applications: apply, dashboards for job seekers and recruiters
6. Profile and UI polish
7. Testing
8. Deployment
9. Documentation
