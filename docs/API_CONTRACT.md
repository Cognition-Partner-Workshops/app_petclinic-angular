# Spring PetClinic REST API Contract

> Extracted from the Angular frontend service files and TypeScript interfaces.
> Base URL: `http://localhost:9966/petclinic/api/`

---

## Data Models

### Owner

```ts
interface Owner {
  id: number;
  firstName: string;
  lastName: string;
  address: string;
  city: string;
  telephone: string;
  pets: Pet[];
}
```

### Pet

```ts
interface Pet {
  id: number;
  ownerId: number;
  name: string;
  birthDate: string;   // ISO date string, e.g. "2020-01-15"
  type: PetType;
  owner: Owner;
  visits: Visit[];
}
```

### PetType

```ts
interface PetType {
  id: number;
  name: string;
}
```

### Visit

```ts
interface Visit {
  id: number;
  date: string;          // ISO date string
  description: string;
  pet: Pet;
  petId?: number;        // optional shorthand reference
}
```

### Vet

```ts
interface Vet {
  id: number;
  firstName: string;
  lastName: string;
  specialties: Specialty[];
}
```

### Specialty

```ts
interface Specialty {
  id: number;
  name: string;
}
```

---

## Endpoints

### Owners

| Method | URL Pattern | Request Body | Response | Notes |
|--------|-------------|-------------|----------|-------|
| `GET` | `/owners` | — | `Owner[]` | List all owners |
| `GET` | `/owners?lastName={lastName}` | — | `Owner[]` | Search/filter owners by last name |
| `GET` | `/owners/{ownerId}` | — | `Owner` | Get single owner by ID |
| `POST` | `/owners` | `Owner` | `Owner` | Create a new owner |
| `PUT` | `/owners/{ownerId}` | `Owner` | `Owner` | Update an existing owner |
| `DELETE` | `/owners/{ownerId}` | — | `void` | Delete an owner |

### Pets

| Method | URL Pattern | Request Body | Response | Notes |
|--------|-------------|-------------|----------|-------|
| `GET` | `/pets` | — | `Pet[]` | List all pets |
| `GET` | `/pets/{petId}` | — | `Pet` | Get single pet by ID |
| `POST` | `/owners/{ownerId}/pets` | `Pet` | `Pet` | Add a pet to an owner |
| `PUT` | `/pets/{petId}` | `Pet` | `Pet` | Update an existing pet |
| `DELETE` | `/pets/{petId}` | — | `number` | Delete a pet |

### Visits

| Method | URL Pattern | Request Body | Response | Notes |
|--------|-------------|-------------|----------|-------|
| `GET` | `/visits` | — | `Visit[]` | List all visits |
| `GET` | `/visits/{visitId}` | — | `Visit` | Get single visit by ID |
| `POST` | `/owners/{ownerId}/pets/{petId}/visits` | `Visit` | `Visit` | Create a visit for a specific pet |
| `PUT` | `/visits/{visitId}` | `Visit` | `Visit` | Update an existing visit |
| `DELETE` | `/visits/{visitId}` | — | `number` | Delete a visit |

### Vets

| Method | URL Pattern | Request Body | Response | Notes |
|--------|-------------|-------------|----------|-------|
| `GET` | `/vets` | — | `Vet[]` | List all vets |
| `GET` | `/vets/{vetId}` | — | `Vet` | Get single vet by ID |
| `POST` | `/vets` | `Vet` | `Vet` | Add a new vet |
| `PUT` | `/vets/{vetId}` | `Vet` | `Vet` | Update an existing vet |
| `DELETE` | `/vets/{vetId}` | — | `number` | Delete a vet |

### Pet Types

| Method | URL Pattern | Request Body | Response | Notes |
|--------|-------------|-------------|----------|-------|
| `GET` | `/pettypes` | — | `PetType[]` | List all pet types |
| `GET` | `/pettypes/{typeId}` | — | `PetType` | Get single pet type by ID |
| `POST` | `/pettypes` | `PetType` | `PetType` | Add a new pet type |
| `PUT` | `/pettypes/{typeId}` | `PetType` | `PetType` | Update a pet type |
| `DELETE` | `/pettypes/{typeId}` | — | `number` | Delete a pet type |

### Specialties

| Method | URL Pattern | Request Body | Response | Notes |
|--------|-------------|-------------|----------|-------|
| `GET` | `/specialties` | — | `Specialty[]` | List all specialties |
| `GET` | `/specialties/{specId}` | — | `Specialty` | Get single specialty by ID |
| `POST` | `/specialties` | `Specialty` | `Specialty` | Add a new specialty |
| `PUT` | `/specialties/{specId}` | `Specialty` | `Specialty` | Update a specialty |
| `DELETE` | `/specialties/{specId}` | — | `number` | Delete a specialty |

---

## Error Handling

All services use a shared `HttpErrorHandler` (see `error.service.ts`).

### Behavior

1. **Client-side errors** (`ErrorEvent`): The `error.message` is extracted.
2. **Server errors**: A message is built from `error.status` and `error.error` body.
3. **Validation errors**: If the response includes an `errors` HTTP header (JSON array), the first item's `errorMessage` field is used. This is the Spring MVC `FieldError` pattern.
4. The error is logged to `console.error` and re-thrown as an `Observable` error via `throwError(message)`.

### Error Header Format

```
errors: [{ "errorMessage": "lastName must not be empty" }]
```

### On Failure

Each service method has a fallback value (e.g., `[]` for list calls, `{} as T` for single-entity calls). The error handler logs and re-throws, so callers receive the thrown error, not the fallback (the fallback is the type signature for the `catchError` operator but `throwError` overrides it).

---

## Frontend Routes (Angular)

These routes inform the React router structure:

| Path | Component | Purpose |
|------|-----------|---------|
| `/` | Welcome | Home/landing page |
| `/welcome` | Welcome | Home/landing page |
| `/owners` | OwnerList | List/search owners |
| `/owners/add` | OwnerAdd | Create new owner form |
| `/owners/:id` | OwnerDetail | Owner detail view |
| `/owners/:id/edit` | OwnerEdit | Edit owner form |
| `/owners/:id/pets/add` | PetAdd | Add pet to owner |
| `/pets` | PetList | List all pets |
| `/pets/add` | PetAdd | Create new pet form |
| `/pets/:id/edit` | PetEdit | Edit pet form |
| `/pets/:id/visits/add` | VisitAdd | Add visit to pet |
| `/visits` | VisitList | List all visits |
| `/visits/add` | VisitAdd | Create new visit form |
| `/visits/:id/edit` | VisitEdit | Edit visit form |
| `/vets` | VetList | List all vets |
| `/vets/add` | VetAdd | Add new vet form |
| `/vets/:id/edit` | VetEdit | Edit vet form |
| `/pettypes` | PetTypeList | List pet types |
| `/pettypes/add` | PetTypeAdd | Add pet type form |
| `/pettypes/:id/edit` | PetTypeEdit | Edit pet type form |
| `/specialties` | SpecialtyList | List specialties |
| `/specialties/add` | SpecialtyAdd | Add specialty form |
| `/specialties/:id/edit` | SpecialtyEdit | Edit specialty form |
| `**` | PageNotFound | 404 fallback |
