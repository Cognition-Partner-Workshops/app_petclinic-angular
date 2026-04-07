import apiClient from './apiClient';
import { Pet } from '../models/Pet';

export const getPets = async (): Promise<Pet[]> => {
  const { data } = await apiClient.get<Pet[]>('pets');
  return data;
};

export const getPetById = async (petId: number): Promise<Pet> => {
  const { data } = await apiClient.get<Pet>(`pets/${petId}`);
  return data;
};

export const addPet = async (ownerId: number, pet: Partial<Pet>): Promise<Pet> => {
  const { data } = await apiClient.post<Pet>(`owners/${ownerId}/pets`, pet);
  return data;
};

export const updatePet = async (petId: number, pet: Partial<Pet>): Promise<Pet> => {
  const { data } = await apiClient.put<Pet>(`pets/${petId}`, pet);
  return data;
};

export const deletePet = async (petId: number): Promise<void> => {
  await apiClient.delete(`pets/${petId}`);
};
