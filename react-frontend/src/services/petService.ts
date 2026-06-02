import type { Pet } from '../types';
import api, { parseError } from './api';

const ENTITY_URL = 'pets';

export async function getPets(): Promise<Pet[]> {
  try {
    const response = await api.get<Pet[]>(ENTITY_URL);
    return response.data;
  } catch (error) {
    throw parseError(error);
  }
}

export async function getPetById(petId: number): Promise<Pet> {
  try {
    const response = await api.get<Pet>(`${ENTITY_URL}/${petId}`);
    return response.data;
  } catch (error) {
    throw parseError(error);
  }
}

export async function addPet(ownerId: number, pet: Partial<Pet>): Promise<Pet> {
  try {
    const response = await api.post<Pet>(`owners/${ownerId}/pets`, pet);
    return response.data;
  } catch (error) {
    throw parseError(error);
  }
}

export async function updatePet(petId: number, pet: Pet): Promise<Pet> {
  try {
    const response = await api.put<Pet>(`${ENTITY_URL}/${petId}`, pet);
    return response.status === 204 ? pet : response.data;
  } catch (error) {
    throw parseError(error);
  }
}

export async function deletePet(petId: number): Promise<void> {
  try {
    await api.delete(`${ENTITY_URL}/${petId}`);
  } catch (error) {
    throw parseError(error);
  }
}
