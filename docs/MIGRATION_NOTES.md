# Angular → React Migration Notes

## Overview

This document describes the migration of the Spring PetClinic Angular frontend
to a React 18+ / TypeScript application built with Vite.

## Technology Mapping

| Angular | React |
|---------|-------|
| Angular 16 | React 19 (React 18+ compatible) |
| Angular CLI | Vite |
| RxJS Observables | Promises + `useState` / `useEffect` |
| Angular Router | React Router v7 (`react-router-dom`) |
| Angular HttpClient | Axios |
| Angular Services (DI) | Plain modules exporting functions |
| `ngModel` (template-driven forms) | Controlled components with `useState` |
| Angular Material / Bootstrap | Bootstrap CSS (class names preserved) |
| Karma / Jasmine | Vitest + React Testing Library |
| Protractor (e2e) | Not migrated (see below) |
| Moment.js | Native `<input type="date">` (no library) |

## Architectural Decisions

### Services → API modules
Angular's dependency-injected services were replaced with plain TypeScript
modules (`src/api/*.ts`) that export async functions returning `Promise<T>`.
Each module corresponds to a domain: `owners.ts`, `pets.ts`, `visits.ts`,
`vets.ts`, `petTypes.ts`, `specialties.ts`.

### Observables → Promises
All RxJS `Observable` chains were converted to `Promise`-based calls using
Axios. Error handling uses `.catch()` with local `errorMessage` state instead of
the Angular `HttpErrorHandler` service.

### Template-driven forms → Controlled inputs
Angular's `ngModel` two-way binding was replaced with React controlled
components. Each form field is backed by a `useState` hook. Validation logic
(required, pattern, minlength, maxlength) is computed inline and displayed
through conditional rendering, matching the original validation messages.

### Routing
Angular's `RouterModule.forRoot()` / `.forChild()` was replaced with a single
`<Routes>` tree in `App.tsx`. Route parameters use React Router's `useParams`
hook. Navigation uses `useNavigate()`.

### Error handling
The shared `HttpErrorHandler` was not migrated as a standalone service. Instead,
each component catches API errors and stores them in local `errorMessage` state.
The error-to-string extraction from the `errors` response header (Spring MVC
field errors) was not carried over because it relied on Angular's
`HttpErrorResponse` headers API.

## Features Successfully Migrated

- Owner CRUD (list, search by last name, create, edit, detail view)
- Pet CRUD (add with type selection, edit with type selection, delete)
- Visit CRUD (create with pet context, edit, delete, history display)
- Vet list with specialty filtering, CRUD operations
- Form validation (name patterns, required fields, length limits)
- Navbar with dropdown navigation
- 404 / Not Found page
- Welcome page

## Features Not Directly Translated

### 1. Protractor E2E tests
The Angular app used Protractor for end-to-end testing, which is Angular-
specific and deprecated. The React app uses Vitest + React Testing Library +
MSW for integration-level tests instead. Full E2E testing with a tool like
Playwright could be added separately.

### 2. Angular Resolvers
The Angular app used route resolvers (`VetResolver`, `SpecResolver`) to pre-
fetch data before route activation. React Router v7 supports loaders, but the
migration uses `useEffect` in components for data fetching, which is the more
common React pattern. This means there is a brief loading state visible to
users.

### 3. `HttpErrorHandler` service
The centralized error handler that parsed Spring MVC `errors` headers was
replaced with per-component error handling. The Spring-specific header parsing
(`errors` JSON header with `errorMessage` field) was not migrated because it is
tightly coupled to Angular's `HttpErrorResponse` type.

### 4. Moment.js date formatting
The Angular app used Moment.js to format date picker output to `YYYY-MM-DD`.
The React app uses native `<input type="date">` which already provides this
format, eliminating the Moment.js dependency entirely.

### 5. PetType and Specialty management pages
The Angular app had dedicated list/add/edit pages for PetTypes and Specialties
(`/pettypes`, `/specialties`). The API modules are in place but dedicated
management pages were not created as they were admin-only CRUD pages not
mentioned in the primary user flows. The API layer (`petTypes.ts`,
`specialties.ts`) is fully implemented and can be wired to components.

### 6. CSS / Styling
The Angular app used Bootstrap 3 classes and Glyphicons. The React app preserves
all Bootstrap class names for structural compatibility, but does not bundle
Bootstrap CSS or Glyphicons. The consuming application should include Bootstrap 3
CSS for full visual parity.

## Test Coverage

26 migration tests across 4 test files using React Testing Library + MSW:

- `owners.test.tsx` — search, filter, create with validation, edit, detail view
- `pets.test.tsx` — add with type selection, edit, navigate to owner
- `visits.test.tsx` — create, history display, edit/delete buttons
- `vets.test.tsx` — list, specialty display, filter by specialty, CRUD buttons
