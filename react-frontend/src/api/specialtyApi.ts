import apiClient from './client';
import type { Specialty } from '../models';

const BASE = 'specialties';

export const specialtyApi = {
  getAll: () => apiClient.get<Specialty[]>(BASE).then((r) => r.data),

  getById: (id: number) =>
    apiClient.get<Specialty>(`${BASE}/${id}`).then((r) => r.data),

  create: (specialty: Partial<Specialty>) =>
    apiClient.post<Specialty>(BASE, specialty).then((r) => r.data),

  update: (id: number, specialty: Partial<Specialty>) =>
    apiClient.put<Specialty>(`${BASE}/${id}`, specialty).then((r) => r.data),

  remove: (id: number) => apiClient.delete(`${BASE}/${id}`).then((r) => r.data),
};
