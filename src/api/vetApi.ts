import apiClient from './apiClient';
import { Vet } from '../models/Vet';

export const getVets = async (): Promise<Vet[]> => {
  const { data } = await apiClient.get<Vet[]>('vets');
  return data;
};

export const getVetById = async (vetId: number): Promise<Vet> => {
  const { data } = await apiClient.get<Vet>(`vets/${vetId}`);
  return data;
};

export const addVet = async (vet: Partial<Vet>): Promise<Vet> => {
  const { data } = await apiClient.post<Vet>('vets', vet);
  return data;
};

export const updateVet = async (vetId: number, vet: Partial<Vet>): Promise<Vet> => {
  const { data } = await apiClient.put<Vet>(`vets/${vetId}`, vet);
  return data;
};

export const deleteVet = async (vetId: number): Promise<void> => {
  await apiClient.delete(`vets/${vetId}`);
};
