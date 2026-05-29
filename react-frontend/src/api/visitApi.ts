import apiClient from './client';
import type { Visit } from '../models';

const BASE = 'visits';

export const visitApi = {
  getAll: () => apiClient.get<Visit[]>(BASE).then((r) => r.data),

  getById: (id: number) =>
    apiClient.get<Visit>(`${BASE}/${id}`).then((r) => r.data),

  create: (ownerId: number, petId: number, visit: Partial<Visit>) =>
    apiClient
      .post<Visit>(`owners/${ownerId}/pets/${petId}/visits`, visit)
      .then((r) => r.data),

  update: (id: number, visit: Partial<Visit>) =>
    apiClient.put<Visit>(`${BASE}/${id}`, visit).then((r) => r.data),

  remove: (id: number) => apiClient.delete(`${BASE}/${id}`).then((r) => r.data),
};
