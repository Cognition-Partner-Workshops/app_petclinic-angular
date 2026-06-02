import { http, HttpResponse } from 'msw';

const BASE_URL = 'http://localhost:9966/petclinic/api';

const mockOwners: Record<string, unknown>[] = [
  {
    id: 1,
    firstName: 'George',
    lastName: 'Franklin',
    address: '110 W. Liberty St.',
    city: 'Madison',
    telephone: '6085551023',
    pets: [
      {
        id: 1,
        name: 'Leo',
        birthDate: '2010-09-07',
        type: { id: 1, name: 'cat' },
        ownerId: 1,
        owner: null,
        visits: [],
      },
    ],
  },
  {
    id: 2,
    firstName: 'Betty',
    lastName: 'Davis',
    address: '638 Cardinal Ave.',
    city: 'Sun Prairie',
    telephone: '6085551749',
    pets: [],
  },
];

const mockPets = [
  {
    id: 1,
    name: 'Leo',
    birthDate: '2010-09-07',
    type: { id: 1, name: 'cat' },
    ownerId: 1,
    owner: { id: 1, firstName: 'George', lastName: 'Franklin', address: '110 W. Liberty St.', city: 'Madison', telephone: '6085551023', pets: [] },
    visits: [],
  },
  {
    id: 2,
    name: 'Basil',
    birthDate: '2012-08-06',
    type: { id: 2, name: 'dog' },
    ownerId: 2,
    owner: { id: 2, firstName: 'Betty', lastName: 'Davis', address: '638 Cardinal Ave.', city: 'Sun Prairie', telephone: '6085551749', pets: [] },
    visits: [],
  },
];

const mockVisits = [
  {
    id: 1,
    date: '2023-01-01',
    description: 'Annual checkup',
    pet: { id: 1, name: 'Leo', birthDate: '2010-09-07', type: { id: 1, name: 'cat' }, ownerId: 1, owner: null, visits: [] },
    petId: 1,
  },
];

export const handlers = [
  // Owners
  http.get(`${BASE_URL}/owners`, ({ request }) => {
    const url = new URL(request.url);
    const lastName = url.searchParams.get('lastName');
    if (lastName) {
      const filtered = mockOwners.filter((o) => (o.lastName as string).toLowerCase().includes(lastName.toLowerCase()));
      return HttpResponse.json(filtered);
    }
    return HttpResponse.json(mockOwners);
  }),

  http.get(`${BASE_URL}/owners/:ownerId`, ({ params }) => {
    const owner = mockOwners.find((o) => (o.id as number) === Number(params.ownerId));
    if (!owner) {
      return new HttpResponse(null, { status: 404 });
    }
    return HttpResponse.json(owner);
  }),

  http.post(`${BASE_URL}/owners`, async ({ request }) => {
    const body = (await request.json()) as Record<string, unknown>;
    const newOwner = { id: 3, ...body, pets: [] };
    return HttpResponse.json(newOwner, { status: 201 });
  }),

  http.put(`${BASE_URL}/owners/:ownerId`, () => {
    return new HttpResponse(null, { status: 204 });
  }),

  http.delete(`${BASE_URL}/owners/:ownerId`, () => {
    return new HttpResponse(null, { status: 204 });
  }),

  // Pets
  http.get(`${BASE_URL}/pets`, () => {
    return HttpResponse.json(mockPets);
  }),

  http.get(`${BASE_URL}/pets/:petId`, ({ params }) => {
    const pet = mockPets.find((p) => p.id === Number(params.petId));
    if (!pet) {
      return new HttpResponse(null, { status: 404 });
    }
    return HttpResponse.json(pet);
  }),

  http.post(`${BASE_URL}/owners/:ownerId/pets`, async ({ request, params }) => {
    const body = (await request.json()) as Record<string, unknown>;
    const newPet = { id: 3, ...body, ownerId: Number(params.ownerId), owner: null, visits: [] };
    return HttpResponse.json(newPet, { status: 201 });
  }),

  http.put(`${BASE_URL}/pets/:petId`, () => {
    return new HttpResponse(null, { status: 204 });
  }),

  http.delete(`${BASE_URL}/pets/:petId`, () => {
    return new HttpResponse(null, { status: 204 });
  }),

  // Visits
  http.get(`${BASE_URL}/visits`, () => {
    return HttpResponse.json(mockVisits);
  }),

  http.get(`${BASE_URL}/visits/:visitId`, ({ params }) => {
    const visit = mockVisits.find((v) => v.id === Number(params.visitId));
    if (!visit) {
      return new HttpResponse(null, { status: 404 });
    }
    return HttpResponse.json(visit);
  }),

  http.post(`${BASE_URL}/owners/:ownerId/pets/:petId/visits`, async ({ request, params }) => {
    const body = (await request.json()) as Record<string, unknown>;
    const newVisit = { id: 2, ...body, pet: null, petId: Number(params.petId) };
    return HttpResponse.json(newVisit, { status: 201 });
  }),

  http.put(`${BASE_URL}/visits/:visitId`, () => {
    return new HttpResponse(null, { status: 204 });
  }),

  http.delete(`${BASE_URL}/visits/:visitId`, () => {
    return new HttpResponse(null, { status: 204 });
  }),

  // Pet Types
  http.get(`${BASE_URL}/pettypes`, () => {
    return HttpResponse.json([
      { id: 1, name: 'cat' },
      { id: 2, name: 'dog' },
      { id: 3, name: 'lizard' },
      { id: 4, name: 'snake' },
      { id: 5, name: 'bird' },
      { id: 6, name: 'hamster' },
    ]);
  }),
];
