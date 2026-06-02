# Angular → React Migration Notes

## Overview

Migrated the Spring PetClinic Angular frontend to a React 18 + TypeScript + Vite application located in `react-frontend/`.

## Stack

| Concern | Angular (original) | React (migrated) |
|---------|-------------------|------------------|
| Framework | Angular 16 | React 18 |
| Language | TypeScript | TypeScript (strict) |
| Build tool | Angular CLI / Webpack | Vite |
| Routing | @angular/router | react-router-dom v6 |
| HTTP client | @angular/common/http | axios |
| Date handling | moment.js + Angular Material datepicker | Native `<input type="date">` |
| Forms | Template-driven (ngModel) + Reactive (FormBuilder) | Controlled components with useState |
| Styling | Bootstrap 3 + custom CSS | Custom CSS (no framework dependency) |

## Routing Mapping

| Angular Route | React Route | Component |
|--------------|-------------|-----------|
| `/welcome`, `/` | `/welcome`, `/` | Welcome |
| `/owners` | `/owners` | OwnerList |
| `/owners/add` | `/owners/add` | OwnerAdd |
| `/owners/:id` | `/owners/:id` | OwnerDetail |
| `/owners/:id/edit` | `/owners/:id/edit` | OwnerEdit |
| `/owners/:id/pets/add` | `/owners/:id/pets/add` | PetAdd |
| `/pets/:id/edit` | `/pets/:id/edit` | PetEdit |
| `/pets/:id/visits/add` | `/pets/:id/visits/add` | VisitAdd |
| `/visits` | `/visits` | VisitList |
| `/visits/add` | `/visits/add` | VisitAdd |
| `/visits/:id/edit` | `/visits/:id/edit` | VisitEdit |
| `/vets` | `/vets` | VetList |
| `/vets/add` | `/vets/add` | VetAdd |
| `/vets/:id/edit` | `/vets/:id/edit` | VetEdit |
| `/pettypes` | `/pettypes` | PetTypeList |
| `/pettypes/add` | `/pettypes/add` | PetTypeAdd |
| `/pettypes/:id/edit` | `/pettypes/:id/edit` | PetTypeEdit |
| `/specialties` | `/specialties` | SpecialtyList |
| `/specialties/add` | `/specialties/add` | SpecialtyAdd (new) |
| `/specialties/:id/edit` | `/specialties/:id/edit` | SpecialtyEdit |
| `**` | `*` | PageNotFound |

## Decisions & Differences

### Date Picker
- Angular version used `moment.js` + Angular Material `<mat-datepicker>`.
- React version uses native HTML `<input type="date">`, eliminating the moment.js dependency. Dates are stored and transmitted as ISO `YYYY-MM-DD` strings.

### Form Validation
- Angular used template-driven forms with `ngModel` directives and `#ref="ngModel"` for validation state.
- React uses controlled components with `useState` and inline validation logic. A `touched` state object tracks which fields have been interacted with, mirroring Angular's `dirty` behavior.
- All original validation rules are preserved: required fields, minlength, maxlength, pattern constraints.

### Error Handling
- The Angular `HttpErrorHandler` service pattern is replicated via `extractErrorMessage()` in `src/api/httpClient.ts`.
- Checks for the `errors` response header containing JSON `FieldError[]` objects, matching the Spring MVC error pattern.

### Styling
- Angular version depended on Bootstrap 3 (loaded via CDN) and Bootstrap's glyphicons.
- React version uses self-contained CSS (`src/styles/app.css`) with no external dependencies. The visual design is functional and presentable but simplified compared to Bootstrap's full component library.

### Specialty Add Route
- The Angular specialties module had the `/specialties/add` route commented out. The React version adds a working `SpecialtyAdd` component and route.

### Resolvers
- Angular used route resolvers (`VetResolver`, `SpecResolver`) to pre-fetch data before component initialization.
- React components fetch data in `useEffect` hooks after mount, which is the idiomatic React approach. The UX is equivalent (data loads before the form is interactive).

### Pet List Component
- In Angular, `PetListComponent` was an `@Input`-based child component rendered inside `OwnerDetailComponent`.
- In React, the pet list is rendered inline within `OwnerDetail` as `PetCard` sub-components, preserving the same visual layout.

### Dev Server Proxy
- The Vite config includes a proxy rule forwarding `/petclinic/api` requests to `http://localhost:9966`, matching the backend's expected base URL.

## Gaps

1. **No unit tests** — The Angular app had Jasmine/Karma unit tests and Protractor E2E tests. These were not migrated. A follow-up task should add React Testing Library and/or Playwright tests.
2. **No image assets** — The Angular app referenced `assets/images/pets.png` and logo images. These static assets were not copied to the React app.
3. **No production deployment config** — No Dockerfile or nginx config was created for the React build output.
