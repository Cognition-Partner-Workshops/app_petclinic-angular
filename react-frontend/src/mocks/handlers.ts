import { http, HttpResponse } from 'msw';
import type { Owner, Pet, Visit, PetType } from '../types';

const API_BASE = 'http://localhost:9966/petclinic/api';

const petTypes: PetType[] = [
  { id: 1, name: 'cat' },
  { id: 2, name: 'dog' },
  { id: 3, name: 'lizard' },
  { id: 4, name: 'snake' },
  { id: 5, name: 'bird' },
  { id: 6, name: 'hamster' },
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
        owner: {} as Owner,
        visits: [
          {
            id: 1,
            date: '2013-01-01',
            description: 'rabies shot',
            pet: {} as Pet,
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
        ownerId: 2,
        name: 'Basil',
        birthDate: '2012-08-06',
        type: { id: 6, name: 'hamster' },
        owner: {} as Owner,
        visits: [],
      },
    ],
  },
  {
    id: 3,
    firstName: 'Eduardo',
    lastName: 'Rodriquez',
    address: '2693 Commerce St.',
    city: 'McFarland',
    telephone: '6085558763',
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
    owner: { id: 1, firstName: 'George', lastName: 'Franklin', address: '110 W. Liberty St.', city: 'Madison', telephone: '6085551023', pets: [] },
    visits: [{ id: 1, date: '2013-01-01', description: 'rabies shot', pet: {} as Pet }],
  },
  {
    id: 2,
    ownerId: 2,
    name: 'Basil',
    birthDate: '2012-08-06',
    type: { id: 6, name: 'hamster' },
    owner: { id: 2, firstName: 'Betty', lastName: 'Davis', address: '638 Cardinal Ave.', city: 'Sun Prairie', telephone: '6085551749', pets: [] },
    visits: [],
  },
];

const visits: Visit[] = [
  {
    id: 1,
    date: '2013-01-01',
    description: 'rabies shot',
    pet: { id: 1, ownerId: 1, name: 'Leo', birthDate: '2010-09-07', type: { id: 1, name: 'cat' }, owner: {} as Owner, visits: [] },
  },
  {
    id: 2,
    date: '2013-03-04',
    description: 'neutering',
    pet: { id: 1, ownerId: 1, name: 'Leo', birthDate: '2010-09-07', type: { id: 1, name: 'cat' }, owner: {} as Owner, visits: [] },
  },
];

let nextOwnerId = 4;
let nextPetId = 3;
let nextVisitId = 3;

