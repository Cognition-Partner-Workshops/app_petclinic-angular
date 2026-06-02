# PetClinic REST API Contract

> Extracted from the Angular frontend services and TypeScript interfaces.
> Base URL: `http://localhost:9966/petclinic/api/`

---

## Data Models

### PetType

```typescript
interface PetType {
  id: number;
  name: string;
}
```

### Owner

```typescript
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

```typescript
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

### Visit

```typescript
interface Visit {
  id: number;
  date: string;          // ISO date string, e.g. "2024-03-10"
  description: string;
  pet: Pet;
  petId?: number;        // optional shortcut for pet reference
}
```

---

## Endpoints

### Owners

| Method | URL | Request Body | Response | Notes |
|--------|-----|-------------|----------|-------|
| `GET` | `/owners` | — | `Owner[]` | List all owners |
| `GET` | `/owners?lastName={lastName}` | — | `Owner[]` | Search owners by last name (partial match) |
| `GET` | `/owners/{ownerId}` | — | `Owner` | Get single owner with nested pets/visits |
| `POST` | `/owners` | `Owner` (without `id`) | `Owner` | Create a new owner; server assigns `id` |
| `PUT` | `/owners/{ownerId}` | `Owner` | `Owner` | Update an existing owner |
| `DELETE` | `/owners/{ownerId}` | — | `void` | Delete an owner by ID |

#### Example: Create Owner

```
POST /owners
Content-Type: application/json

{
  "firstName": "George",
  "lastName": "Franklin",
  "address": "110 W. Liberty St.",
  "city": "Madison",
  "telephone": "6085551023"
}

→ 201 Created
{
  "id": 11,
  "firstName": "George",
  "lastName": "Franklin",
  "address": "110 W. Liberty St.",
  "city": "Madison",
  "telephone": "6085551023",
  "pets": []
}
```

---

### Pets

| Method | URL | Request Body | Response | Notes |
|--------|-----|-------------|----------|-------|
| `GET` | `/pets` | — | `Pet[]` | List all pets |
| `GET` | `/pets/{petId}` | — | `Pet` | Get single pet with nested owner/visits |
| `POST` | `/owners/{ownerId}/pets` | `Pet` (without `id`) | `Pet` | Create a pet under an owner |
| `PUT` | `/pets/{petId}` | `Pet` | `Pet` | Update an existing pet |
| `DELETE` | `/pets/{petId}` | — | `void` | Delete a pet by ID |

#### Example: Create Pet

```
POST /owners/1/pets
Content-Type: application/json

{
  "name": "Leo",
  "birthDate": "2020-09-07",
  "type": { "id": 1, "name": "cat" }
}

→ 201 Created
{
  "id": 14,
  "name": "Leo",
  "birthDate": "2020-09-07",
  "type": { "id": 1, "name": "cat" },
  "ownerId": 1,
  "owner": { ... },
  "visits": []
}
```

---

### Pet Types (supporting endpoint)

| Method | URL | Request Body | Response | Notes |
|--------|-----|-------------|----------|-------|
| `GET` | `/pettypes` | — | `PetType[]` | List all pet types |
| `GET` | `/pettypes/{typeId}` | — | `PetType` | Get single pet type |
| `POST` | `/pettypes` | `PetType` (without `id`) | `PetType` | Create a pet type |
| `PUT` | `/pettypes/{typeId}` | `PetType` | `PetType` | Update a pet type |
| `DELETE` | `/pettypes/{typeId}` | — | `void` | Delete a pet type |

---

### Visits

| Method | URL | Request Body | Response | Notes |
|--------|-----|-------------|----------|-------|
| `GET` | `/visits` | — | `Visit[]` | List all visits |
| `GET` | `/visits/{visitId}` | — | `Visit` | Get single visit |
| `POST` | `/owners/{ownerId}/pets/{petId}/visits` | `Visit` (without `id`) | `Visit` | Create a visit for a specific pet |
| `PUT` | `/visits/{visitId}` | `Visit` | `Visit` | Update an existing visit |
| `DELETE` | `/visits/{visitId}` | — | `void` | Delete a visit by ID |

#### Example: Create Visit

```
POST /owners/1/pets/1/visits
Content-Type: application/json

{
  "date": "2024-03-15",
  "description": "Annual checkup"
}

→ 201 Created
{
  "id": 5,
  "date": "2024-03-15",
  "description": "Annual checkup",
  "petId": 1,
  "pet": { ... }
}
```

---

## Error Handling

The Spring PetClinic REST backend returns errors via:

1. **Standard HTTP status codes** — `4xx` / `5xx` with a JSON or text error body.
2. **`errors` response header** — A JSON array of Spring MVC `FieldError` objects when form validation fails:

```json
// errors header value
[
  {
    "objectName": "owner",
    "fieldName": "telephone",
    "fieldValue": "",
    "errorMessage": "must not be empty"
  }
]
```

The frontend reads `error.headers.get('errors')`, parses the JSON array, and surfaces the first `errorMessage` to the user. If the header is absent, the raw `error.status` + `error.error` body is used.

---

## Angular Routes (for React Router mapping)

| Angular Path | Component | React Equivalent |
|-------------|-----------|-----------------|
| `/owners` | `OwnerListComponent` | Owner list / search page |
| `/owners/add` | `OwnerAddComponent` | Owner creation form |
| `/owners/:id` | `OwnerDetailComponent` | Owner detail view |
| `/owners/:id/edit` | `OwnerEditComponent` | Owner edit form |
| `/owners/:id/pets/add` | `PetAddComponent` | Add pet to owner |
| `/pets` | `PetListComponent` | Pet list page |
| `/pets/add` | `PetAddComponent` | Pet creation form |
| `/pets/:id/edit` | `PetEditComponent` | Pet edit form |
| `/pets/:id/visits/add` | `VisitAddComponent` | Add visit to pet |
| `/visits` | `VisitListComponent` | Visit list page |
| `/visits/add` | `VisitAddComponent` | Visit creation form |
| `/visits/:id/edit` | `VisitEditComponent` | Visit edit form |
