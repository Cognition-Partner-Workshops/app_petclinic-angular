# API Contract — Owners, Pets, Visits

Base URL: `http://localhost:9966/petclinic/api/`

---

## Owners

### List / Search Owners

```
GET /owners
GET /owners?lastName={lastName}
```

**Response:** `200 OK`
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
        "name": "Leo",
        "birthDate": "2010-09-07",
        "type": { "id": 1, "name": "cat" },
        "ownerId": 1,
        "owner": null,
        "visits": []
      }
    ]
  }
]
```

### Get Owner by ID

```
GET /owners/:ownerId
```

**Response:** `200 OK`
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

**Error:** `404 Not Found`

### Create Owner

```
POST /owners
Content-Type: application/json
```

**Request Body:**
```json
{
  "firstName": "George",
  "lastName": "Franklin",
  "address": "110 W. Liberty St.",
  "city": "Madison",
  "telephone": "6085551023"
}
```

**Response:** `201 Created`
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

### Update Owner

```
PUT /owners/:ownerId
Content-Type: application/json
```

**Request Body:**
```json
{
  "id": 1,
  "firstName": "George",
  "lastName": "Franklin",
  "address": "110 W. Liberty St.",
  "city": "Madison",
  "telephone": "6085551023"
}
```

**Response:** `204 No Content`

### Delete Owner

```
DELETE /owners/:ownerId
```

**Response:** `204 No Content`

---

## Pets

### List All Pets

```
GET /pets
```

**Response:** `200 OK`
```json
[
  {
    "id": 1,
    "name": "Leo",
    "birthDate": "2010-09-07",
    "type": { "id": 1, "name": "cat" },
    "ownerId": 1,
    "owner": { "id": 1, "firstName": "George", "lastName": "Franklin", "address": "...", "city": "...", "telephone": "...", "pets": [] },
    "visits": []
  }
]
```

### Get Pet by ID

```
GET /pets/:petId
```

**Response:** `200 OK`
```json
{
  "id": 1,
  "name": "Leo",
  "birthDate": "2010-09-07",
  "type": { "id": 1, "name": "cat" },
  "ownerId": 1,
  "owner": { "id": 1, "firstName": "George", "lastName": "Franklin", "address": "...", "city": "...", "telephone": "...", "pets": [] },
  "visits": []
}
```

**Error:** `404 Not Found`

### Add Pet to Owner

```
POST /owners/:ownerId/pets
Content-Type: application/json
```

**Request Body:**
```json
{
  "name": "Leo",
  "birthDate": "2010-09-07",
  "type": { "id": 1, "name": "cat" }
}
```

**Response:** `201 Created`
```json
{
  "id": 1,
  "name": "Leo",
  "birthDate": "2010-09-07",
  "type": { "id": 1, "name": "cat" },
  "ownerId": 1,
  "owner": null,
  "visits": []
}
```

### Update Pet

```
PUT /pets/:petId
Content-Type: application/json
```

**Request Body:**
```json
{
  "id": 1,
  "name": "Leo",
  "birthDate": "2010-09-07",
  "type": { "id": 1, "name": "cat" },
  "ownerId": 1
}
```

**Response:** `204 No Content`

### Delete Pet

```
DELETE /pets/:petId
```

**Response:** `204 No Content`

---

## Visits

### List All Visits

```
GET /visits
```

**Response:** `200 OK`
```json
[
  {
    "id": 1,
    "date": "2023-01-01",
    "description": "Annual checkup",
    "pet": { "id": 1, "name": "Leo", "birthDate": "2010-09-07", "type": { "id": 1, "name": "cat" }, "ownerId": 1, "owner": null, "visits": [] },
    "petId": 1
  }
]
```

### Get Visit by ID

```
GET /visits/:visitId
```

**Response:** `200 OK`
```json
{
  "id": 1,
  "date": "2023-01-01",
  "description": "Annual checkup",
  "pet": { "id": 1, "name": "Leo", "birthDate": "...", "type": {...}, "ownerId": 1, "owner": null, "visits": [] },
  "petId": 1
}
```

**Error:** `404 Not Found`

### Add Visit to Pet

```
POST /owners/:ownerId/pets/:petId/visits
Content-Type: application/json
```

**Request Body:**
```json
{
  "date": "2023-01-01",
  "description": "Annual checkup"
}
```

**Response:** `201 Created`
```json
{
  "id": 1,
  "date": "2023-01-01",
  "description": "Annual checkup",
  "pet": null,
  "petId": 1
}
```

### Update Visit

```
PUT /visits/:visitId
Content-Type: application/json
```

**Request Body:**
```json
{
  "id": 1,
  "date": "2023-01-01",
  "description": "Updated checkup notes"
}
```

**Response:** `204 No Content`

### Delete Visit

```
DELETE /visits/:visitId
```

**Response:** `204 No Content`

---

## Common Types

### Owner
| Field       | Type     | Description            |
|-------------|----------|------------------------|
| id          | number   | Unique identifier      |
| firstName   | string   | Owner's first name     |
| lastName    | string   | Owner's last name      |
| address     | string   | Street address         |
| city        | string   | City                   |
| telephone   | string   | Phone number           |
| pets        | Pet[]    | Associated pets        |

### Pet
| Field      | Type     | Description             |
|------------|----------|-------------------------|
| id         | number   | Unique identifier       |
| name       | string   | Pet name                |
| birthDate  | string   | ISO date (YYYY-MM-DD)   |
| type       | PetType  | Species/breed category  |
| ownerId    | number   | FK to owner             |
| owner      | Owner    | Owner object (nullable) |
| visits     | Visit[]  | Associated visits       |

### PetType
| Field | Type   | Description        |
|-------|--------|--------------------|
| id    | number | Unique identifier  |
| name  | string | Type name (e.g., "cat") |

### Visit
| Field       | Type   | Description             |
|-------------|--------|-------------------------|
| id          | number | Unique identifier       |
| date        | string | ISO date (YYYY-MM-DD)   |
| description | string | Visit notes             |
| pet         | Pet    | Associated pet (nullable)|
| petId       | number | FK to pet (optional)    |

---

## Error Handling

- `404 Not Found` — resource does not exist
- `400 Bad Request` — validation failure (missing required fields)
- Network errors — connection refused / timeout
