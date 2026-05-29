# Angular → React Migration Notes

## Summary

The Angular 16 PetClinic frontend has been migrated to a React 18 application using Vite, TypeScript, React Router v6, TanStack Query, and Material UI (MUI).

## Angular Features Not Directly Translated

### Template-Driven Forms → Controlled Inputs
Angular used `ngModel` with template-driven validation (e.g., `#firstName="ngModel"` with `*ngIf` error messages). React uses controlled `useState` state with native HTML5 `pattern`/`minLength`/`maxLength` attributes on `<TextField>` via `slotProps.htmlInput`. This provides equivalent validation behavior without a form library.

### RxJS Observables → TanStack Query
All Angular services used `Observable<T>` with `catchError` for error handling. These have been replaced with TanStack Query's `useQuery` and `useMutation` hooks, which provide automatic caching, background refetching, and built-in `isLoading` / `isError` states.

### Angular Route Resolvers → Query-based Data Fetching
The `VetResolver` and `SpecResolver` that pre-fetched data before route activation have been replaced with `useQuery` calls inside the components. Data loads after the component mounts but the loading state is handled by `CircularProgress` spinners.

### Angular Material + Bootstrap 3 → MUI v5+
The original app used a mix of Bootstrap 3 classes and Angular Material. The React version uses Material UI exclusively, providing a consistent component library. The visual layout is functionally equivalent but uses MUI's styling system.

### moment.js → dayjs
Date formatting (`moment(date).format('YYYY-MM-DD')`) has been replaced with `dayjs` for the same functionality with a smaller bundle size. The native `<input type="date">` is used for date pickers instead of Angular Material's datepicker.

### Angular `@Input()` / `@Output()` → React Props
Components like `PetListComponent` and `VisitListComponent` used `@Input()` to receive data from parent components and `@Output()` EventEmitter to communicate back. In React, these are standard props and callback functions. The inline add forms for specialties and pet types use local state toggling.

### HttpErrorHandler Service → Axios Interceptors + TanStack Query Error Handling
The Angular `HttpErrorHandler` service that created per-service error handlers has been replaced by TanStack Query's built-in error states (`isError`, `error`), with errors displayed as MUI `<Alert>` components.

### Angular Modules → File-based Organization
Angular's `NgModule` declarations (OwnersModule, PetsModule, etc.) have no direct React equivalent. The React app uses a flat file-based structure under `src/pages/` and `src/api/`, with React Router defining the route hierarchy.

### Protractor E2E Tests → Not Migrated
The Angular app included Protractor-based E2E tests. These have not been migrated as Protractor is deprecated. A future migration to Playwright or Cypress would be recommended.

### Karma/Jasmine Unit Tests → Not Migrated
Angular component unit tests using Karma and Jasmine have not been migrated. React Testing Library with Vitest would be the recommended equivalent.

## API Compatibility

The React app calls the exact same REST API endpoints as the Angular app:
- Base URL: configurable via `VITE_API_BASE_URL` env var (defaults to `http://localhost:9966/petclinic/api/`)
- All endpoint paths and HTTP methods are preserved
- Request/response payloads are identical

## Build & Development

- **Dev server**: `npm run dev` (Vite)
- **Production build**: `npm run build` (TypeScript check + Vite build)
- **Environment variable**: Set `VITE_API_BASE_URL` to override the API base URL
