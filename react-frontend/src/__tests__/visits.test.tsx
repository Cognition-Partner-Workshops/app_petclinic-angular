import { describe, it, expect } from 'vitest';
import * as api from '../services/api';
import { server } from './mocks/server';
import { http, HttpResponse } from 'msw';

const BASE_URL = 'http://localhost:9966/petclinic/api';

describe('Visits API', () => {
  // ── List ─────────────────────────────────────────────────────────
  describe('List visits', () => {
    it('should return all visits', async () => {
      const res = await api.getVisits();
      expect(res.status).toBe(200);
      expect(Array.isArray(res.data)).toBe(true);
      expect(res.data.length).toBeGreaterThanOrEqual(2);
      expect(res.data[0]).toHaveProperty('id');
      expect(res.data[0]).toHaveProperty('date');
      expect(res.data[0]).toHaveProperty('description');
      expect(res.data[0]).toHaveProperty('pet');
    });
  });

  // ── Get by ID ────────────────────────────────────────────────────
  describe('Get visit by ID', () => {
    it('should return visit details for valid ID', async () => {
      const res = await api.getVisit(1);
      expect(res.status).toBe(200);
      expect(res.data.id).toBe(1);
      expect(res.data.date).toBe('2024-01-15');
      expect(res.data.description).toBe('Annual checkup');
      expect(res.data.pet).toBeDefined();
      expect(res.data.petId).toBe(1);
    });

    it('should return 404 for non-existent visit', async () => {
      try {
        await api.getVisit(999);
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

  // ── Create (under owner's pet) ───────────────────────────────────
  describe('Create visit under owner\'s pet', () => {
    it('should create visit with valid data', async () => {
      const newVisit = {
        date: '2024-06-15',
        description: 'Dental cleaning',
      };
      const res = await api.createVisit(1, 1, newVisit);
      expect(res.status).toBe(201);
      expect(res.data).toHaveProperty('id');
      expect(res.data.description).toBe('Dental cleaning');
      expect(res.data.pet).toBeDefined();
    });

    it('should return 404 when owner does not exist', async () => {
      try {
        await api.createVisit(999, 1, {
          date: '2024-06-15',
          description: 'Test visit',
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

    it('should return 404 when pet does not exist', async () => {
      try {
        await api.createVisit(1, 999, {
          date: '2024-06-15',
          description: 'Test visit',
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

    it('should return 400 for validation error (missing description)', async () => {
      try {
        await api.createVisit(1, 1, {
          date: '2024-06-15',
          description: '',
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
  describe('Update visit', () => {
    it('should update visit successfully', async () => {
      const res = await api.updateVisit(1, { description: 'Updated checkup' });
      expect(res.status).toBe(204);
    });

    it('should return 404 for non-existent visit', async () => {
      try {
        await api.updateVisit(999, { description: 'No visit' });
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
  describe('Delete visit', () => {
    it('should delete visit successfully with 204 No Content', async () => {
      const res = await api.deleteVisit(1);
      expect(res.status).toBe(204);
      expect(res.data).toBeFalsy();
    });

    it('should return 404 for non-existent visit', async () => {
      try {
        await api.deleteVisit(999);
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
        http.get(`${BASE_URL}/visits`, () => {
          return new HttpResponse(null, { status: 500 });
        }),
      );
      try {
        await api.getVisits();
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
