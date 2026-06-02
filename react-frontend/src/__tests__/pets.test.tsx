import { describe, it, expect } from 'vitest';
import * as api from '../services/api';
import { server } from './mocks/server';
import { http, HttpResponse } from 'msw';

const BASE_URL = 'http://localhost:9966/petclinic/api';

describe('Pets API', () => {
  // ── List ─────────────────────────────────────────────────────────
  describe('List pets', () => {
    it('should return all pets', async () => {
      const res = await api.getPets();
      expect(res.status).toBe(200);
      expect(Array.isArray(res.data)).toBe(true);
      expect(res.data.length).toBeGreaterThanOrEqual(2);
      expect(res.data[0]).toHaveProperty('id');
      expect(res.data[0]).toHaveProperty('name');
      expect(res.data[0]).toHaveProperty('birthDate');
      expect(res.data[0]).toHaveProperty('type');
      expect(res.data[0]).toHaveProperty('owner');
    });
  });

  // ── Get by ID ────────────────────────────────────────────────────
  describe('Get pet by ID', () => {
    it('should return pet details for valid ID', async () => {
      const res = await api.getPet(1);
      expect(res.status).toBe(200);
      expect(res.data.id).toBe(1);
      expect(res.data.name).toBe('Leo');
      expect(res.data.birthDate).toBe('2010-09-07');
      expect(res.data.type.name).toBe('cat');
      expect(res.data.ownerId).toBe(1);
    });

    it('should return 404 for non-existent pet', async () => {
      try {
        await api.getPet(999);
        expect.fail('Expected request to throw');
      } catch (error: unknown) {
        if (isAxiosError(error)) {
          expect(error.response?.status).toBe(404);
        } else {
          expect.fail('Expected an AxiosError with response');
        }
      }
    });
  });

  // ── Create (under owner) ─────────────────────────────────────────
  describe('Create pet under owner', () => {
    it('should create pet with valid data', async () => {
      const newPet = {
        name: 'Buddy',
        birthDate: '2021-05-10',
        type: { id: 2, name: 'dog' },
      };
      const res = await api.createPet(1, newPet);
      expect(res.status).toBe(201);
      expect(res.data).toHaveProperty('id');
      expect(res.data.name).toBe('Buddy');
      expect(res.data.ownerId).toBe(1);
    });

    it('should return 404 when owner does not exist', async () => {
      try {
        await api.createPet(999, {
          name: 'Ghost',
          birthDate: '2020-01-01',
          type: { id: 1, name: 'cat' },
        });
        expect.fail('Expected request to throw');
      } catch (error: unknown) {
        if (isAxiosError(error)) {
          expect(error.response?.status).toBe(404);
        } else {
          expect.fail('Expected an AxiosError with response');
        }
      }
    });

    it('should return 400 for validation error (missing name)', async () => {
      try {
        await api.createPet(1, {
          name: '',
          birthDate: '2020-01-01',
          type: { id: 1, name: 'cat' },
        });
        expect.fail('Expected request to throw');
      } catch (error: unknown) {
        if (isAxiosError(error)) {
          expect(error.response?.status).toBe(400);
        } else {
          expect.fail('Expected an AxiosError with response');
        }
      }
    });
  });

  // ── Update ───────────────────────────────────────────────────────
  describe('Update pet', () => {
    it('should update pet successfully', async () => {
      const res = await api.updatePet(1, { name: 'Leo Jr.' });
      expect(res.status).toBe(204);
    });

    it('should return 404 for non-existent pet', async () => {
      try {
        await api.updatePet(999, { name: 'Ghost' });
        expect.fail('Expected request to throw');
      } catch (error: unknown) {
        if (isAxiosError(error)) {
          expect(error.response?.status).toBe(404);
        } else {
          expect.fail('Expected an AxiosError with response');
        }
      }
    });
  });

  // ── Delete ───────────────────────────────────────────────────────
  describe('Delete pet', () => {
    it('should delete pet successfully with 204 No Content', async () => {
      const res = await api.deletePet(1);
      expect(res.status).toBe(204);
      expect(res.data).toBeFalsy();
    });

    it('should return 404 for non-existent pet', async () => {
      try {
        await api.deletePet(999);
        expect.fail('Expected request to throw');
      } catch (error: unknown) {
        if (isAxiosError(error)) {
          expect(error.response?.status).toBe(404);
        } else {
          expect.fail('Expected an AxiosError with response');
        }
      }
    });
  });

  // ── Server error ─────────────────────────────────────────────────
  describe('Server error handling', () => {
    it('should handle 500 server error on list', async () => {
      server.use(
        http.get(`${BASE_URL}/pets`, () => {
          return new HttpResponse(null, { status: 500 });
        }),
      );
      try {
        await api.getPets();
        expect.fail('Expected request to throw');
      } catch (error: unknown) {
        if (isAxiosError(error)) {
          expect(error.response?.status).toBe(500);
        } else {
          expect.fail('Expected an AxiosError with response');
        }
      }
    });
  });
});

function isAxiosError(
  error: unknown,
): error is { response?: { status: number; headers?: Record<string, string> } } {
  return typeof error === 'object' && error !== null && 'response' in error;
}
