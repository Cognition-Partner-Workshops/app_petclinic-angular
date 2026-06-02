import { http, HttpResponse } from 'msw';
import { owners, pets, visits, vets } from './data';

const BASE = 'http://localhost:9966/petclinic/api';

export const handlers = [
  // ---- Owners ----
  http.get(`${BASE}/owners`, ({ request }) => {
    const url = new URL(request.url);
    const lastName = url.searchParams.get('lastName');
    if (lastName) {
      const filtered = owners.filter((o) =>
        o.lastName.toLowerCase().startsWith(lastName.toLowerCase()),
      );
      return HttpResponse.json(filtered);
    }
    return HttpResponse.json(owners);
  }),

  http.get(`${BASE}/owners/:ownerId`, ({ params }) => {
    const id = Number(params.ownerId);
    const owner = owners.find((o) => o.id === id);
    if (!owner) {
      return new HttpResponse(null, { status: 404 });
    }
    return HttpResponse.json(owner);
  }),

  http.post(`${BASE}/owners`, async ({ request }) => {
    const body = (await request.json()) as Record<string, unknown>;
    if (!body.lastName) {
      return HttpResponse.json({}, {
        status: 400,
        headers: {
          errors: JSON.stringify([{ errorMessage: 'lastName must not be empty' }]),
        },
      });
    }
    const created = { id: 99, ...body, pets: [] };
    return HttpResponse.json(created, { status: 201 });
  }),

  http.put(`${BASE}/owners/:ownerId`, async ({ params, request }) => {
    const id = Number(params.ownerId);
    const owner = owners.find((o) => o.id === id);
    if (!owner) {
      return new HttpResponse(null, { status: 404 });
    }
    const body = (await request.json()) as Record<string, unknown>;
    const updated = { ...owner, ...body };
    return HttpResponse.json(updated);
  }),

  http.delete(`${BASE}/owners/:ownerId`, ({ params }) => {
    const id = Number(params.ownerId);
    const owner = owners.find((o) => o.id === id);
    if (!owner) {
      return new HttpResponse(null, { status: 404 });
    }
    return new HttpResponse(null, { status: 204 });
  }),

  // ---- Pets ----
  http.get(`${BASE}/pets`, () => {
    return HttpResponse.json(pets);
  }),

  http.get(`${BASE}/pets/:petId`, ({ params }) => {
    const id = Number(params.petId);
    const pet = pets.find((p) => p.id === id);
    if (!pet) {
      return new HttpResponse(null, { status: 404 });
    }
    return HttpResponse.json(pet);
  }),

  http.post(`${BASE}/owners/:ownerId/pets`, async ({ params, request }) => {
    const ownerId = Number(params.ownerId);
    const owner = owners.find((o) => o.id === ownerId);
    if (!owner) {
      return new HttpResponse(null, { status: 404 });
    }
    const body = (await request.json()) as Record<string, unknown>;
    const created = { id: 99, ownerId, ...body, visits: [] };
    return HttpResponse.json(created, { status: 201 });
  }),

  http.put(`${BASE}/pets/:petId`, async ({ params, request }) => {
    const id = Number(params.petId);
    const pet = pets.find((p) => p.id === id);
    if (!pet) {
      return new HttpResponse(null, { status: 404 });
    }
    const body = (await request.json()) as Record<string, unknown>;
    const updated = { ...pet, ...body };
    return HttpResponse.json(updated);
  }),

  http.delete(`${BASE}/pets/:petId`, ({ params }) => {
    const id = Number(params.petId);
    const pet = pets.find((p) => p.id === id);
    if (!pet) {
      return new HttpResponse(null, { status: 404 });
    }
    return HttpResponse.json(id);
  }),

  // ---- Visits ----
  http.get(`${BASE}/visits`, () => {
    return HttpResponse.json(visits);
  }),

  http.get(`${BASE}/visits/:visitId`, ({ params }) => {
    const id = Number(params.visitId);
    const visit = visits.find((v) => v.id === id);
    if (!visit) {
      return new HttpResponse(null, { status: 404 });
    }
    return HttpResponse.json(visit);
  }),

  http.post(
    `${BASE}/owners/:ownerId/pets/:petId/visits`,
    async ({ params, request }) => {
      const petId = Number(params.petId);
      const pet = pets.find((p) => p.id === petId);
      if (!pet) {
        return new HttpResponse(null, { status: 404 });
      }
      const body = (await request.json()) as Record<string, unknown>;
      const created = { id: 99, petId, pet, ...body };
      return HttpResponse.json(created, { status: 201 });
    },
  ),

  http.put(`${BASE}/visits/:visitId`, async ({ params, request }) => {
    const id = Number(params.visitId);
    const visit = visits.find((v) => v.id === id);
    if (!visit) {
      return new HttpResponse(null, { status: 404 });
    }
    const body = (await request.json()) as Record<string, unknown>;
    const updated = { ...visit, ...body };
    return HttpResponse.json(updated);
  }),

  http.delete(`${BASE}/visits/:visitId`, ({ params }) => {
    const id = Number(params.visitId);
    const visit = visits.find((v) => v.id === id);
    if (!visit) {
      return new HttpResponse(null, { status: 404 });
    }
    return HttpResponse.json(id);
  }),

  // ---- Vets ----
  http.get(`${BASE}/vets`, () => {
    return HttpResponse.json(vets);
  }),

  http.get(`${BASE}/vets/:vetId`, ({ params }) => {
    const id = Number(params.vetId);
    const vet = vets.find((v) => v.id === id);
    if (!vet) {
      return new HttpResponse(null, { status: 404 });
    }
    return HttpResponse.json(vet);
  }),

  http.post(`${BASE}/vets`, async ({ request }) => {
    const body = (await request.json()) as Record<string, unknown>;
    const created = { id: 99, ...body, specialties: [] };
    return HttpResponse.json(created, { status: 201 });
  }),

  http.put(`${BASE}/vets/:vetId`, async ({ params, request }) => {
    const id = Number(params.vetId);
    const vet = vets.find((v) => v.id === id);
    if (!vet) {
      return new HttpResponse(null, { status: 404 });
    }
    const body = (await request.json()) as Record<string, unknown>;
    const updated = { ...vet, ...body };
    return HttpResponse.json(updated);
  }),

  http.delete(`${BASE}/vets/:vetId`, ({ params }) => {
    const id = Number(params.vetId);
    const vet = vets.find((v) => v.id === id);
    if (!vet) {
      return new HttpResponse(null, { status: 404 });
    }
    return HttpResponse.json(id);
  }),
];
