import httpClient from './httpClient';
import type { Pet } from '../types';

const URL = 'pets';

export const petService = {
  getPets(): Promise<Pet[]> {
    return httpClient.get<Pet[]>(URL).then((r) => r.data);
  },
  getPetById(id: number): Promise<Pet> {
    return httpClient.get<Pet>(`${URL}/${id}`).then((r) => r.data);
  },
  addPet(ownerId: number, pet: Partial<Pet>): Promise<Pet> {
    return httpClient.post<Pet>(`owners/${ownerId}/pets`, pet).then((r) => r.data);
  },
  updatePet(id: number, pet: Partial<Pet>): Promise<Pet> {
    return httpClient.put<Pet>(`${URL}/${id}`, pet).then((r) => r.data);
  },
  deletePet(id: number): Promise<number> {
    return httpClient.delete<number>(`${URL}/${id}`).then((r) => r.data);
  },
};
