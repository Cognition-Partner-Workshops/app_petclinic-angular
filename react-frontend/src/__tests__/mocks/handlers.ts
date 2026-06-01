import { http, HttpResponse } from 'msw';
import type { Owner, Pet, PetType, Visit, Vet, Specialty } from '../../types';

const API = 'http://localhost:9966/petclinic/api';

const specialties: Specialty[] = [
  { id: 1, name: 'radiology' },
  { id: 2, name: 'surgery' },
  { id: 3, name: 'dentistry' },
];

const petTypes: PetType[] = [
  { id: 1, name: 'cat' },
  { id: 2, name: 'dog' },
  { id: 3, name: 'lizard' },
];

const visits: Visit[] = [
  { id: 1, date: '2023-01-01', description: 'rabies shot', pet: {} as Pet, petId: 1 },
  { id: 2, date: '2023-06-15', description: 'checkup', pet: {} as Pet, petId: 1 },
];

const pets: Pet[] = [
  {
    id: 1,
    ownerId: 1,
    name: 'Leo',
    birthDate: '2020-09-07',
    type: petTypes[0],
    owner: {} as Owner,
    visits,
  },
  {
    id: 2,
    ownerId: 1,
    name: 'Samantha',
    birthDate: '2021-03-12',
    type: petTypes[1],
    owner: {} as Owner,
    visits: [],
  },
];

const owners: Owner[] = [
  {
    id: 1,
    firstName: 'George',
    lastName: 'Franklin',
    address: '110 W. Liberty St.',
    city: 'Madison',
    telephone: '6085551023',
    pets,
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

const vets: Vet[] = [
  { id: 1, firstName: 'James', lastName: 'Carter', specialties: [] },
  { id: 2, firstName: 'Helen', lastName: 'Leary', specialties: [specialties[0]] },
  { id: 3, firstName: 'Linda', lastName: 'Douglas', specialties: [specialties[1], specialties[2]] },
];

export const handlers = [
  // Owners
  http.get(`${API}/owners`, ({ request }) => {
    const url = new URL(request.url);
    const lastName = url.searchParams.get('lastName');
    if (lastName) {
      const filtered = owners.filter((o) =>
        o.lastName.toLowerCase().startsWith(lastName.toLowerCase())
      );
      return HttpResponse.json(filtered);
    }
    return HttpResponse.json(owners);
  }),

  http.get(`${API}/owners/:id`, ({ params }) => {
    const owner = owners.find((o) => o.id === Number(params.id));
    if (!owner) return new HttpResponse(null, { status: 404 });
    return HttpResponse.json(owner);
  }),

  http.post(`${API}/owners`, async ({ request }) => {
    const body = (await request.json()) as Partial<Owner>;
    const newOwner: Owner = {
      id: owners.length + 1,
      firstName: body.firstName || '',
      lastName: body.lastName || '',
      address: body.address || '',
      city: body.city || '',
      telephone: body.telephone || '',
      pets: [],
    };
    owners.push(newOwner);
    return HttpResponse.json(newOwner, { status: 201 });
  }),

  http.put(`${API}/owners/:id`, async ({ params, request }) => {
    const body = (await request.json()) as Partial<Owner>;
    const idx = owners.findIndex((o) => o.id === Number(params.id));
    if (idx === -1) return new HttpResponse(null, { status: 404 });
    owners[idx] = { ...owners[idx], ...body };
    return HttpResponse.json(owners[idx]);
  }),

  http.delete(`${API}/owners/:id`, ({ params }) => {
    const idx = owners.findIndex((o) => o.id === Number(params.id));
    if (idx === -1) return new HttpResponse(null, { status: 404 });
    owners.splice(idx, 1);
    return new HttpResponse(null, { status: 204 });
  }),

  // Pets
  http.get(`${API}/pets`, () => HttpResponse.json(pets)),

  http.get(`${API}/pets/:id`, ({ params }) => {
    const pet = pets.find((p) => p.id === Number(params.id));
    if (!pet) return new HttpResponse(null, { status: 404 });
    return HttpResponse.json(pet);
  }),

  http.post(`${API}/owners/:ownerId/pets`, async ({ request }) => {
    const body = (await request.json()) as Partial<Pet>;
    const newPet: Pet = {
      id: pets.length + 1,
      ownerId: body.owner?.id || 0,
      name: body.name || '',
      birthDate: body.birthDate || '',
      type: body.type || petTypes[0],
      owner: body.owner || ({} as Owner),
      visits: [],
    };
    pets.push(newPet);
    return HttpResponse.json(newPet, { status: 201 });
  }),

  http.put(`${API}/pets/:id`, async ({ params, request }) => {
    const body = (await request.json()) as Partial<Pet>;
    const idx = pets.findIndex((p) => p.id === Number(params.id));
    if (idx === -1) return new HttpResponse(null, { status: 404 });
    pets[idx] = { ...pets[idx], ...body };
    return HttpResponse.json(pets[idx]);
  }),

  http.delete(`${API}/pets/:id`, () => new HttpResponse(null, { status: 204 })),

  // Pet Types
  http.get(`${API}/pettypes`, () => HttpResponse.json(petTypes)),

  // Visits
  http.get(`${API}/visits`, () => HttpResponse.json(visits)),

  http.get(`${API}/visits/:id`, ({ params }) => {
    const visit = visits.find((v) => v.id === Number(params.id));
    if (!visit) return new HttpResponse(null, { status: 404 });
    return HttpResponse.json(visit);
  }),

  http.post(`${API}/owners/:ownerId/pets/:petId/visits`, async ({ request }) => {
    const body = (await request.json()) as Partial<Visit>;
    const newVisit: Visit = {
      id: visits.length + 1,
      date: body.date || '',
      description: body.description || '',
      pet: body.pet || ({} as Pet),
    };
    visits.push(newVisit);
    return HttpResponse.json(newVisit, { status: 201 });
  }),

  http.put(`${API}/visits/:id`, async ({ params, request }) => {
    const body = (await request.json()) as Partial<Visit>;
    const idx = visits.findIndex((v) => v.id === Number(params.id));
    if (idx === -1) return new HttpResponse(null, { status: 404 });
    visits[idx] = { ...visits[idx], ...body };
    return HttpResponse.json(visits[idx]);
  }),

  http.delete(`${API}/visits/:id`, () => new HttpResponse(null, { status: 204 })),

  // Vets
  http.get(`${API}/vets`, () => HttpResponse.json(vets)),

  http.get(`${API}/vets/:id`, ({ params }) => {
    const vet = vets.find((v) => v.id === Number(params.id));
    if (!vet) return new HttpResponse(null, { status: 404 });
    return HttpResponse.json(vet);
  }),

  http.post(`${API}/vets`, async ({ request }) => {
    const body = (await request.json()) as Partial<Vet>;
    const newVet: Vet = {
      id: vets.length + 1,
      firstName: body.firstName || '',
      lastName: body.lastName || '',
      specialties: body.specialties || [],
    };
    vets.push(newVet);
    return HttpResponse.json(newVet, { status: 201 });
  }),

  http.put(`${API}/vets/:id`, async ({ params, request }) => {
    const body = (await request.json()) as Partial<Vet>;
    const idx = vets.findIndex((v) => v.id === Number(params.id));
    if (idx === -1) return new HttpResponse(null, { status: 404 });
    vets[idx] = { ...vets[idx], ...body };
    return HttpResponse.json(vets[idx]);
  }),

  http.delete(`${API}/vets/:id`, () => new HttpResponse(null, { status: 204 })),

  // Specialties
  http.get(`${API}/specialties`, () => HttpResponse.json(specialties)),
];
