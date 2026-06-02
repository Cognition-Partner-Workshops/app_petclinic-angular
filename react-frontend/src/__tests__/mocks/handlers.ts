import { http, HttpResponse } from 'msw';

const BASE_URL = 'http://localhost:9966/petclinic/api';

// --- Seed data ---

export const mockPetTypes = [
  { id: 1, name: 'cat' },
  { id: 2, name: 'dog' },
  { id: 3, name: 'lizard' },
  { id: 4, name: 'snake' },
  { id: 5, name: 'bird' },
  { id: 6, name: 'hamster' },
];

export const mockOwners = [
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
        birthDate: '2020-09-07',
        type: { id: 1, name: 'cat' },
        ownerId: 1,
        visits: [
          {
            id: 1,
            date: '2024-03-10',
            description: 'Rabies shot',
            petId: 1,
          },
        ],
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
    pets: [
      {
        id: 2,
        name: 'Basil',
        birthDate: '2018-08-06',
        type: { id: 6, name: 'hamster' },
        ownerId: 2,
        visits: [],
      },
    ],
  },
  {
    id: 3,
    firstName: 'Eduardo',
    lastName: 'Rodriguez',
    address: '2693 Commerce St.',
    city: 'McFarland',
    telephone: '6085558763',
    pets: [],
  },
];

export const mockPets = [
  {
    id: 1,
    name: 'Leo',
    birthDate: '2020-09-07',
    type: { id: 1, name: 'cat' },
    ownerId: 1,
    owner: {
      id: 1,
      firstName: 'George',
      lastName: 'Franklin',
      address: '110 W. Liberty St.',
      city: 'Madison',
      telephone: '6085551023',
    },
    visits: [
      {
        id: 1,
        date: '2024-03-10',
        description: 'Rabies shot',
        petId: 1,
      },
    ],
  },
  {
    id: 2,
    name: 'Basil',
    birthDate: '2018-08-06',
    type: { id: 6, name: 'hamster' },
    ownerId: 2,
    owner: {
      id: 2,
      firstName: 'Betty',
      lastName: 'Davis',
      address: '638 Cardinal Ave.',
      city: 'Sun Prairie',
      telephone: '6085551749',
    },
    visits: [],
  },
];

export const mockVisits = [
  {
    id: 1,
    date: '2024-03-10',
    description: 'Rabies shot',
    petId: 1,
    pet: {
      id: 1,
      name: 'Leo',
      birthDate: '2020-09-07',
      type: { id: 1, name: 'cat' },
      ownerId: 1,
    },
  },
  {
    id: 2,
    date: '2024-05-20',
    description: 'Annual checkup',
    petId: 2,
    pet: {
      id: 2,
      name: 'Basil',
      birthDate: '2018-08-06',
      type: { id: 6, name: 'hamster' },
      ownerId: 2,
    },
  },
];

// --- Handlers ---

