import axios from 'axios';
import type { Owner, Pet, Visit } from '../types';

const api = axios.create({
  baseURL: 'http://localhost:9966/petclinic/api',
});

// Owners
export function getOwners(): Promise<Owner[]> {
  return api.get<Owner[]>('/owners').then((res) => res.data);
}

export function searchOwners(lastName: string): Promise<Owner[]> {
  return api.get<Owner[]>('/owners', { params: { lastName } }).then((res) => res.data);
}

export function getOwnerById(ownerId: number): Promise<Owner> {
  return api.get<Owner>(`/owners/${ownerId}`).then((res) => res.data);
}

export function addOwner(owner: Omit<Owner, 'id' | 'pets'>): Promise<Owner> {
  return api.post<Owner>('/owners', owner).then((res) => res.data);
}

export function updateOwner(ownerId: number, owner: Partial<Owner>): Promise<void> {
  return api.put(`/owners/${ownerId}`, owner).then(() => undefined);
}

export function deleteOwner(ownerId: number): Promise<void> {
  return api.delete(`/owners/${ownerId}`).then(() => undefined);
}

// Pets
export function getPets(): Promise<Pet[]> {
  return api.get<Pet[]>('/pets').then((res) => res.data);
}

export function getPetById(petId: number): Promise<Pet> {
  return api.get<Pet>(`/pets/${petId}`).then((res) => res.data);
}

export function addPet(ownerId: number, pet: { name: string; birthDate: string; type: { id: number; name: string } }): Promise<Pet> {
  return api.post<Pet>(`/owners/${ownerId}/pets`, pet).then((res) => res.data);
}

export function updatePet(petId: number, pet: Partial<Pet>): Promise<void> {
  return api.put(`/pets/${petId}`, pet).then(() => undefined);
}

export function deletePet(petId: number): Promise<void> {
  return api.delete(`/pets/${petId}`).then(() => undefined);
}

// Visits
export function getVisits(): Promise<Visit[]> {
  return api.get<Visit[]>('/visits').then((res) => res.data);
}

export function getVisitById(visitId: number): Promise<Visit> {
  return api.get<Visit>(`/visits/${visitId}`).then((res) => res.data);
}

export function addVisit(ownerId: number, petId: number, visit: { date: string; description: string }): Promise<Visit> {
  return api.post<Visit>(`/owners/${ownerId}/pets/${petId}/visits`, visit).then((res) => res.data);
}

export function updateVisit(visitId: number, visit: Partial<Visit>): Promise<void> {
  return api.put(`/visits/${visitId}`, visit).then(() => undefined);
}

export function deleteVisit(visitId: number): Promise<void> {
  return api.delete(`/visits/${visitId}`).then(() => undefined);
}

// Pet types (for forms)
export function getPetTypes(): Promise<{ id: number; name: string }[]> {
  return api.get<{ id: number; name: string }[]>('/pettypes').then((res) => res.data);
}

export default api;
