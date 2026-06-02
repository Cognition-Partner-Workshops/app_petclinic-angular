import axios from 'axios';
import type { Pet } from '../types';

const BASE = '/petclinic/api/pets';

export function getPets(): Promise<Pet[]> {
  return axios.get<Pet[]>(BASE).then((r) => r.data);
}

export function getPetById(id: number): Promise<Pet> {
  return axios.get<Pet>(`${BASE}/${id}`).then((r) => r.data);
}

export function addPet(ownerId: number, pet: Partial<Pet>): Promise<Pet> {
  return axios
    .post<Pet>(`/petclinic/api/owners/${ownerId}/pets`, pet)
    .then((r) => r.data);
}

export function updatePet(id: number, pet: Partial<Pet>): Promise<Pet> {
  return axios.put<Pet>(`${BASE}/${id}`, pet).then((r) => r.data);
}

export function deletePet(id: number): Promise<void> {
  return axios.delete(`${BASE}/${id}`).then(() => undefined);
}
