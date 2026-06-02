import { describe, it, expect } from 'vitest';
import { http, HttpResponse } from 'msw';
import { server } from '../mocks/server';
import {
  getVisits,
  getVisitById,
  createVisit,
  updateVisit,
  deleteVisit,
} from '../services/visitService';
import type { Owner, Pet } from '../types';

const API_BASE = 'http://localhost:9966/petclinic/api';

describe('Visit Management', () => {
  describe('listVisits', () => {
    it('should return all visits', async () => {
      const visits = await getVisits();
      expect(visits).toBeInstanceOf(Array);
      expect(visits.length).toBeGreaterThanOrEqual(2);
      expect(visits[0]).toHaveProperty('id');
      expect(visits[0]).toHaveProperty('date');
      expect(visits[0]).toHaveProperty('description');
      expect(visits[0]).toHaveProperty('pet');
    });

    it('should include correct visit data', async () => {
      const visits = await getVisits();
      const rabies = visits.find((v) => v.description === 'rabies shot');
      expect(rabies).toBeDefined();
      expect(rabies!.id).toBe(1);
      expect(rabies!.date).toBe('2013-01-01');
      expect(rabies!.pet).toBeDefined();
      expect(rabies!.pet.name).toBe('Leo');
    });
  });

  describe('getVisitById', () => {
    it('should return a single visit with pet info', async () => {
      const visit = await getVisitById(1);
      expect(visit.id).toBe(1);
      expect(visit.description).toBe('rabies shot');
      expect(visit.date).toBe('2013-01-01');
      expect(visit.pet).toBeDefined();
    });

    it('should throw on non-existent visit', async () => {
      await expect(getVisitById(999)).rejects.toThrow('Server returned code 404');
    });
  });

  describe('createVisit', () => {
    it('should create a visit nested under owner/pet', async () => {
      const newVisit = {
        date: '2024-06-15',
        description: 'annual checkup',
      };
      const created = await createVisit(1, 1, newVisit);
      expect(created.id).toBeDefined();
      expect(created.id).toBeGreaterThan(0);
      expect(created.date).toBe('2024-06-15');
      expect(created.description).toBe('annual checkup');
      expect(created.pet).toBeDefined();
    });
  });

  describe('updateVisit', () => {
    it('should update an existing visit', async () => {
      const updated = await updateVisit(1, {
        id: 1,
        date: '2013-01-01',
        description: 'rabies shot - updated',
        pet: {
          id: 1,
          ownerId: 1,
          name: 'Leo',
          birthDate: '2010-09-07',
          type: { id: 1, name: 'cat' },
          owner: {} as Owner,
          visits: [],
        },
        petId: 1,
      });
      expect(updated.id).toBe(1);
      expect(updated.description).toBe('rabies shot - updated');
    });

    it('should throw on non-existent visit', async () => {
      await expect(
        updateVisit(999, {
          id: 999,
          date: '2020-01-01',
          description: 'ghost visit',
          pet: {} as Pet,
        }),
      ).rejects.toThrow('Server returned code 404');
    });
  });

  describe('deleteVisit', () => {
    it('should delete an existing visit without error', async () => {
      await expect(deleteVisit(2)).resolves.toBeUndefined();
    });

    it('should throw on non-existent visit', async () => {
      await expect(deleteVisit(999)).rejects.toThrow('Server returned code 404');
    });
  });
});

describe('Visit Error Handling', () => {
  it('should throw on server error for getVisits', async () => {
    server.use(
      http.get(`${API_BASE}/visits`, () => {
        return HttpResponse.json({ error: 'Internal Server Error' }, { status: 500 });
      }),
    );
    await expect(getVisits()).rejects.toThrow('Server returned code 500');
  });

  it('should throw on server error for createVisit', async () => {
    server.use(
      http.post(`${API_BASE}/owners/:ownerId/pets/:petId/visits`, () => {
        return HttpResponse.json({ error: 'Bad Request' }, { status: 400 });
      }),
    );
    await expect(
      createVisit(1, 1, { date: '', description: '' }),
    ).rejects.toThrow('Server returned code 400');
  });

  it('should throw on server error for updateVisit', async () => {
    server.use(
      http.put(`${API_BASE}/visits/:visitId`, () => {
        return HttpResponse.json({ error: 'Internal Server Error' }, { status: 500 });
      }),
    );
    await expect(
      updateVisit(1, {
        id: 1,
        date: '2013-01-01',
        description: 'rabies shot',
        pet: {} as Pet,
      }),
    ).rejects.toThrow('Server returned code 500');
  });

  it('should throw on server error for deleteVisit', async () => {
    server.use(
      http.delete(`${API_BASE}/visits/:visitId`, () => {
        return HttpResponse.json({ error: 'Internal Server Error' }, { status: 500 });
      }),
    );
    await expect(deleteVisit(1)).rejects.toThrow('Server returned code 500');
  });

  it('should throw on network error for getVisits', async () => {
    server.use(
      http.get(`${API_BASE}/visits`, () => {
        return HttpResponse.error();
      }),
    );
    await expect(getVisits()).rejects.toThrow();
  });
});
