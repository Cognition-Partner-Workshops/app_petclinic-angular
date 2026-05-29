# Angular → React Migration Plan

## Overview

Migrate the PetClinic Angular 16 frontend to React 18+ with TypeScript, using Vite as the build tool.

## Technology Mapping

| Concern | Angular (current) | React (target) |
|---|---|---|
| Framework | Angular 16 | React 18 |
| Build Tool | Angular CLI / Webpack | Vite |
| Routing | @angular/router | React Router v6 |
| HTTP / Data Fetching | HttpClient + RxJS | Axios + TanStack Query |
| UI Library | Bootstrap 3 + Angular Material | Material UI (MUI) v5 |
| Forms | Template-driven (ngModel) | React Hook Form |
| Date Handling | moment.js | dayjs |
| State Management | Component state + Services | React hooks + TanStack Query cache |

## Route Mapping

| Path | Angular Component | React Component |
|---|---|---|
| `/` , `/welcome` | WelcomeComponent | `pages/WelcomePage` |
| `/owners` | OwnerListComponent | `pages/owners/OwnerListPage` |
| `/owners/add` | OwnerAddComponent | `pages/owners/OwnerAddPage` |
| `/owners/:id` | OwnerDetailComponent | `pages/owners/OwnerDetailPage` |
| `/owners/:id/edit` | OwnerEditComponent | `pages/owners/OwnerEditPage` |
| `/owners/:id/pets/add` | PetAddComponent | `pages/pets/PetAddPage` |
| `/pets` | PetListComponent | (embedded in OwnerDetail) |
| `/pets/:id/edit` | PetEditComponent | `pages/pets/PetEditPage` |
| `/pets/:id/visits/add` | VisitAddComponent | `pages/visits/VisitAddPage` |
| `/visits` | VisitListComponent | (embedded in OwnerDetail) |
| `/visits/add` | VisitAddComponent | `pages/visits/VisitAddPage` |
| `/visits/:id/edit` | VisitEditComponent | `pages/visits/VisitEditPage` |
| `/vets` | VetListComponent | `pages/vets/VetListPage` |
| `/vets/add` | VetAddComponent | `pages/vets/VetAddPage` |
| `/vets/:id/edit` | VetEditComponent | `pages/vets/VetEditPage` |
| `/pettypes` | PettypeListComponent | `pages/pettypes/PetTypeListPage` |
| `/pettypes/add` | PettypeAddComponent | (inline in PetTypeListPage) |
| `/pettypes/:id/edit` | PettypeEditComponent | `pages/pettypes/PetTypeEditPage` |
| `/specialties` | SpecialtyListComponent | `pages/specialties/SpecialtyListPage` |
| `/specialties/:id/edit` | SpecialtyEditComponent | `pages/specialties/SpecialtyEditPage` |
| `**` | PageNotFoundComponent | `pages/NotFoundPage` |

## Component Mapping

### Shared / Layout
| Angular | React |
|---|---|
| AppComponent (navbar + router-outlet) | `App.tsx` with `<AppNavbar />` + `<Outlet />` |
| WelcomeComponent | `WelcomePage.tsx` |
| PageNotFoundComponent | `NotFoundPage.tsx` |

### Owners Module
| Angular | React |
|---|---|
| OwnerListComponent | `OwnerListPage.tsx` |
| OwnerAddComponent | `OwnerAddPage.tsx` |
| OwnerDetailComponent | `OwnerDetailPage.tsx` |
| OwnerEditComponent | `OwnerEditPage.tsx` |
| OwnerService | `api/ownerApi.ts` + TanStack Query hooks |

### Pets Module
| Angular | React |
|---|---|
| PetAddComponent | `PetAddPage.tsx` |
| PetEditComponent | `PetEditPage.tsx` |
| PetListComponent (inline sub-component) | `components/PetList.tsx` |
| PetService | `api/petApi.ts` + TanStack Query hooks |

### Visits Module
| Angular | React |
|---|---|
| VisitAddComponent | `VisitAddPage.tsx` |
| VisitEditComponent | `VisitEditPage.tsx` |
| VisitListComponent (inline sub-component) | `components/VisitList.tsx` |
| VisitService | `api/visitApi.ts` + TanStack Query hooks |

### Vets Module
| Angular | React |
|---|---|
| VetListComponent | `VetListPage.tsx` |
| VetAddComponent | `VetAddPage.tsx` |
| VetEditComponent | `VetEditPage.tsx` |
| VetService | `api/vetApi.ts` + TanStack Query hooks |

### Specialties Module
| Angular | React |
|---|---|
| SpecialtyListComponent | `SpecialtyListPage.tsx` |
| SpecialtyAddComponent (inline) | (inline in SpecialtyListPage) |
| SpecialtyEditComponent | `SpecialtyEditPage.tsx` |
| SpecialtyService | `api/specialtyApi.ts` + TanStack Query hooks |

### Pet Types Module
| Angular | React |
|---|---|
| PettypeListComponent | `PetTypeListPage.tsx` |
| PettypeAddComponent (inline) | (inline in PetTypeListPage) |
| PettypeEditComponent | `PetTypeEditPage.tsx` |
| PetTypeService | `api/petTypeApi.ts` + TanStack Query hooks |

## Service → API Layer Mapping

Each Angular service maps to an Axios-based API module + custom TanStack Query hooks:

| Angular Service | API Module | Endpoints |
|---|---|---|
| OwnerService | `ownerApi.ts` | GET/POST/PUT/DELETE `/owners`, GET `?lastName=` |
| PetService | `petApi.ts` | GET/PUT/DELETE `/pets`, POST `/owners/:id/pets` |
| VisitService | `visitApi.ts` | GET/PUT/DELETE `/visits`, POST `/owners/:oid/pets/:pid/visits` |
| VetService | `vetApi.ts` | GET/POST/PUT/DELETE `/vets` |
| SpecialtyService | `specialtyApi.ts` | GET/POST/PUT/DELETE `/specialties` |
| PetTypeService | `petTypeApi.ts` | GET/POST/PUT/DELETE `/pettypes` |
| HttpErrorHandler | Axios interceptor + TanStack Query `onError` |

## Project Structure

```
react-frontend/
├── public/
├── src/
│   ├── api/           # Axios client & per-entity API modules
│   ├── components/    # Reusable UI components (Navbar, PetList, VisitList)
│   ├── hooks/         # Custom TanStack Query hooks
│   ├── models/        # TypeScript interfaces (Owner, Pet, Visit, Vet, etc.)
│   ├── pages/         # Route-level page components
│   │   ├── owners/
│   │   ├── pets/
│   │   ├── visits/
│   │   ├── vets/
│   │   ├── pettypes/
│   │   └── specialties/
│   ├── App.tsx
│   └── main.tsx
├── index.html
├── package.json
├── tsconfig.json
└── vite.config.ts
```

## Migration Order

1. Project scaffolding (Vite + deps)
2. Models & API layer
3. Layout (App shell, Navbar)
4. Welcome & 404 pages
5. Owners CRUD
6. Pets CRUD
7. Visits CRUD
8. Vets CRUD
9. Specialties CRUD
10. Pet Types CRUD
11. Build verification
