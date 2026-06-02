import httpClient from './httpClient';
import type { PetType } from '../types';

const URL = 'pettypes';

export const petTypeService = {
  getPetTypes(): Promise<PetType[]> {
    return httpClient.get<PetType[]>(URL).then((r) => r.data);
  },
  getPetTypeById(id: number): Promise<PetType> {
    return httpClient.get<PetType>(`${URL}/${id}`).then((r) => r.data);
  },
  addPetType(petType: Partial<PetType>): Promise<PetType> {
    return httpClient.post<PetType>(URL, petType).then((r) => r.data);
  },
  updatePetType(id: number, petType: Partial<PetType>): Promise<PetType> {
    return httpClient.put<PetType>(`${URL}/${id}`, petType).then((r) => r.data);
  },
  deletePetType(id: number): Promise<number> {
    return httpClient.delete<number>(`${URL}/${id}`).then((r) => r.data);
  },
};
