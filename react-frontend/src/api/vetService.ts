import httpClient from './httpClient';
import type { Vet } from '../types';

const URL = 'vets';

export const vetService = {
  getVets(): Promise<Vet[]> {
    return httpClient.get<Vet[]>(URL).then((r) => r.data);
  },
  getVetById(id: number): Promise<Vet> {
    return httpClient.get<Vet>(`${URL}/${id}`).then((r) => r.data);
  },
  addVet(vet: Partial<Vet>): Promise<Vet> {
    return httpClient.post<Vet>(URL, vet).then((r) => r.data);
  },
  updateVet(id: number, vet: Partial<Vet>): Promise<Vet> {
    return httpClient.put<Vet>(`${URL}/${id}`, vet).then((r) => r.data);
  },
  deleteVet(id: number): Promise<number> {
    return httpClient.delete<number>(`${URL}/${id}`).then((r) => r.data);
  },
};
