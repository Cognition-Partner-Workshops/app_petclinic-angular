import { describe, it, expect } from 'vitest';
import { http, HttpResponse } from 'msw';
import { server } from '../mocks/server';
import {
  getPets,
  getPetById,
  createPet,
  updatePet,
  deletePet,
  getPetTypes,
  getPetTypeById,
} from '../services/petService';
import type { Owner } from '../types';

const API_BASE = 'http://localhost:9966/petclinic/api';

describe('Pet Management', () => {
  describe('listPets', () => {
    it('should return all pets', async () => {
      const pets = await getPets();
      expect(pets).toBeInstanceOf(Array);
      expect(pets.length).toBeGreaterThanOrEqual(2);
      expect(pets[0]).toHaveProperty('id');
      expect(pets[0]).toHaveProperty('name');
      expect(pets[0]).toHaveProperty('birthDate');
      expect(pets[0]).toHaveProperty('type');
      expect(pets[0]).toHaveProperty('owner');
    });

    it('should include correct pet data', async () => {
      const pets = await getPets();
      const leo = pets.find((p) => p.name === 'Leo');
      expect(leo).toBeDefined();
      expect(leo!.id).toBe(1);
      expect(leo!.ownerId).toBe(1);
      expect(leo!.birthDate).toBe('2010-09-07');
      expect(leo!.type.name).toBe('cat');
    });
  });

  describe('getPetById', () => {
    it('should return a single pet with owner and visits', async () => {
      const pet = await getPetById(1);
      expect(pet.id).toBe(1);
      expect(pet.name).toBe('Leo');
      expect(pet.owner).toBeDefined();
      expect(pet.owner.firstName).toBe('George');
      expect(pet.visits).toBeInstanceOf(Array);
    });

    it('should throw on non-existent pet', async () => {
      await expect(getPetById(999)).rejects.toThrow('Server returned code 404');
    });
  });

  describe('createPet', () => {
    it('should create a pet nested under an owner', async () => {
      const newPet = {
        name: 'Buddy',
        birthDate: '2021-05-10',
        type: { id: 2, name: 'dog' },
      };
      const created = await createPet(1, newPet);
      expect(created.id).toBeDefined();
      expect(created.id).toBeGreaterThan(0);
      expect(created.name).toBe('Buddy');
      expect(created.birthDate).toBe('2021-05-10');
      expect(created.type.name).toBe('dog');
      expect(created.ownerId).toBe(1);
    });
  });

  describe('updatePet', () => {
    it('should update an existing pet', async () => {
      const updated = await updatePet(1, {
        id: 1,
        ownerId: 1,
        name: 'Leo Updated',
        birthDate: '2010-09-07',
        type: { id: 1, name: 'cat' },
        owner: {} as Owner,
        visits: [],
      });
      expect(updated.id).toBe(1);
      expect(updated.name).toBe('Leo Updated');
    });

    it('should handle 204 No Content response by returning input pet', async () => {
      server.use(
        http.put(`${API_BASE}/pets/:petId`, () => {
          return new HttpResponse(null, { status: 204 });
        }),
      );
      const input = {
        id: 1,
        ownerId: 1,
        name: 'Leo-204',
        birthDate: '2010-09-07',
        type: { id: 1, name: 'cat' },
        owner: {} as Owner,
        visits: [],
      };
      const result = await updatePet(1, input);
      expect(result).toEqual(input);
    });

    it('should throw on non-existent pet', async () => {
      await expect(
        updatePet(999, {
          id: 999,
          ownerId: 1,
          name: 'Ghost',
          birthDate: '2020-01-01',
          type: { id: 1, name: 'cat' },
          owner: {} as Owner,
          visits: [],
        }),
      ).rejects.toThrow('Server returned code 404');
    });
  });

  describe('deletePet', () => {
    it('should delete an existing pet without error', async () => {
      await expect(deletePet(2)).resolves.toBeUndefined();
    });

    it('should throw on non-existent pet', async () => {
      await expect(deletePet(999)).rejects.toThrow('Server returned code 404');
    });
  });
});

describe('Pet Types', () => {
  it('should return all pet types', async () => {
    const types = await getPetTypes();
    expect(types).toBeInstanceOf(Array);
    expect(types.length).toBe(6);
    expect(types[0]).toHaveProperty('id');
    expect(types[0]).toHaveProperty('name');
    const names = types.map((t) => t.name);
    expect(names).toContain('cat');
    expect(names).toContain('dog');
    expect(names).toContain('lizard');
    expect(names).toContain('snake');
    expect(names).toContain('bird');
    expect(names).toContain('hamster');
  });

  it('should return a pet type by id', async () => {
    const pt = await getPetTypeById(1);
    expect(pt.id).toBe(1);
    expect(pt.name).toBe('cat');
  });

  it('should throw on non-existent pet type', async () => {
    await expect(getPetTypeById(999)).rejects.toThrow('Server returned code 404');
  });
});

describe('Pet Error Handling', () => {
  it('should throw on server error for getPets', async () => {
    server.use(
      http.get(`${API_BASE}/pets`, () => {
        return HttpResponse.json({ error: 'Internal Server Error' }, { status: 500 });
      }),
    );
    await expect(getPets()).rejects.toThrow('Server returned code 500');
  });

  it('should throw on server error for createPet', async () => {
    server.use(
      http.post(`${API_BASE}/owners/:ownerId/pets`, () => {
        return HttpResponse.json({ error: 'Validation failed' }, { status: 400 });
      }),
    );
    await expect(
      createPet(1, { name: '', birthDate: '', type: { id: 1, name: 'cat' } }),
    ).rejects.toThrow('Server returned code 400');
  });

  it('should throw on network error for getPets', async () => {
    server.use(
      http.get(`${API_BASE}/pets`, () => {
        return HttpResponse.error();
      }),
    );
    await expect(getPets()).rejects.toThrow();
  });

  it('should throw on server error for getPetTypes', async () => {
    server.use(
      http.get(`${API_BASE}/pettypes`, () => {
        return HttpResponse.json({ error: 'Internal Server Error' }, { status: 500 });
      }),
    );
    await expect(getPetTypes()).rejects.toThrow('Server returned code 500');
  });
});
