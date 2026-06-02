import type { Owner } from '../types';
import api, { parseError } from './api';

const ENTITY_URL = 'owners';

export async function getOwners(): Promise<Owner[]> {
  try {
    const response = await api.get<Owner[]>(ENTITY_URL);
    return response.data;
  } catch (error) {
    throw parseError(error);
  }
}

export async function getOwnerById(ownerId: number): Promise<Owner> {
  try {
    const response = await api.get<Owner>(`${ENTITY_URL}/${ownerId}`);
    return response.data;
  } catch (error) {
    throw parseError(error);
  }
}

export async function addOwner(owner: Partial<Owner>): Promise<Owner> {
  try {
    const response = await api.post<Owner>(ENTITY_URL, owner);
    return response.data;
  } catch (error) {
    throw parseError(error);
  }
}

export async function updateOwner(ownerId: number, owner: Owner): Promise<Owner> {
  try {
    const response = await api.put<Owner>(`${ENTITY_URL}/${ownerId}`, owner);
    return response.data;
  } catch (error) {
    throw parseError(error);
  }
}

export async function deleteOwner(ownerId: number): Promise<void> {
  try {
    await api.delete(`${ENTITY_URL}/${ownerId}`);
  } catch (error) {
    throw parseError(error);
  }
}

export async function searchOwners(lastName: string): Promise<Owner[]> {
  try {
    const response = await api.get<Owner[]>(ENTITY_URL, {
      params: { lastName },
    });
    return response.data;
  } catch (error) {
    throw parseError(error);
  }
}