export const handlers = [
  // --- Owners ---
  http.get(`${API_BASE}/owners`, ({ request }) => {
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

  http.get(`${API_BASE}/owners/:ownerId`, ({ params }) => {
    const id = Number(params.ownerId);
    const owner = owners.find((o) => o.id === id);
    if (!owner) {
      return HttpResponse.json({}, { status: 404 });
    }
    return HttpResponse.json(owner);
  }),

  http.post(`${API_BASE}/owners`, async ({ request }) => {
    const body = (await request.json()) as Omit<Owner, 'id' | 'pets'>;
    const newOwner: Owner = {
      ...body,
      id: nextOwnerId++,
      pets: [],
    };
    owners.push(newOwner);
    return HttpResponse.json(newOwner, { status: 201 });
  }),

  http.put(`${API_BASE}/owners/:ownerId`, async ({ params, request }) => {
    const id = Number(params.ownerId);
    const body = (await request.json()) as Owner;
    const idx = owners.findIndex((o) => o.id === id);
    if (idx === -1) {
      return HttpResponse.json({}, { status: 404 });
    }
    owners[idx] = { ...owners[idx], ...body, id };
    return HttpResponse.json(owners[idx]);
  }),

  http.delete(`${API_BASE}/owners/:ownerId`, ({ params }) => {
    const id = Number(params.ownerId);
    const idx = owners.findIndex((o) => o.id === id);
    if (idx === -1) {
      return HttpResponse.json({}, { status: 404 });
    }
    owners.splice(idx, 1);
    return new HttpResponse(null, { status: 204 });
  }),

  // --- Pets ---
  http.get(`${API_BASE}/pets`, () => {
    return HttpResponse.json(pets);
  }),

  http.get(`${API_BASE}/pets/:petId`, ({ params }) => {
    const id = Number(params.petId);
    const pet = pets.find((p) => p.id === id);
    if (!pet) {
      return HttpResponse.json({}, { status: 404 });
    }
    return HttpResponse.json(pet);
  }),

  http.post(`${API_BASE}/owners/:ownerId/pets`, async ({ params, request }) => {
    const ownerId = Number(params.ownerId);
    const body = (await request.json()) as { name: string; birthDate: string; type: PetType };
    const owner = owners.find((o) => o.id === ownerId);
    const newPet: Pet = {
      id: nextPetId++,
      ownerId,
      name: body.name,
      birthDate: body.birthDate,
      type: body.type,
      owner: owner ?? ({} as Owner),
      visits: [],
    };
    pets.push(newPet);
    return HttpResponse.json(newPet, { status: 201 });
  }),

  http.put(`${API_BASE}/pets/:petId`, async ({ params, request }) => {
    const id = Number(params.petId);
    const body = (await request.json()) as Pet;
    const idx = pets.findIndex((p) => p.id === id);
    if (idx === -1) {
      return HttpResponse.json({}, { status: 404 });
    }
    pets[idx] = { ...pets[idx], ...body, id };
    return HttpResponse.json(pets[idx]);
  }),

  http.delete(`${API_BASE}/pets/:petId`, ({ params }) => {
    const id = Number(params.petId);
    const idx = pets.findIndex((p) => p.id === id);
    if (idx === -1) {
      return HttpResponse.json({}, { status: 404 });
    }
    pets.splice(idx, 1);
    return new HttpResponse(null, { status: 204 });
  }),

  // --- Visits ---
  http.get(`${API_BASE}/visits`, () => {
    return HttpResponse.json(visits);
  }),

  http.get(`${API_BASE}/visits/:visitId`, ({ params }) => {
    const id = Number(params.visitId);
    const visit = visits.find((v) => v.id === id);
    if (!visit) {
      return HttpResponse.json({}, { status: 404 });
    }
    return HttpResponse.json(visit);
  }),

  http.post(`${API_BASE}/owners/:ownerId/pets/:petId/visits`, async ({ params, request }) => {
    const petId = Number(params.petId);
    const body = (await request.json()) as { date: string; description: string };
    const pet = pets.find((p) => p.id === petId);
    const newVisit: Visit = {
      id: nextVisitId++,
      date: body.date,
      description: body.description,
      pet: pet ?? ({} as Pet),
    };
    visits.push(newVisit);
    return HttpResponse.json(newVisit, { status: 201 });
  }),

  http.put(`${API_BASE}/visits/:visitId`, async ({ params, request }) => {
    const id = Number(params.visitId);
    const body = (await request.json()) as Visit;
    const idx = visits.findIndex((v) => v.id === id);
    if (idx === -1) {
      return HttpResponse.json({}, { status: 404 });
    }
    visits[idx] = { ...visits[idx], ...body, id };
    return HttpResponse.json(visits[idx]);
  }),

  http.delete(`${API_BASE}/visits/:visitId`, ({ params }) => {
    const id = Number(params.visitId);
    const idx = visits.findIndex((v) => v.id === id);
    if (idx === -1) {
      return HttpResponse.json({}, { status: 404 });
    }
    visits.splice(idx, 1);
    return new HttpResponse(null, { status: 204 });
  }),

  // --- Pet Types ---
  http.get(`${API_BASE}/pettypes`, () => {
    return HttpResponse.json(petTypes);
  }),

  http.get(`${API_BASE}/pettypes/:typeId`, ({ params }) => {
    const id = Number(params.typeId);
    const pt = petTypes.find((t) => t.id === id);
    if (!pt) {
      return HttpResponse.json({}, { status: 404 });
    }
    return HttpResponse.json(pt);
  }),
];
