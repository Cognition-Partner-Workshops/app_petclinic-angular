import httpClient from './httpClient';
import type { Specialty } from '../types';

const URL = 'specialties';

export const specialtyService = {
  getSpecialties(): Promise<Specialty[]> {
    return httpClient.get<Specialty[]>(URL).then((r) => r.data);
  },
  getSpecialtyById(id: number): Promise<Specialty> {
    return httpClient.get<Specialty>(`${URL}/${id}`).then((r) => r.data);
  },
  addSpecialty(specialty: Partial<Specialty>): Promise<Specialty> {
    return httpClient.post<Specialty>(URL, specialty).then((r) => r.data);
  },
  updateSpecialty(id: number, specialty: Partial<Specialty>): Promise<Specialty> {
    return httpClient.put<Specialty>(`${URL}/${id}`, specialty).then((r) => r.data);
  },
  deleteSpecialty(id: number): Promise<number> {
    return httpClient.delete<number>(`${URL}/${id}`).then((r) => r.data);
  },
};
