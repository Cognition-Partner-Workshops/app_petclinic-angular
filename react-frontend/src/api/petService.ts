import axios from 'axios';
import { Pet } from '../types';

const BASE = '/petclinic/api/pets';

export function getPets(): Promise<Pet[]> {
  return axios.get<Pet[]>(BASE).then((r) => r.data);
}

export function getPet(id: number): Promise<Pet> {
  return axios.get<Pet>(`${BASE}/${id}`).then((r) => r.data);
}

export function addPet(
  ownerId: number,
  pet: { name: string; birthDate: string; type: { id: number; name: string } },
): Promise<Pet> {
  return axios
    .post<Pet>(`/petclinic/api/owners/${ownerId}/pets`, pet)
    .then((r) => r.data);
}

export function updatePet(id: number, pet: Pet): Promise<void> {
  return axios.put(`${BASE}/${id}`, pet).then(() => undefined);
}

export function deletePet(id: number): Promise<void> {
  return axios.delete(`${BASE}/${id}`).then(() => undefined);
}
