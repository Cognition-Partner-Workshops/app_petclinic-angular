import client from './client';
import { PetType } from '../types';

export function getPetTypes(): Promise<PetType[]> {
  return client.get<PetType[]>('pettypes').then((r) => r.data);
}

export function getPetTypeById(id: number): Promise<PetType> {
  return client.get<PetType>(`pettypes/${id}`).then((r) => r.data);
}

export function addPetType(petType: Partial<PetType>): Promise<PetType> {
  return client.post<PetType>('pettypes', petType).then((r) => r.data);
}

export function updatePetType(id: number, petType: Partial<PetType>): Promise<PetType> {
  return client.put<PetType>(`pettypes/${id}`, petType).then((r) => r.data);
}

export function deletePetType(id: number): Promise<void> {
  return client.delete(`pettypes/${id}`).then(() => undefined);
}
