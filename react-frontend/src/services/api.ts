import axios from 'axios';
import type { Owner, Pet, Visit, PetType } from '../types';

const api = axios.create({
  baseURL: 'http://localhost:9966/petclinic/api',
});

// Owners
export const getOwners = (lastName?: string) =>
  api.get<Owner[]>('/owners', { params: lastName ? { lastName } : undefined });

export const getOwner = (id: number) =>
  api.get<Owner>(`/owners/${id}`);

export const createOwner = (owner: Omit<Owner, 'id' | 'pets'>) =>
  api.post<Owner>('/owners', owner);

export const updateOwner = (id: number, owner: Omit<Owner, 'id' | 'pets'>) =>
  api.put<void>(`/owners/${id}`, owner);

export const deleteOwner = (id: number) =>
  api.delete<void>(`/owners/${id}`);

// Pets
export const getPets = () =>
  api.get<Pet[]>('/pets');

export const getPet = (id: number) =>
  api.get<Pet>(`/pets/${id}`);

export const createPet = (ownerId: number, pet: { name: string; birthDate: string; type: PetType }) =>
  api.post<Pet>(`/owners/${ownerId}/pets`, pet);

export const updatePet = (id: number, pet: Partial<Pet>) =>
  api.put<void>(`/pets/${id}`, pet);

export const deletePet = (id: number) =>
  api.delete<void>(`/pets/${id}`);

// Visits
export const getVisits = () =>
  api.get<Visit[]>('/visits');

export const getVisit = (id: number) =>
  api.get<Visit>(`/visits/${id}`);

export const createVisit = (ownerId: number, petId: number, visit: { date: string; description: string }) =>
  api.post<Visit>(`/owners/${ownerId}/pets/${petId}/visits`, visit);

export const updateVisit = (id: number, visit: Partial<Visit>) =>
  api.put<void>(`/visits/${id}`, visit);

export const deleteVisit = (id: number) =>
  api.delete<void>(`/visits/${id}`);

// Pet Types
export const getPetTypes = () =>
  api.get<PetType[]>('/pettypes');

export default api;