export const handlers = [
  // ========== PET TYPES ==========
  http.get(`${BASE_URL}/pettypes`, () => {
    return HttpResponse.json(mockPetTypes);
  }),

  http.get(`${BASE_URL}/pettypes/:typeId`, ({ params }) => {
    const typeId = Number(params.typeId);
    const petType = mockPetTypes.find((t) => t.id === typeId);
    if (!petType) {
      return new HttpResponse(null, { status: 404 });
    }
    return HttpResponse.json(petType);
  }),

  http.post(`${BASE_URL}/pettypes`, async ({ request }) => {
    const body = (await request.json()) as { name: string };
    const newType = { id: mockPetTypes.length + 1, name: body.name };
    return HttpResponse.json(newType, { status: 201 });
  }),

  http.put(`${BASE_URL}/pettypes/:typeId`, async ({ params, request }) => {
    const typeId = Number(params.typeId);
    const body = (await request.json()) as { id: number; name: string };
    return HttpResponse.json({ ...body, id: typeId });
  }),

  http.delete(`${BASE_URL}/pettypes/:typeId`, () => {
    return new HttpResponse(null, { status: 204 });
  }),

  // ========== OWNERS ==========
  http.get(`${BASE_URL}/owners`, ({ request }) => {
    const url = new URL(request.url);
    const lastName = url.searchParams.get('lastName');
    if (lastName) {
      const filtered = mockOwners.filter((o) =>
        o.lastName.toLowerCase().includes(lastName.toLowerCase()),
      );
      return HttpResponse.json(filtered);
    }
    return HttpResponse.json(mockOwners);
  }),

  http.get(`${BASE_URL}/owners/:ownerId`, ({ params }) => {
    const ownerId = Number(params.ownerId);
    const owner = mockOwners.find((o) => o.id === ownerId);
    if (!owner) {
      return new HttpResponse(null, { status: 404 });
    }
    return HttpResponse.json(owner);
  }),

  http.post(`${BASE_URL}/owners`, async ({ request }) => {
    const body = (await request.json()) as Omit<
      (typeof mockOwners)[0],
      'id' | 'pets'
    >;
    const newOwner = {
      id: mockOwners.length + 1,
      ...body,
      pets: [],
    };
    return HttpResponse.json(newOwner, { status: 201 });
  }),

  http.put(`${BASE_URL}/owners/:ownerId`, async ({ params, request }) => {
    const ownerId = Number(params.ownerId);
    const body = (await request.json()) as (typeof mockOwners)[0];
    return HttpResponse.json({ ...body, id: ownerId });
  }),

  http.delete(`${BASE_URL}/owners/:ownerId`, () => {
    return new HttpResponse(null, { status: 204 });
  }),

  // ========== PETS ==========
  http.get(`${BASE_URL}/pets`, () => {
    return HttpResponse.json(mockPets);
  }),

  http.get(`${BASE_URL}/pets/:petId`, ({ params }) => {
    const petId = Number(params.petId);
    const pet = mockPets.find((p) => p.id === petId);
    if (!pet) {
      return new HttpResponse(null, { status: 404 });
    }
    return HttpResponse.json(pet);
  }),

  http.post(`${BASE_URL}/owners/:ownerId/pets`, async ({ params, request }) => {
    const ownerId = Number(params.ownerId);
    const body = (await request.json()) as {
      name: string;
      birthDate: string;
      type: { id: number; name: string };
    };
    const owner = mockOwners.find((o) => o.id === ownerId);
    const newPet = {
      id: mockPets.length + 1,
      ...body,
      ownerId,
      owner: owner ?? {
        id: ownerId,
        firstName: '',
        lastName: '',
        address: '',
        city: '',
        telephone: '',
      },
      visits: [],
    };
    return HttpResponse.json(newPet, { status: 201 });
  }),

  http.put(`${BASE_URL}/pets/:petId`, async ({ params, request }) => {
    const petId = Number(params.petId);
    const body = (await request.json()) as (typeof mockPets)[0];
    return HttpResponse.json({ ...body, id: petId });
  }),

  http.delete(`${BASE_URL}/pets/:petId`, () => {
    return new HttpResponse(null, { status: 204 });
  }),

  // ========== VISITS ==========
  http.get(`${BASE_URL}/visits`, () => {
    return HttpResponse.json(mockVisits);
  }),

  http.get(`${BASE_URL}/visits/:visitId`, ({ params }) => {
    const visitId = Number(params.visitId);
    const visit = mockVisits.find((v) => v.id === visitId);
    if (!visit) {
      return new HttpResponse(null, { status: 404 });
    }
    return HttpResponse.json(visit);
  }),

  http.post(
    `${BASE_URL}/owners/:ownerId/pets/:petId/visits`,
    async ({ params, request }) => {
      const petId = Number(params.petId);
      const body = (await request.json()) as {
        date: string;
        description: string;
      };
      const pet = mockPets.find((p) => p.id === petId);
      const newVisit = {
        id: mockVisits.length + 1,
        ...body,
        petId,
        pet: pet ?? {
          id: petId,
          name: '',
          birthDate: '',
          type: { id: 0, name: '' },
          ownerId: Number(params.ownerId),
        },
      };
      return HttpResponse.json(newVisit, { status: 201 });
    },
  ),

  http.put(`${BASE_URL}/visits/:visitId`, async ({ params, request }) => {
    const visitId = Number(params.visitId);
    const body = (await request.json()) as (typeof mockVisits)[0];
    return HttpResponse.json({ ...body, id: visitId });
  }),

  http.delete(`${BASE_URL}/visits/:visitId`, () => {
    return new HttpResponse(null, { status: 204 });
  }),
];
