import apiClient from './client';
import type { Owner } from '../models';

const BASE = 'owners';

export const ownerApi = {
  getAll: () => apiClient.get<Owner[]>(BASE).then((r) => r.data),

  getById: (id: number) =>
    apiClient.get<Owner>(`${BASE}/${id}`).then((r) => r.data),

  search: (lastName: string) =>
    apiClient
      .get<Owner[]>(BASE, { params: lastName ? { lastName } : undefined })
      .then((r) => r.data),

  create: (owner: Omit<Owner, 'id' | 'pets'>) =>
    apiClient.post<Owner>(BASE, owner).then((r) => r.data),

  update: (id: number, owner: Owner) =>
    apiClient.put<Owner>(`${BASE}/${id}`, owner).then((r) => r.data),

  remove: (id: number) => apiClient.delete(`${BASE}/${id}`).then((r) => r.data),
};
