import client from './client';
import { Pet } from '../types';

export function getPets(): Promise<Pet[]> {
  return client.get<Pet[]>('pets').then((r) => r.data);
}

export function getPetById(id: number): Promise<Pet> {
  return client.get<Pet>(`pets/${id}`).then((r) => r.data);
}

export function addPet(ownerId: number, pet: Partial<Pet>): Promise<Pet> {
  return client.post<Pet>(`owners/${ownerId}/pets`, { ...pet, id: null }).then((r) => r.data);
}

export function updatePet(id: number, pet: Partial<Pet>): Promise<Pet> {
  return client.put<Pet>(`pets/${id}`, pet).then((r) => r.data);
}

export function deletePet(id: number): Promise<void> {
  return client.delete(`pets/${id}`).then(() => undefined);
}
