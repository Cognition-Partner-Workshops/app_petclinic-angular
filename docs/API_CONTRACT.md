# PetClinic REST API Contract

**Base URL:** `http://localhost:9966/petclinic/api/`

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
  birthDate: string;   // "YYYY-MM-DD"
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
  date: string;        // "YYYY-MM-DD"
  description: string;
  pet: Pet;
  petId?: number;
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

| Method | URL | Request Body | Response | Notes |
|--------|-----|-------------|----------|-------|
| GET | `owners` | — | `Owner[]` | List all owners |
| GET | `owners?lastName={prefix}` | — | `Owner[]` | Search by last-name prefix |
| GET | `owners/{id}` | — | `Owner` | Single owner with nested pets/visits |
| POST | `owners` | `Owner` (id: null) | `Owner` | Create; returns created entity |
| PUT | `owners/{id}` | `Owner` | `Owner` | Update |
| DELETE | `owners/{id}` | — | `void` | Delete |

### Pets

| Method | URL | Request Body | Response | Notes |
|--------|-----|-------------|----------|-------|
| GET | `pets` | — | `Pet[]` | List all pets |
| GET | `pets/{id}` | — | `Pet` | Single pet |
| POST | `owners/{ownerId}/pets` | `Pet` (id: null, owner set) | `Pet` | Create pet under owner |
| PUT | `pets/{id}` | `Pet` | `Pet` | Update |
| DELETE | `pets/{id}` | — | `number` | Delete; returns status |

### Pet Types

| Method | URL | Request Body | Response | Notes |
|--------|-----|-------------|----------|-------|
| GET | `pettypes` | — | `PetType[]` | List all |
| GET | `pettypes/{id}` | — | `PetType` | Single |
| POST | `pettypes` | `PetType` | `PetType` | Create |
| PUT | `pettypes/{id}` | `PetType` | `PetType` | Update |
| DELETE | `pettypes/{id}` | — | `number` | Delete |

### Visits

| Method | URL | Request Body | Response | Notes |
|--------|-----|-------------|----------|-------|
| GET | `visits` | — | `Visit[]` | List all |
| GET | `visits/{id}` | — | `Visit` | Single |
| POST | `owners/{ownerId}/pets/{petId}/visits` | `Visit` (id: null) | `Visit` | Create visit for a pet |
| PUT | `visits/{id}` | `Visit` | `Visit` | Update |
| DELETE | `visits/{id}` | — | `number` | Delete |

### Vets

| Method | URL | Request Body | Response | Notes |
|--------|-----|-------------|----------|-------|
| GET | `vets` | — | `Vet[]` | List all |
| GET | `vets/{id}` | — | `Vet` | Single |
| POST | `vets` | `Vet` | `Vet` | Create |
| PUT | `vets/{id}` | `Vet` | `Vet` | Update |
| DELETE | `vets/{id}` | — | `number` | Delete |

### Specialties

| Method | URL | Request Body | Response | Notes |
|--------|-----|-------------|----------|-------|
| GET | `specialties` | — | `Specialty[]` | List all |
| GET | `specialties/{id}` | — | `Specialty` | Single |
| POST | `specialties` | `Specialty` | `Specialty` | Create |
| PUT | `specialties/{id}` | `Specialty` | `Specialty` | Update |
| DELETE | `specialties/{id}` | — | `number` | Delete |

---

## Error Handling

All services use a shared `HttpErrorHandler` that:

1. Catches HTTP errors and extracts a human-readable message.
2. Checks for a custom `errors` response header (JSON array of `{ errorMessage }` objects from Spring MVC field validation).
3. Logs `serviceName::operation failed: message` to the console.
4. Returns the error via `throwError(message)`.

On error the Angular components store the message in an `errorMessage` property and display it in the template.

---

## Form Validation Rules (Angular originals)

### Owner form
- **firstName**: required, minlength 1, maxlength 30, pattern `^[a-zA-Z]*$`
- **lastName**: required, minlength 1, maxlength 30, pattern `^[a-zA-Z]*$`
- **address**: required, maxlength 255
- **city**: required, maxlength 80
- **telephone**: required, minlength 1, maxlength 20, pattern `^[0-9]*$`

### Pet form
- **name**: required
- **birthDate**: required (date picker, formatted to `YYYY-MM-DD`)
- **type**: required (select from PetType list)

### Visit form
- **date**: required (date picker, formatted to `YYYY-MM-DD`)
- **description**: required

### Vet form
- **firstName**: required
- **lastName**: required
- **specialties**: multi-select from available specialties

---

## Route Map (Angular)

| Angular Route | Component |
|---------------|-----------|
| `/welcome`, `/` | WelcomeComponent |
| `/owners` | OwnerListComponent |
| `/owners/add` | OwnerAddComponent |
| `/owners/:id` | OwnerDetailComponent |
| `/owners/:id/edit` | OwnerEditComponent |
| `/owners/:id/pets/add` | PetAddComponent |
| `/pets` | PetListComponent |
| `/pets/add` | PetAddComponent |
| `/pets/:id/edit` | PetEditComponent |
| `/pets/:id/visits/add` | VisitAddComponent |
| `/visits` | VisitListComponent |
| `/visits/add` | VisitAddComponent |
| `/visits/:id/edit` | VisitEditComponent |
| `/vets` | VetListComponent |
| `/vets/add` | VetAddComponent |
| `/vets/:id/edit` | VetEditComponent |
| `/pettypes` | PetTypeListComponent |
| `/specialties` | SpecialtyListComponent |
| `**` | PageNotFoundComponent |
