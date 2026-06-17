import apiClient from './apiClient';
import { PetType } from '../models/PetType';

export const getPetTypes = async (): Promise<PetType[]> => {
  const { data } = await apiClient.get<PetType[]>('pettypes');
  return data;
};

export const getPetTypeById = async (typeId: number): Promise<PetType> => {
  const { data } = await apiClient.get<PetType>(`pettypes/${typeId}`);
  return data;
};

export const addPetType = async (petType: Partial<PetType>): Promise<PetType> => {
  const { data } = await apiClient.post<PetType>('pettypes', petType);
  return data;
};

export const updatePetType = async (typeId: number, petType: Partial<PetType>): Promise<PetType> => {
  const { data } = await apiClient.put<PetType>(`pettypes/${typeId}`, petType);
  return data;
};

export const deletePetType = async (typeId: number): Promise<void> => {
  await apiClient.delete(`pettypes/${typeId}`);
};
