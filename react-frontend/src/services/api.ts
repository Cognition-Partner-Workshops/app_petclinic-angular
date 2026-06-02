import axios from 'axios';
import type { Owner, Pet, PetType, Visit } from '../types';

const api = axios.create({
  baseURL: 'http://localhost:9966/petclinic/api',
});

// --- Owners ---

export function getOwners(): Promise<Owner[]> {
  return api.get<Owner[]>('/owners').then((res) => res.data);
}

export function searchOwners(lastName: string): Promise<Owner[]> {
  return api
    .get<Owner[]>('/owners', { params: { lastName } })
    .then((res) => res.data);
}

export function getOwnerById(ownerId: number): Promise<Owner> {
  return api.get<Owner>(`/owners/${ownerId}`).then((res) => res.data);
}

export function createOwner(
  owner: Omit<Owner, 'id' | 'pets'>
): Promise<Owner> {
  return api.post<Owner>('/owners', owner).then((res) => res.data);
}

export function updateOwner(ownerId: number, owner: Owner): Promise<void> {
  return api.put(`/owners/${ownerId}`, owner).then(() => undefined);
}

export function deleteOwner(ownerId: number): Promise<void> {
  return api.delete(`/owners/${ownerId}`).then(() => undefined);
}

// --- Pets ---

export function getPets(): Promise<Pet[]> {
  return api.get<Pet[]>('/pets').then((res) => res.data);
}

export function getPetById(petId: number): Promise<Pet> {
  return api.get<Pet>(`/pets/${petId}`).then((res) => res.data);
}

export function createPet(
  ownerId: number,
  pet: { name: string; birthDate: string; type: PetType }
): Promise<Pet> {
  return api
    .post<Pet>(`/owners/${ownerId}/pets`, pet)
    .then((res) => res.data);
}

export function updatePet(petId: number, pet: Pet): Promise<void> {
  return api.put(`/pets/${petId}`, pet).then(() => undefined);
}

export function deletePet(petId: number): Promise<void> {
  return api.delete(`/pets/${petId}`).then(() => undefined);
}

// --- Visits ---

export function getVisits(): Promise<Visit[]> {
  return api.get<Visit[]>('/visits').then((res) => res.data);
}

export function getVisitById(visitId: number): Promise<Visit> {
  return api.get<Visit>(`/visits/${visitId}`).then((res) => res.data);
}

export function createVisit(
  ownerId: number,
  petId: number,
  visit: { date: string; description: string }
): Promise<Visit> {
  return api
    .post<Visit>(`/owners/${ownerId}/pets/${petId}/visits`, visit)
    .then((res) => res.data);
}

export function updateVisit(visitId: number, visit: Visit): Promise<void> {
  return api.put(`/visits/${visitId}`, visit).then(() => undefined);
}

export function deleteVisit(visitId: number): Promise<void> {
  return api.delete(`/visits/${visitId}`).then(() => undefined);
}

// --- Pet Types ---

export function getPetTypes(): Promise<PetType[]> {
  return api.get<PetType[]>('/pettypes').then((res) => res.data);
}
