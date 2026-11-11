# JobConnect Frontend

[![CI](https://github.com/sudhan-murugan/jobconnect-frontend/actions/workflows/ci.yml/badge.svg)](https://github.com/sudhan-murugan/jobconnect-frontend/actions/workflows/ci.yml)

React frontend for **JobConnect**, a job portal where recruiters post jobs and job seekers search and apply.

> **Status:** Phase 7 (testing). Job search, applying with a PDF resume (or in one click with your profile resume), dashboards for job seekers and recruiters, applicant review and editable profiles, with automated tests and CI; features are added phase by phase (see [Roadmap](#roadmap)).

Backend repo: [jobconnect-backend](https://github.com/sudhan-murugan/jobconnect-backend)

## Tech stack

- **React 19** with **Vite** (dev server and build)
- **React Router** for client-side routing (URL search params hold the job search state)
- **Axios** for HTTP requests (one shared instance in `src/services/api.js`, with a JWT interceptor)
- **React Context** for auth state (`AuthProvider` + `useAuth()` hook)
- **Tailwind CSS v4** for responsive styling
- **ESLint** for linting
- **Vitest + React Testing Library** for tests; GitHub Actions CI

## Features so far

**Everyone**
- Search jobs by keyword and location, filter by job type, page through results
- Search state lives in the URL (`/jobs?keyword=react&jobType=remote&page=2`): shareable, bookmarkable, and the Back button works
- Job pages with salary, skills and posting date; "Back to jobs" returns to the same search

**Accounts**
- Sign up as a **job seeker** or a **recruiter**, log in, log out; session survives page reloads
- Profile page: edit name, headline, location and (job seekers) skills; changes appear across the app immediately
- Protected routes send logged-out visitors to login, then back to the page they wanted
- Role-based routes: each role has its own dashboard; other roles see a 403 page

**Job seekers**
- Save a resume on your profile (upload, view, replace, remove) and apply in one click with it
- Or apply with a different PDF and an optional cover note, with upload progress
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
- Loading skeletons, empty states and error states (with "Try again") on every data view
- An error page instead of a blank screen if a page crashes or its code fails to load
- Each page's code is downloaded only when first visited, with a progress bar during navigation
- Responsive layout (phone, tablet, desktop) with a mobile menu
- Accessibility: "Skip to main content" link, labelled form fields, keyboard-friendly dialogs, reduced motion respected
- Home page with job search and the latest jobs; page titles per route; scroll position restored on Back

## Routes

| Path                       | Who can see it                 |
| -------------------------- | ------------------------------ |
| `/`                        | Everyone                       |
| `/jobs`                    | Everyone (search and filters)  |
| `/jobs/:id`                | Everyone                       |
| `/login`, `/register`      | Logged-out visitors            |
| `/profile`                 | Logged-in users                |
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

### Code splitting and errors

- Every page except Home is loaded with React Router's `lazy` routes (`App.jsx`): its JavaScript is a separate file, downloaded the first time the page is visited. `NavigationProgress` in `Layout.jsx` shows a thin loading bar while that happens.
- Routes have an `errorElement` (`RouteErrorPage.jsx`): if a page throws while rendering, or its file can't be downloaded (for example after a new deploy), users see a friendly message with "Reload page" instead of a blank screen.

### Uploading and viewing resumes

- **Upload:** the apply form sends a `FormData` body (`multipart/form-data`), the format browsers use for files. Axios reports upload progress, shown on the submit button.
- **Viewing:** resumes are private, so the API only serves them with the login token. A normal `<a href>` link can't send that header. Instead, `openPdfInNewTab()` (`src/services/files.js`) downloads the PDF with Axios as a `Blob`, creates a temporary object URL, and opens it in a new tab. The tab is opened during the click, so pop-up blockers allow it.
- **Profile resume:** the apply dialog offers "Use my profile resume" when one is saved; the API then copies it into the application.

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
| `npm test`        | Run the tests once                    |
| `npm run test:watch` | Re-run tests on file changes       |

## Environment variables

| Variable       | Required | Default                 | Description                                  |
| -------------- | -------- | ----------------------- | -------------------------------------------- |
| `VITE_API_URL` | no       | `http://localhost:5000` | Backend server address (no trailing slash)   |

Vite bakes `VITE_*` variables into the JavaScript bundle at build time, so they are public. Never put secrets in them.

## Testing

```bash
npm test   # 35 tests, a few seconds
```

Tests use **Vitest** (Vite's test runner, so it shares this project's config) with **React Testing Library**, which renders components in a simulated browser (jsdom) and interacts with them the way a user would: finding elements by their label or role, typing, clicking.

| Test file | What it checks |
| --------- | -------------- |
| `src/routes/routeGuards.test.jsx` | Logged-out visitors are redirected to login (and remembered), the wrong role sees 403, logged-in users skip the login page |
| `src/pages/LoginPage.test.jsx` | Submits the entered credentials, disables the button while waiting, shows the API's error |
| `src/components/JobForm.test.jsx` | Converts the form into the API payload, blocks invalid salaries, shows API errors under the right field, pre-fills when editing |
| `src/components/JobCard.test.jsx` | Shows a job's details, link, skills and salary |
| `src/utils/jobs.test.js` | Salary/date formatting, skill parsing and resume file checks |

Components get their auth state from a fake `AuthContext` value (`src/test/render.jsx`), so tests don't need the backend. GitHub Actions runs lint, tests and a production build on every push and pull request (`.github/workflows/ci.yml`).

## Project structure

```
src/
  components/  shared UI: layout and navbar, form controls, job cards, filters,
               pagination, dialogs, loading/empty/error states
  context/     AuthContext + AuthProvider (logged-in user, login/register/logout)
  hooks/       useAuth, useFetch, useDocumentTitle, useFlashMessage
  pages/       one component per route (jobs, job detail, post/edit job, applicants,
               dashboards, profile, error page...)
  routes/      route guards (ProtectedRoute, RoleRoute, GuestRoute)
  services/    api.js (Axios + interceptors), authService.js, jobService.js,
               applicationService.js, userService.js, files.js, tokenStorage.js
  utils/       roles, job types, application statuses and formatting helpers
  test/        test setup and render helpers
  App.jsx      route definitions
  main.jsx     entry point, mounts <App /> into index.html
```

Test files sit next to the code they test, named `*.test.js(x)`.

## Roadmap

1. ✅ Scaffold: Vite + React + React Router, layout, Axios service
2. ✅ Authentication: register/login pages, AuthContext, protected routes
3. ✅ Jobs backend (API in the backend repo)
4. ✅ Jobs UI: list, search/filter, detail, recruiter post/edit
5. ✅ Applications: apply, dashboards for job seekers and recruiters
6. ✅ Profile and UI polish
7. ✅ Testing: Vitest + React Testing Library, CI
8. Deployment
9. Documentation
