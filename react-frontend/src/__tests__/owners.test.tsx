import { describe, it, expect } from 'vitest';
import * as api from '../services/api';
import { server } from './mocks/server';
import { http, HttpResponse } from 'msw';

const BASE_URL = 'http://localhost:9966/petclinic/api';

describe('Owners API', () => {
  // ── List ─────────────────────────────────────────────────────────
  describe('List owners', () => {
    it('should return all owners', async () => {
      const res = await api.getOwners();
      expect(res.status).toBe(200);
      expect(Array.isArray(res.data)).toBe(true);
      expect(res.data.length).toBeGreaterThanOrEqual(2);
      expect(res.data[0]).toHaveProperty('id');
      expect(res.data[0]).toHaveProperty('firstName');
      expect(res.data[0]).toHaveProperty('lastName');
      expect(res.data[0]).toHaveProperty('pets');
    });

    it('should filter owners by lastName', async () => {
      const res = await api.getOwners('Franklin');
      expect(res.status).toBe(200);
      expect(res.data.length).toBe(1);
      expect(res.data[0].lastName).toBe('Franklin');
    });

    it('should return empty array when no owners match lastName', async () => {
      const res = await api.getOwners('NonExistentName');
      expect(res.status).toBe(200);
      expect(res.data).toEqual([]);
    });
  });

  // ── Get by ID ────────────────────────────────────────────────────
  describe('Get owner by ID', () => {
    it('should return owner details for valid ID', async () => {
      const res = await api.getOwner(1);
      expect(res.status).toBe(200);
      expect(res.data.id).toBe(1);
      expect(res.data.firstName).toBe('George');
      expect(res.data.lastName).toBe('Franklin');
      expect(res.data.address).toBe('110 W. Liberty St.');
      expect(res.data.city).toBe('Madison');
      expect(res.data.telephone).toBe('6085551023');
    });

    it('should return 404 for non-existent owner', async () => {
      try {
        await api.getOwner(999);
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

  // ── Create ───────────────────────────────────────────────────────
  describe('Create owner', () => {
    it('should create owner with valid data', async () => {
      const newOwner = {
        firstName: 'Harold',
        lastName: 'Davis',
        address: '563 Friendly St.',
        city: 'Windsor',
        telephone: '6085553198',
      };
      const res = await api.createOwner(newOwner);
      expect(res.status).toBe(201);
      expect(res.data).toHaveProperty('id');
      expect(res.data.firstName).toBe('Harold');
      expect(res.data.lastName).toBe('Davis');
      expect(res.data.pets).toEqual([]);
    });

    it('should return 400 for missing required fields', async () => {
      try {
        await api.createOwner({
          firstName: '',
          lastName: '',
          address: '',
          city: '',
          telephone: '',
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
  describe('Update owner', () => {
    it('should update owner successfully', async () => {
      const updated = {
        firstName: 'George',
        lastName: 'Franklin',
        address: '120 W. Liberty St.',
        city: 'Madison',
        telephone: '6085551023',
      };
      const res = await api.updateOwner(1, updated);
      expect(res.status).toBe(204);
    });

    it('should return 404 for non-existent owner', async () => {
      try {
        await api.updateOwner(999, {
          firstName: 'Test',
          lastName: 'User',
          address: '123 Test St.',
          city: 'Test',
          telephone: '1234567890',
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
  });

  // ── Delete ───────────────────────────────────────────────────────
  describe('Delete owner', () => {
    it('should delete owner successfully with 204 No Content', async () => {
      const res = await api.deleteOwner(1);
      expect(res.status).toBe(204);
      expect(res.data).toBeFalsy();
    });

    it('should return 404 for non-existent owner', async () => {
      try {
        await api.deleteOwner(999);
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
        http.get(`${BASE_URL}/owners`, () => {
          return new HttpResponse(null, { status: 500 });
        }),
      );
      try {
        await api.getOwners();
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

// Helper to narrow axios errors
function isAxiosError(
  error: unknown,
): error is { response?: { status: number; headers?: Record<string, string> } } {
  return typeof error === 'object' && error !== null && 'response' in error;
}
