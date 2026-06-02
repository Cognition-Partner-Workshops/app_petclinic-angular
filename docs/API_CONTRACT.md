# PetClinic REST API Contract

> Extracted from the Angular frontend service files and TypeScript interfaces.
> Base URL: `http://localhost:9966/petclinic/api/`

---

## Data Models

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

### PetType

```typescript
interface PetType {
  id: number;
  name: string;
}
```

### Visit

```typescript
interface Visit {
  id: number;
  date: string;          // ISO date string, e.g. "2020-03-10"
  description: string;
  pet: Pet;
  petId?: number;        // optional shorthand used in some request payloads
}
```

---

## Error Handling

All endpoints follow Spring MVC error conventions:

- On HTTP error, the response may include an `errors` JSON header containing an array of `FieldError` objects.
- Each `FieldError` has an `errorMessage` property with a human-readable validation message.
- The frontend parses the `errors` header first; if absent, it falls back to `server returned code ${status} with body "${body}"`.
- On network/client errors (`ErrorEvent`), the `error.message` is used directly.
- Errors are re-thrown as `Observable` errors (not swallowed).

---

## Endpoints

### Owners

#### List All Owners

```
GET /owners
```

- **Response:** `200 OK` — `Owner[]`
- **Error fallback:** empty array `[]`

#### Search Owners by Last Name

```
GET /owners?lastName={lastName}
```

- **Query Params:**
  - `lastName` (string, optional) — partial/full last name filter
- **Response:** `200 OK` — `Owner[]`
- **Error fallback:** empty array `[]`
- **Notes:** If `lastName` is `undefined`, the query param is omitted and all owners are returned.

#### Get Owner by ID

```
GET /owners/{ownerId}
```

- **Path Params:**
  - `ownerId` (number)
- **Response:** `200 OK` — `Owner` (includes nested `pets` with their `visits`)
- **Error fallback:** `{} as Owner`

#### Create Owner

```
POST /owners
```

- **Request Body:** `Owner` (without `id`; `pets` may be empty or omitted)

```json
{
  "firstName": "string",
  "lastName": "string",
  "address": "string",
  "city": "string",
  "telephone": "string"
}
```

- **Response:** `201 Created` — `Owner` (with assigned `id`)
- **Error fallback:** returns the input owner object
- **Validation:** Spring MVC field validation; errors in `errors` response header

#### Update Owner

```
PUT /owners/{ownerId}
```

- **Path Params:**
  - `ownerId` (string — passed as string in the Angular code, represents numeric ID)
- **Request Body:** `Owner`

```json
{
  "id": 1,
  "firstName": "string",
  "lastName": "string",
  "address": "string",
  "city": "string",
  "telephone": "string",
  "pets": []
}
```

- **Response:** `200 OK` or `204 No Content` — `Owner`
- **Error fallback:** returns the input owner object

#### Delete Owner

```
DELETE /owners/{ownerId}
```

- **Path Params:**
  - `ownerId` (string — represents numeric ID)
- **Response:** `204 No Content`
- **Error fallback:** returns `[ownerId]`

---

### Pets

#### List All Pets

```
GET /pets
```

- **Response:** `200 OK` — `Pet[]`
- **Error fallback:** empty array `[]`

#### Get Pet by ID

```
GET /pets/{petId}
```

- **Path Params:**
  - `petId` (number)
- **Response:** `200 OK` — `Pet`
- **Error fallback:** `{} as Pet`

#### Create Pet (nested under Owner)

```
POST /owners/{ownerId}/pets
```

- **Path Params:**
  - `ownerId` (number — extracted from `pet.owner.id`)
- **Request Body:** `Pet`

```json
{
  "name": "string",
  "birthDate": "2020-01-15",
  "type": { "id": 1, "name": "dog" }
}
```

- **Response:** `201 Created` — `Pet` (with assigned `id`)
- **Error fallback:** returns the input pet object

#### Update Pet

```
PUT /pets/{petId}
```

- **Path Params:**
  - `petId` (string — represents numeric ID)
- **Request Body:** `Pet`

```json
{
  "id": 1,
  "name": "string",
  "birthDate": "2020-01-15",
  "type": { "id": 1, "name": "dog" },
  "ownerId": 1
}
```

- **Response:** `200 OK` or `204 No Content` — `Pet`
- **Error fallback:** returns the input pet object

#### Delete Pet

```
DELETE /pets/{petId}
```

- **Path Params:**
  - `petId` (string — represents numeric ID)
- **Response:** `204 No Content`
- **Error fallback:** returns `0`

---

### Visits

#### List All Visits

```
GET /visits
```

- **Response:** `200 OK` — `Visit[]`
- **Error fallback:** empty array `[]`

#### Get Visit by ID

```
GET /visits/{visitId}
```

- **Path Params:**
  - `visitId` (string)
- **Response:** `200 OK` — `Visit`
- **Error fallback:** `{} as Visit`

#### Create Visit (nested under Owner → Pet)

```
POST /owners/{ownerId}/pets/{petId}/visits
```

- **Path Params:**
  - `ownerId` (number — extracted from `visit.pet.ownerId`)
  - `petId` (number — extracted from `visit.pet.id`)
- **Request Body:** `Visit`

```json
{
  "date": "2020-03-10",
  "description": "string"
}
```

- **Response:** `201 Created` — `Visit` (with assigned `id`)
- **Error fallback:** returns the input visit object

#### Update Visit

```
PUT /visits/{visitId}
```

- **Path Params:**
  - `visitId` (string — represents numeric ID)
- **Request Body:** `Visit`

```json
{
  "id": 1,
  "date": "2020-03-10",
  "description": "string",
  "pet": { ... },
  "petId": 1
}
```

- **Response:** `200 OK` or `204 No Content` — `Visit`
- **Error fallback:** returns the input visit object

#### Delete Visit

```
DELETE /visits/{visitId}
```

- **Path Params:**
  - `visitId` (string — represents numeric ID)
- **Response:** `204 No Content`
- **Error fallback:** returns `0`

---

### Pet Types (dependency for Pet management)

#### List All Pet Types

```
GET /pettypes
```

- **Response:** `200 OK` — `PetType[]`
- **Error fallback:** empty array `[]`

#### Get Pet Type by ID

```
GET /pettypes/{typeId}
```

- **Path Params:**
  - `typeId` (string)
- **Response:** `200 OK` — `PetType`
- **Error fallback:** `{} as PetType`

---

## Angular Frontend Routes (for React migration reference)

| Path                              | Component            |
|-----------------------------------|----------------------|
| `/owners`                         | OwnerListComponent   |
| `/owners/add`                     | OwnerAddComponent    |
| `/owners/:id`                     | OwnerDetailComponent |
| `/owners/:id/edit`                | OwnerEditComponent   |
| `/owners/:id/pets/add`            | PetAddComponent      |
| `/pets`                           | PetListComponent     |
| `/pets/add`                       | PetAddComponent      |
| `/pets/:id/edit`                  | PetEditComponent     |
| `/pets/:id/visits/add`            | VisitAddComponent    |
| `/visits`                         | VisitListComponent   |
| `/visits/add`                     | VisitAddComponent    |
| `/visits/:id/edit`                | VisitEditComponent   |
