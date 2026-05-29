import apiClient from './client';
import type { Vet } from '../models';

const BASE = 'vets';

export const vetApi = {
  getAll: () => apiClient.get<Vet[]>(BASE).then((r) => r.data),

  getById: (id: number) =>
    apiClient.get<Vet>(`${BASE}/${id}`).then((r) => r.data),

  create: (vet: Partial<Vet>) =>
    apiClient.post<Vet>(BASE, vet).then((r) => r.data),

  update: (id: number, vet: Partial<Vet>) =>
    apiClient.put<Vet>(`${BASE}/${id}`, vet).then((r) => r.data),

  remove: (id: number) => apiClient.delete(`${BASE}/${id}`).then((r) => r.data),
};
