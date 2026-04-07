import apiClient from './apiClient';
import { Specialty } from '../models/Specialty';

export const getSpecialties = async (): Promise<Specialty[]> => {
  const { data } = await apiClient.get<Specialty[]>('specialties');
  return data;
};

export const getSpecialtyById = async (specId: number): Promise<Specialty> => {
  const { data } = await apiClient.get<Specialty>(`specialties/${specId}`);
  return data;
};

export const addSpecialty = async (specialty: Partial<Specialty>): Promise<Specialty> => {
  const { data } = await apiClient.post<Specialty>('specialties', specialty);
  return data;
};

export const updateSpecialty = async (specId: number, specialty: Partial<Specialty>): Promise<Specialty> => {
  const { data } = await apiClient.put<Specialty>(`specialties/${specId}`, specialty);
  return data;
};

export const deleteSpecialty = async (specId: number): Promise<void> => {
  await apiClient.delete(`specialties/${specId}`);
};
