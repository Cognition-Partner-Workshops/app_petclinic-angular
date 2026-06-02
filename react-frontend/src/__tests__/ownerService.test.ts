import { describe, it, expect } from 'vitest';
import { http, HttpResponse } from 'msw';
import { server } from '../mocks/server';
import {
  getOwners,
  getOwnerById,
  createOwner,
  updateOwner,
  deleteOwner,
} from '../services/ownerService';

const API_BASE = 'http://localhost:9966/petclinic/api';

describe('Owner CRUD', () => {
  describe('listOwners', () => {
    it('should return all owners', async () => {
      const owners = await getOwners();
      expect(owners).toBeInstanceOf(Array);
      expect(owners.length).toBeGreaterThanOrEqual(3);
      expect(owners[0]).toHaveProperty('id');
      expect(owners[0]).toHaveProperty('firstName');
      expect(owners[0]).toHaveProperty('lastName');
      expect(owners[0]).toHaveProperty('address');
      expect(owners[0]).toHaveProperty('city');
      expect(owners[0]).toHaveProperty('telephone');
      expect(owners[0]).toHaveProperty('pets');
    });

    it('should return owner data with correct types', async () => {
      const owners = await getOwners();
      const george = owners.find((o) => o.firstName === 'George');
      expect(george).toBeDefined();
      expect(george!.id).toBe(1);
      expect(george!.lastName).toBe('Franklin');
      expect(george!.address).toBe('110 W. Liberty St.');
      expect(george!.city).toBe('Madison');
      expect(george!.telephone).toBe('6085551023');
    });
  });

  describe('searchOwnersByLastName', () => {
    it('should filter owners by lastName', async () => {
      const owners = await getOwners('Franklin');
      expect(owners.length).toBe(1);
      expect(owners[0].lastName).toBe('Franklin');
    });

    it('should return empty array when no match', async () => {
      const owners = await getOwners('NonExistent');
      expect(owners).toEqual([]);
    });

    it('should be case insensitive', async () => {
      const owners = await getOwners('franklin');
      expect(owners.length).toBe(1);
      expect(owners[0].lastName).toBe('Franklin');
    });
  });

  describe('getOwnerById', () => {
    it('should return a single owner with nested pets and visits', async () => {
      const owner = await getOwnerById(1);
      expect(owner.id).toBe(1);
      expect(owner.firstName).toBe('George');
      expect(owner.lastName).toBe('Franklin');
      expect(owner.pets).toBeInstanceOf(Array);
      expect(owner.pets.length).toBeGreaterThanOrEqual(1);
      expect(owner.pets[0].name).toBe('Leo');
      expect(owner.pets[0].visits).toBeInstanceOf(Array);
      expect(owner.pets[0].visits.length).toBeGreaterThanOrEqual(1);
    });

    it('should throw on non-existent owner', async () => {
      await expect(getOwnerById(999)).rejects.toThrow('Server returned code 404');
    });
  });

  describe('createOwner', () => {
    it('should create a new owner and return it with an id', async () => {
      const newOwner = {
        firstName: 'John',
        lastName: 'Doe',
        address: '123 Main St.',
        city: 'Springfield',
        telephone: '5551234567',
      };
      const created = await createOwner(newOwner);
      expect(created.id).toBeDefined();
      expect(created.id).toBeGreaterThan(0);
      expect(created.firstName).toBe('John');
      expect(created.lastName).toBe('Doe');
      expect(created.address).toBe('123 Main St.');
      expect(created.city).toBe('Springfield');
      expect(created.telephone).toBe('5551234567');
      expect(created.pets).toEqual([]);
    });
  });

  describe('updateOwner', () => {
    it('should update an existing owner', async () => {
      const updated = await updateOwner(1, {
        id: 1,
        firstName: 'George',
        lastName: 'Franklin-Updated',
        address: '110 W. Liberty St.',
        city: 'Madison',
        telephone: '6085551023',
        pets: [],
      });
      expect(updated.id).toBe(1);
      expect(updated.lastName).toBe('Franklin-Updated');
    });

    it('should handle 204 No Content response by returning input owner', async () => {
      server.use(
        http.put(`${API_BASE}/owners/:ownerId`, () => {
          return new HttpResponse(null, { status: 204 });
        }),
      );
      const input = {
        id: 1,
        firstName: 'George',
        lastName: 'Franklin-204',
        address: '110 W. Liberty St.',
        city: 'Madison',
        telephone: '6085551023',
        pets: [],
      };
      const result = await updateOwner(1, input);
      expect(result).toEqual(input);
    });

    it('should throw on non-existent owner', async () => {
      await expect(
        updateOwner(999, {
          id: 999,
          firstName: 'No',
          lastName: 'One',
          address: '',
          city: '',
          telephone: '',
          pets: [],
        }),
      ).rejects.toThrow('Server returned code 404');
    });
  });

  describe('deleteOwner', () => {
    it('should delete an existing owner without error', async () => {
      await expect(deleteOwner(2)).resolves.toBeUndefined();
    });

    it('should throw on non-existent owner', async () => {
      await expect(deleteOwner(999)).rejects.toThrow('Server returned code 404');
    });
  });
});

describe('Owner Error Handling', () => {
  it('should throw on server error for getOwners', async () => {
    server.use(
      http.get(`${API_BASE}/owners`, () => {
        return HttpResponse.json({ error: 'Internal Server Error' }, { status: 500 });
      }),
    );
    await expect(getOwners()).rejects.toThrow('Server returned code 500');
  });

  it('should throw on server error for getOwnerById', async () => {
    server.use(
      http.get(`${API_BASE}/owners/:ownerId`, () => {
        return HttpResponse.json({ error: 'Internal Server Error' }, { status: 500 });
      }),
    );
    await expect(getOwnerById(1)).rejects.toThrow('Server returned code 500');
  });

  it('should throw on server error for createOwner', async () => {
    server.use(
      http.post(`${API_BASE}/owners`, () => {
        return HttpResponse.json({ error: 'Bad Request' }, { status: 400 });
      }),
    );
    await expect(
      createOwner({
        firstName: '',
        lastName: '',
        address: '',
        city: '',
        telephone: '',
      }),
    ).rejects.toThrow('Server returned code 400');
  });

  it('should throw on network error for getOwners', async () => {
    server.use(
      http.get(`${API_BASE}/owners`, () => {
        return HttpResponse.error();
      }),
    );
    await expect(getOwners()).rejects.toThrow();
  });
});
