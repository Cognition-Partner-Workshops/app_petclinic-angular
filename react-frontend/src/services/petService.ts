import type { Pet, PetType } from '../types';

const API_BASE = 'http://localhost:9966/petclinic/api';

export async function getPets(): Promise<Pet[]> {
  const response = await fetch(`${API_BASE}/pets`);
  if (!response.ok) {
    throw new Error(`Server returned code ${response.status} with body "${await response.text()}"`);
  }
  return response.json();
}

export async function getPetById(petId: number): Promise<Pet> {
  const response = await fetch(`${API_BASE}/pets/${petId}`);
  if (!response.ok) {
    throw new Error(`Server returned code ${response.status} with body "${await response.text()}"`);
  }
  return response.json();
}

export async function createPet(ownerId: number, pet: { name: string; birthDate: string; type: PetType }): Promise<Pet> {
  const response = await fetch(`${API_BASE}/owners/${ownerId}/pets`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(pet),
  });
  if (!response.ok) {
    throw new Error(`Server returned code ${response.status} with body "${await response.text()}"`);
  }
  return response.json();
}

export async function updatePet(petId: number, pet: Pet): Promise<Pet> {
  const response = await fetch(`${API_BASE}/pets/${petId}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(pet),
  });
  if (!response.ok) {
    throw new Error(`Server returned code ${response.status} with body "${await response.text()}"`);
  }
  if (response.status === 204) return pet;
  return response.json();
}

export async function deletePet(petId: number): Promise<void> {
  const response = await fetch(`${API_BASE}/pets/${petId}`, {
    method: 'DELETE',
  });
  if (!response.ok) {
    throw new Error(`Server returned code ${response.status} with body "${await response.text()}"`);
  }
}

export async function getPetTypes(): Promise<PetType[]> {
  const response = await fetch(`${API_BASE}/pettypes`);
  if (!response.ok) {
    throw new Error(`Server returned code ${response.status} with body "${await response.text()}"`);
  }
  return response.json();
}

export async function getPetTypeById(typeId: number): Promise<PetType> {
  const response = await fetch(`${API_BASE}/pettypes/${typeId}`);
  if (!response.ok) {
    throw new Error(`Server returned code ${response.status} with body "${await response.text()}"`);
  }
  return response.json();
}
