# PetClinic REST API Contract — Owners, Pets, Visits

Base URL: `http://localhost:9966/petclinic/api/`

---

## Type Definitions

```typescript
interface PetType {
  id: number;
  name: string;
}

interface Visit {
  id: number;
  date: string;        // ISO date string, e.g. "2024-01-15"
  description: string;
  pet: Pet;
  petId?: number;
}

interface Pet {
  id: number;
  ownerId: number;
  name: string;
  birthDate: string;   // ISO date string, e.g. "2024-01-15"
  type: PetType;
  owner: Owner;
  visits: Visit[];
}

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

---

## Owners

### List / Search Owners

```
GET /owners
GET /owners?lastName={lastName}
```

- **Response:** `200 OK` — `Owner[]`
- **Notes:** Without `lastName` query param, returns all owners. With `lastName`, filters by last name (server-side match). The Angular app uses the same endpoint for both listing and searching.

### Get Owner by ID

```
GET /owners/{ownerId}
```

- **Path params:** `ownerId` — integer
- **Response:** `200 OK` — `Owner` (includes nested `pets` array, each pet includes nested `visits` array)
- **Error:** `404 Not Found` if owner does not exist

### Create Owner

```
POST /owners
```

- **Request body:** `Owner` (without `id` and `pets` fields)
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
- **Validation:** All fields required. `telephone` must be numeric digits only.

### Update Owner

```
PUT /owners/{ownerId}
```

- **Path params:** `ownerId` — integer (passed as string in Angular service)
- **Request body:** `Owner`
  ```json
  {
    "id": 1,
    "firstName": "string",
    "lastName": "string",
    "address": "string",
    "city": "string",
    "telephone": "string"
  }
  ```
- **Response:** `204 No Content`
- **Error:** `404 Not Found` if owner does not exist

### Delete Owner

```
DELETE /owners/{ownerId}
```

- **Path params:** `ownerId` — integer (passed as string in Angular service)
- **Response:** `204 No Content`
- **Error:** `404 Not Found` if owner does not exist

---

## Pets

### List All Pets

```
GET /pets
```

- **Response:** `200 OK` — `Pet[]`

### Get Pet by ID

```
GET /pets/{petId}
```

- **Path params:** `petId` — integer
- **Response:** `200 OK` — `Pet` (includes nested `owner`, `type`, and `visits`)
- **Error:** `404 Not Found` if pet does not exist

### Create Pet (under Owner)

```
POST /owners/{ownerId}/pets
```

- **Path params:** `ownerId` — integer (derived from `pet.owner.id` in Angular service)
- **Request body:** `Pet` (without `id`)
  ```json
  {
    "name": "string",
    "birthDate": "2024-01-15",
    "type": { "id": 1, "name": "cat" }
  }
  ```
- **Response:** `201 Created` — `Pet` (with assigned `id`)
- **Validation:** `name` required, `birthDate` required, `type` required.

### Update Pet

```
PUT /pets/{petId}
```

- **Path params:** `petId` — integer (passed as string in Angular service)
- **Request body:** `Pet`
  ```json
  {
    "id": 1,
    "name": "string",
    "birthDate": "2024-01-15",
    "type": { "id": 1, "name": "cat" },
    "ownerId": 1,
    "owner": { "id": 1, "firstName": "...", "lastName": "...", "address": "...", "city": "...", "telephone": "...", "pets": [] }
  }
  ```
- **Response:** `204 No Content`
- **Error:** `404 Not Found` if pet does not exist

### Delete Pet

```
DELETE /pets/{petId}
```

- **Path params:** `petId` — integer (passed as string in Angular service)
- **Response:** `204 No Content`
- **Error:** `404 Not Found` if pet does not exist

---

## Visits

### List All Visits

```
GET /visits
```

- **Response:** `200 OK` — `Visit[]`

### Get Visit by ID

```
GET /visits/{visitId}
```

- **Path params:** `visitId` — string
- **Response:** `200 OK` — `Visit`
- **Error:** `404 Not Found` if visit does not exist

### Create Visit (under Owner's Pet)

```
POST /owners/{ownerId}/pets/{petId}/visits
```

- **Path params:**
  - `ownerId` — integer (derived from `visit.pet.ownerId`)
  - `petId` — integer (derived from `visit.pet.id`)
- **Request body:** `Visit` (without `id`)
  ```json
  {
    "date": "2024-01-15",
    "description": "annual checkup"
  }
  ```
- **Response:** `201 Created` — `Visit` (with assigned `id`)
- **Validation:** `date` required, `description` required.

### Update Visit

```
PUT /visits/{visitId}
```

- **Path params:** `visitId` — string
- **Request body:** `Visit`
  ```json
  {
    "id": 1,
    "date": "2024-01-15",
    "description": "updated description",
    "pet": { ... },
    "petId": 1
  }
  ```
- **Response:** `204 No Content`
- **Error:** `404 Not Found` if visit does not exist

### Delete Visit

```
DELETE /visits/{visitId}
```

- **Path params:** `visitId` — string
- **Response:** `204 No Content`
- **Error:** `404 Not Found` if visit does not exist

---

## Pet Types (supporting endpoint)

### List All Pet Types

```
GET /pettypes
```

- **Response:** `200 OK` — `PetType[]`
- **Notes:** Used by pet add/edit forms to populate the type dropdown.

---

## Error Handling

The Spring PetClinic backend returns errors in two ways:

1. **Standard HTTP errors:** `404 Not Found`, `400 Bad Request`, `500 Internal Server Error`
2. **Validation errors via `errors` header:** The response includes an `errors` HTTP header containing a JSON array of field errors. Each entry has an `errorMessage` field:
   ```json
   [{ "errorMessage": "First name must not be empty" }]
   ```

The Angular frontend parses the `errors` header first; if absent, it falls back to the HTTP status code and error body.

---

## Angular Routes (for React router mapping)

| Angular Path                      | Component          |
| --------------------------------- | ------------------ |
| `/owners`                         | OwnerList          |
| `/owners/add`                     | OwnerAdd           |
| `/owners/:id`                     | OwnerDetail        |
| `/owners/:id/edit`                | OwnerEdit          |
| `/owners/:id/pets/add`            | PetAdd             |
| `/pets`                           | PetList            |
| `/pets/add`                       | PetAdd             |
| `/pets/:id/edit`                  | PetEdit            |
| `/pets/:id/visits/add`            | VisitAdd           |
| `/visits`                         | VisitList          |
| `/visits/add`                     | VisitAdd           |
| `/visits/:id/edit`                | VisitEdit          |
