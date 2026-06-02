import { http, HttpResponse } from 'msw';
import type { Owner, Pet, Visit, PetType } from '../../types';

const BASE_URL = 'http://localhost:9966/petclinic/api';

// ── Realistic test data ──────────────────────────────────────────────

const petTypes: PetType[] = [
  { id: 1, name: 'cat' },
  { id: 2, name: 'dog' },
  { id: 3, name: 'lizard' },
];

const owners: Owner[] = [
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
        ownerId: 1,
        name: 'Leo',
        birthDate: '2010-09-07',
        type: { id: 1, name: 'cat' },
        owner: null as unknown as Owner,
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

const pets: Pet[] = [
  {
    id: 1,
    ownerId: 1,
    name: 'Leo',
    birthDate: '2010-09-07',
    type: { id: 1, name: 'cat' },
    owner: {
      id: 1,
      firstName: 'George',
      lastName: 'Franklin',
      address: '110 W. Liberty St.',
      city: 'Madison',
      telephone: '6085551023',
      pets: [],
    },
    visits: [],
  },
  {
    id: 2,
    ownerId: 2,
    name: 'Basil',
    birthDate: '2012-08-06',
    type: { id: 2, name: 'dog' },
    owner: {
      id: 2,
      firstName: 'Betty',
      lastName: 'Davis',
      address: '638 Cardinal Ave.',
      city: 'Sun Prairie',
      telephone: '6085551749',
      pets: [],
    },
    visits: [],
  },
];

const visits: Visit[] = [
  {
    id: 1,
    date: '2024-01-15',
    description: 'Annual checkup',
    pet: pets[0],
    petId: 1,
  },
  {
    id: 2,
    date: '2024-03-20',
    description: 'Vaccination',
    pet: pets[1],
    petId: 2,
  },
];

// ── Handlers ─────────────────────────────────────────────────────────

export const handlers = [
  // ── Owners ───────────────────────────────────────────────────────
  http.get(`${BASE_URL}/owners`, ({ request }) => {
    const url = new URL(request.url);
    const lastName = url.searchParams.get('lastName');
    if (lastName) {
      const filtered = owners.filter((o) =>
        o.lastName.toLowerCase().includes(lastName.toLowerCase()),
      );
      return HttpResponse.json(filtered);
    }
    return HttpResponse.json(owners);
  }),

  http.get(`${BASE_URL}/owners/:ownerId`, ({ params }) => {
    const id = Number(params.ownerId);
    const owner = owners.find((o) => o.id === id);
    if (!owner) {
      return new HttpResponse(null, { status: 404 });
    }
    return HttpResponse.json(owner);
  }),

  http.post(`${BASE_URL}/owners`, async ({ request }) => {
    const body = (await request.json()) as Partial<Owner>;
    if (!body.firstName || !body.lastName) {
      return new HttpResponse(null, {
        status: 400,
        headers: {
          errors: JSON.stringify([{ errorMessage: 'firstName and lastName are required' }]),
        },
      });
    }
    const created: Owner = {
      id: 3,
      firstName: body.firstName,
      lastName: body.lastName,
      address: body.address ?? '',
      city: body.city ?? '',
      telephone: body.telephone ?? '',
      pets: [],
    };
    return HttpResponse.json(created, { status: 201 });
  }),

  http.put(`${BASE_URL}/owners/:ownerId`, ({ params }) => {
    const id = Number(params.ownerId);
    const owner = owners.find((o) => o.id === id);
    if (!owner) {
      return new HttpResponse(null, { status: 404 });
    }
    return new HttpResponse(null, { status: 204 });
  }),

  http.delete(`${BASE_URL}/owners/:ownerId`, ({ params }) => {
    const id = Number(params.ownerId);
    const owner = owners.find((o) => o.id === id);
    if (!owner) {
      return new HttpResponse(null, { status: 404 });
    }
    return new HttpResponse(null, { status: 204 });
  }),

  // ── Pets ─────────────────────────────────────────────────────────
  http.get(`${BASE_URL}/pets`, () => {
    return HttpResponse.json(pets);
  }),

  http.get(`${BASE_URL}/pets/:petId`, ({ params }) => {
    const id = Number(params.petId);
    const pet = pets.find((p) => p.id === id);
    if (!pet) {
      return new HttpResponse(null, { status: 404 });
    }
    return HttpResponse.json(pet);
  }),

  http.post(`${BASE_URL}/owners/:ownerId/pets`, async ({ params, request }) => {
    const ownerId = Number(params.ownerId);
    const owner = owners.find((o) => o.id === ownerId);
    if (!owner) {
      return new HttpResponse(null, { status: 404 });
    }
    const body = (await request.json()) as Partial<Pet>;
    if (!body.name) {
      return new HttpResponse(null, {
        status: 400,
        headers: {
          errors: JSON.stringify([{ errorMessage: 'name is required' }]),
        },
      });
    }
    const created: Pet = {
      id: 3,
      ownerId,
      name: body.name,
      birthDate: body.birthDate ?? '2020-01-01',
      type: body.type ?? { id: 1, name: 'cat' },
      owner: owner,
      visits: [],
    };
    return HttpResponse.json(created, { status: 201 });
  }),

  http.put(`${BASE_URL}/pets/:petId`, ({ params }) => {
    const id = Number(params.petId);
    const pet = pets.find((p) => p.id === id);
    if (!pet) {
      return new HttpResponse(null, { status: 404 });
    }
    return new HttpResponse(null, { status: 204 });
  }),

  http.delete(`${BASE_URL}/pets/:petId`, ({ params }) => {
    const id = Number(params.petId);
    const pet = pets.find((p) => p.id === id);
    if (!pet) {
      return new HttpResponse(null, { status: 404 });
    }
    return new HttpResponse(null, { status: 204 });
  }),

  // ── Visits ───────────────────────────────────────────────────────
  http.get(`${BASE_URL}/visits`, () => {
    return HttpResponse.json(visits);
  }),

  http.get(`${BASE_URL}/visits/:visitId`, ({ params }) => {
    const id = Number(params.visitId);
    const visit = visits.find((v) => v.id === id);
    if (!visit) {
      return new HttpResponse(null, { status: 404 });
    }
    return HttpResponse.json(visit);
  }),

  http.post(
    `${BASE_URL}/owners/:ownerId/pets/:petId/visits`,
    async ({ params, request }) => {
      const ownerId = Number(params.ownerId);
      const petId = Number(params.petId);
      const owner = owners.find((o) => o.id === ownerId);
      if (!owner) {
        return new HttpResponse(null, { status: 404 });
      }
      const pet = pets.find((p) => p.id === petId);
      if (!pet) {
        return new HttpResponse(null, { status: 404 });
      }
      const body = (await request.json()) as Partial<Visit>;
      if (!body.description) {
        return new HttpResponse(null, {
          status: 400,
          headers: {
            errors: JSON.stringify([{ errorMessage: 'description is required' }]),
          },
        });
      }
      const created: Visit = {
        id: 3,
        date: body.date ?? '2024-06-01',
        description: body.description,
        pet,
        petId,
      };
      return HttpResponse.json(created, { status: 201 });
    },
  ),

  http.put(`${BASE_URL}/visits/:visitId`, ({ params }) => {
    const id = Number(params.visitId);
    const visit = visits.find((v) => v.id === id);
    if (!visit) {
      return new HttpResponse(null, { status: 404 });
    }
    return new HttpResponse(null, { status: 204 });
  }),

  http.delete(`${BASE_URL}/visits/:visitId`, ({ params }) => {
    const id = Number(params.visitId);
    const visit = visits.find((v) => v.id === id);
    if (!visit) {
      return new HttpResponse(null, { status: 404 });
    }
    return new HttpResponse(null, { status: 204 });
  }),

  // ── Pet Types ────────────────────────────────────────────────────
  http.get(`${BASE_URL}/pettypes`, () => {
    return HttpResponse.json(petTypes);
  }),
];
