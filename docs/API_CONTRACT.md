# PetClinic REST API Contract

Base URL: `http://localhost:9966/petclinic/api/`

---

## TypeScript Interfaces

```typescript
interface PetType {
  id: number;
  name: string;
}

interface Visit {
  id: number;
  date: string;       // ISO 8601 date string, e.g. "2024-01-15"
  description: string;
  pet: Pet;
  petId?: number;
}

interface Pet {
  id: number;
  ownerId: number;
  name: string;
  birthDate: string;  // ISO 8601 date string
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

### List All Owners

- **Method:** `GET`
- **URL:** `/owners`
- **Query Parameters:** `lastName` (optional) — filters owners by last name
- **Request Body:** None
- **Response:** `200 OK`
  ```json
  [
    {
      "id": 1,
      "firstName": "George",
      "lastName": "Franklin",
      "address": "110 W. Liberty St.",
      "city": "Madison",
      "telephone": "6085551023",
      "pets": [
        {
          "id": 1,
          "ownerId": 1,
          "name": "Leo",
          "birthDate": "2010-09-07",
          "type": { "id": 1, "name": "cat" },
          "owner": null,
          "visits": []
        }
      ]
    }
  ]
  ```
- **Error Handling:** Returns empty array on failure (Angular service default). Server may return `500` on internal error.

### Get Owner by ID

- **Method:** `GET`
- **URL:** `/owners/{ownerId}`
- **Path Parameters:** `ownerId` (number)
- **Request Body:** None
- **Response:** `200 OK`
  ```json
  {
    "id": 1,
    "firstName": "George",
    "lastName": "Franklin",
    "address": "110 W. Liberty St.",
    "city": "Madison",
    "telephone": "6085551023",
    "pets": []
  }
  ```
- **Error Handling:** `404 Not Found` if owner does not exist.

### Create Owner

- **Method:** `POST`
- **URL:** `/owners`
- **Request Body:**
  ```json
  {
    "firstName": "George",
    "lastName": "Franklin",
    "address": "110 W. Liberty St.",
    "city": "Madison",
    "telephone": "6085551023"
  }
  ```
- **Response:** `201 Created` — returns the created Owner object with assigned `id`.
- **Error Handling:** `400 Bad Request` with validation errors in the `errors` response header (JSON array with `errorMessage` fields). Server returns `500` on internal error.

### Update Owner

- **Method:** `PUT`
- **URL:** `/owners/{ownerId}`
- **Path Parameters:** `ownerId` (number, passed as string in Angular)
- **Request Body:** Full Owner object (same shape as Create).
- **Response:** `204 No Content` on success.
- **Error Handling:** `404 Not Found` if owner does not exist. `400 Bad Request` for validation errors.

### Delete Owner

- **Method:** `DELETE`
- **URL:** `/owners/{ownerId}`
- **Path Parameters:** `ownerId` (number, passed as string in Angular)
- **Request Body:** None
- **Response:** `204 No Content` on success.
- **Error Handling:** `404 Not Found` if owner does not exist.

---

## Pets

### List All Pets

- **Method:** `GET`
- **URL:** `/pets`
- **Request Body:** None
- **Response:** `200 OK`
  ```json
  [
    {
      "id": 1,
      "ownerId": 1,
      "name": "Leo",
      "birthDate": "2010-09-07",
      "type": { "id": 1, "name": "cat" },
      "owner": { "id": 1, "firstName": "George", "lastName": "Franklin", "address": "...", "city": "...", "telephone": "...", "pets": [] },
      "visits": []
    }
  ]
  ```
- **Error Handling:** Returns empty array on failure.

### Get Pet by ID

- **Method:** `GET`
- **URL:** `/pets/{petId}`
- **Path Parameters:** `petId` (number)
- **Request Body:** None
- **Response:** `200 OK` — single Pet object.
- **Error Handling:** `404 Not Found` if pet does not exist.

### Create Pet (under Owner)

- **Method:** `POST`
- **URL:** `/owners/{ownerId}/pets`
- **Path Parameters:** `ownerId` (number, derived from `pet.owner.id`)
- **Request Body:**
  ```json
  {
    "name": "Leo",
    "birthDate": "2010-09-07",
    "type": { "id": 1, "name": "cat" }
  }
  ```
- **Response:** `201 Created` — returns the created Pet object with assigned `id`.
- **Error Handling:** `400 Bad Request` for validation errors. `404 Not Found` if parent owner does not exist.

### Update Pet

- **Method:** `PUT`
- **URL:** `/pets/{petId}`
- **Path Parameters:** `petId` (number, passed as string in Angular)
- **Request Body:** Full Pet object.
- **Response:** `204 No Content` on success.
- **Error Handling:** `404 Not Found` if pet does not exist. `400 Bad Request` for validation errors.

### Delete Pet

- **Method:** `DELETE`
- **URL:** `/pets/{petId}`
- **Path Parameters:** `petId` (number, passed as string in Angular)
- **Request Body:** None
- **Response:** `204 No Content` on success.
- **Error Handling:** `404 Not Found` if pet does not exist.

---

## Visits

### List All Visits

- **Method:** `GET`
- **URL:** `/visits`
- **Request Body:** None
- **Response:** `200 OK`
  ```json
  [
    {
      "id": 1,
      "date": "2024-01-15",
      "description": "Annual checkup",
      "pet": { "id": 1, "ownerId": 1, "name": "Leo", "birthDate": "2010-09-07", "type": {...}, "owner": {...}, "visits": [] },
      "petId": 1
    }
  ]
  ```
- **Error Handling:** Returns empty array on failure.

### Get Visit by ID

- **Method:** `GET`
- **URL:** `/visits/{visitId}`
- **Path Parameters:** `visitId` (number, passed as string in Angular)
- **Request Body:** None
- **Response:** `200 OK` — single Visit object.
- **Error Handling:** `404 Not Found` if visit does not exist.

### Create Visit (under Owner's Pet)

- **Method:** `POST`
- **URL:** `/owners/{ownerId}/pets/{petId}/visits`
- **Path Parameters:**
  - `ownerId` (number, derived from `visit.pet.ownerId`)
  - `petId` (number, derived from `visit.pet.id`)
- **Request Body:**
  ```json
  {
    "date": "2024-01-15",
    "description": "Annual checkup"
  }
  ```
- **Response:** `201 Created` — returns the created Visit object with assigned `id`.
- **Error Handling:** `400 Bad Request` for validation errors. `404 Not Found` if owner or pet does not exist.

### Update Visit

- **Method:** `PUT`
- **URL:** `/visits/{visitId}`
- **Path Parameters:** `visitId` (number, passed as string in Angular)
- **Request Body:** Full Visit object.
- **Response:** `204 No Content` on success.
- **Error Handling:** `404 Not Found` if visit does not exist. `400 Bad Request` for validation errors.

### Delete Visit

- **Method:** `DELETE`
- **URL:** `/visits/{visitId}`
- **Path Parameters:** `visitId` (number, passed as string in Angular)
- **Request Body:** None
- **Response:** `204 No Content` on success.
- **Error Handling:** `404 Not Found` if visit does not exist.

---

## Pet Types (supporting endpoint)

### List All Pet Types

- **Method:** `GET`
- **URL:** `/pettypes`
- **Request Body:** None
- **Response:** `200 OK`
  ```json
  [
    { "id": 1, "name": "cat" },
    { "id": 2, "name": "dog" }
  ]
  ```

---

## Error Response Format

The Spring PetClinic REST backend communicates validation errors via a custom `errors` HTTP response header containing a JSON array:

```json
[
  {
    "errorMessage": "lastName must not be empty"
  }
]
```

Standard HTTP error codes are used:
- `400 Bad Request` — validation failure
- `404 Not Found` — resource does not exist
- `500 Internal Server Error` — unexpected server error

The Angular frontend catches all errors via `HttpErrorHandler`, which parses the `errors` header when present and falls back to logging the HTTP status and error body.
