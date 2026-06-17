import apiClient from './apiClient';
import { Owner } from '../models/Owner';

export const getOwners = async (): Promise<Owner[]> => {
  const { data } = await apiClient.get<Owner[]>('owners');
  return data;
};

export const getOwnerById = async (ownerId: number): Promise<Owner> => {
  const { data } = await apiClient.get<Owner>(`owners/${ownerId}`);
  return data;
};

export const addOwner = async (owner: Partial<Owner>): Promise<Owner> => {
  const { data } = await apiClient.post<Owner>('owners', owner);
  return data;
};

export const updateOwner = async (ownerId: number, owner: Partial<Owner>): Promise<Owner> => {
  const { data } = await apiClient.put<Owner>(`owners/${ownerId}`, owner);
  return data;
};

export const deleteOwner = async (ownerId: number): Promise<void> => {
  await apiClient.delete(`owners/${ownerId}`);
};

export const searchOwners = async (lastName: string): Promise<Owner[]> => {
  const url = lastName ? `owners?lastName=${lastName}` : 'owners';
  const { data } = await apiClient.get<Owner[]>(url);
  return data;
};
