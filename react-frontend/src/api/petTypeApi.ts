import apiClient from './client';
import type { PetType } from '../models';

const BASE = 'pettypes';

export const petTypeApi = {
  getAll: () => apiClient.get<PetType[]>(BASE).then((r) => r.data),

  getById: (id: number) =>
    apiClient.get<PetType>(`${BASE}/${id}`).then((r) => r.data),

  create: (petType: Partial<PetType>) =>
    apiClient.post<PetType>(BASE, petType).then((r) => r.data),

  update: (id: number, petType: Partial<PetType>) =>
    apiClient.put<PetType>(`${BASE}/${id}`, petType).then((r) => r.data),

  remove: (id: number) => apiClient.delete(`${BASE}/${id}`).then((r) => r.data),
};
