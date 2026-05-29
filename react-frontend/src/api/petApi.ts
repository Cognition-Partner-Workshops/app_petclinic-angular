import apiClient from './client';
import type { Pet } from '../models';

const BASE = 'pets';

export const petApi = {
  getAll: () => apiClient.get<Pet[]>(BASE).then((r) => r.data),

  getById: (id: number) =>
    apiClient.get<Pet>(`${BASE}/${id}`).then((r) => r.data),

  create: (ownerId: number, pet: Partial<Pet>) =>
    apiClient.post<Pet>(`owners/${ownerId}/pets`, pet).then((r) => r.data),

  update: (id: number, pet: Partial<Pet>) =>
    apiClient.put<Pet>(`${BASE}/${id}`, pet).then((r) => r.data),

  remove: (id: number) => apiClient.delete(`${BASE}/${id}`).then((r) => r.data),
};
