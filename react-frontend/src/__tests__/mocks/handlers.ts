import { http, HttpResponse } from 'msw';
import type { Owner, Pet, Visit, PetType } from '../../types';

const BASE_URL = 'http://localhost:9966/petclinic/api';

const petTypes: PetType[] = [
  { id: 1, name: 'cat' },
  { id: 2, name: 'dog' },
  { id: 3, name: 'lizard' },
  { id: 4, name: 'snake' },
  { id: 5, name: 'bird' },
  { id: 6, name: 'hamster' },
];

const mockOwner: Owner = {
  id: 1,
  firstName: 'George',
  lastName: 'Franklin',
  address: '110 W. Liberty St.',
  city: 'Madison',
  telephone: '6085551023',
  pets: [],
};

const mockOwner2: Owner = {
  id: 2,
  firstName: 'Betty',
  lastName: 'Davis',
  address: '638 Cardinal Ave.',
  city: 'Sun Prairie',
  telephone: '6085551749',
  pets: [],
};

const mockPet: Pet = {
  id: 1,
  ownerId: 1,
  name: 'Leo',
  birthDate: '2010-09-07',
  type: { id: 1, name: 'cat' },
  owner: mockOwner,
  visits: [],
};

const mockVisit: Visit = {
  id: 1,
  date: '2024-01-15',
  description: 'annual checkup',
  pet: mockPet,
  petId: 1,
};

const mockOwnerWithPets: Owner = {
  ...mockOwner,
  pets: [
    {
      ...mockPet,
      visits: [mockVisit],
    },
  ],
};

export const handlers = [
  // Owners
  http.get(`${BASE_URL}/owners`, ({ request }) => {
    const url = new URL(request.url);
    const lastName = url.searchParams.get('lastName');
    if (lastName === 'Nonexistent') {
      return HttpResponse.json([]);
    }
    if (lastName) {
      const filtered = [mockOwner, mockOwner2].filter((o) =>
        o.lastName.toLowerCase().includes(lastName.toLowerCase())
      );
      return HttpResponse.json(filtered);
    }
    return HttpResponse.json([mockOwner, mockOwner2]);
  }),

  http.get(`${BASE_URL}/owners/:ownerId`, ({ params }) => {
    const id = Number(params.ownerId);
    if (id === 1) {
      return HttpResponse.json(mockOwnerWithPets);
    }
    return new HttpResponse(null, { status: 404 });
  }),

  http.post(`${BASE_URL}/owners`, async ({ request }) => {
    const body = (await request.json()) as Record<string, unknown>;
    if (!body.firstName || !body.lastName) {
      return HttpResponse.json(
        { errors: [{ errorMessage: 'First name must not be empty' }] },
        {
          status: 400,
          headers: {
            errors: JSON.stringify([
              { errorMessage: 'First name must not be empty' },
            ]),
          },
        }
      );
    }
    return HttpResponse.json(
      { id: 3, ...body, pets: [] },
      { status: 201 }
    );
  }),

  http.put(`${BASE_URL}/owners/:ownerId`, () => {
    return new HttpResponse(null, { status: 204 });
  }),

  http.delete(`${BASE_URL}/owners/:ownerId`, () => {
    return new HttpResponse(null, { status: 204 });
  }),

  // Pets
  http.get(`${BASE_URL}/pets`, () => {
    return HttpResponse.json([mockPet]);
  }),

  http.get(`${BASE_URL}/pets/:petId`, ({ params }) => {
    const id = Number(params.petId);
    if (id === 1) {
      return HttpResponse.json(mockPet);
    }
    return new HttpResponse(null, { status: 404 });
  }),

  http.post(`${BASE_URL}/owners/:ownerId/pets`, async ({ request }) => {
    const body = (await request.json()) as Record<string, unknown>;
    return HttpResponse.json(
      { id: 2, ownerId: 1, ...body, owner: mockOwner, visits: [] },
      { status: 201 }
    );
  }),

  http.put(`${BASE_URL}/pets/:petId`, () => {
    return new HttpResponse(null, { status: 204 });
  }),

  http.delete(`${BASE_URL}/pets/:petId`, () => {
    return new HttpResponse(null, { status: 204 });
  }),

  // Pet Types
  http.get(`${BASE_URL}/pettypes`, () => {
    return HttpResponse.json(petTypes);
  }),

  // Visits
  http.get(`${BASE_URL}/visits`, () => {
    return HttpResponse.json([mockVisit]);
  }),

  http.get(`${BASE_URL}/visits/:visitId`, ({ params }) => {
    const id = Number(params.visitId);
    if (id === 1) {
      return HttpResponse.json(mockVisit);
    }
    return new HttpResponse(null, { status: 404 });
  }),

  http.post(
    `${BASE_URL}/owners/:ownerId/pets/:petId/visits`,
    async ({ request }) => {
      const body = (await request.json()) as Record<string, unknown>;
      return HttpResponse.json(
        { id: 2, ...body, pet: mockPet, petId: 1 },
        { status: 201 }
      );
    }
  ),

  http.put(`${BASE_URL}/visits/:visitId`, () => {
    return new HttpResponse(null, { status: 204 });
  }),

  http.delete(`${BASE_URL}/visits/:visitId`, () => {
    return new HttpResponse(null, { status: 204 });
  }),
];
