import type { Visit } from '../types';
import api, { parseError } from './api';

const ENTITY_URL = 'visits';

export async function getVisits(): Promise<Visit[]> {
  try {
    const response = await api.get<Visit[]>(ENTITY_URL);
    return response.data;
  } catch (error) {
    throw parseError(error);
  }
}

export async function getVisitById(visitId: number): Promise<Visit> {
  try {
    const response = await api.get<Visit>(`${ENTITY_URL}/${visitId}`);
    return response.data;
  } catch (error) {
    throw parseError(error);
  }
}

export async function addVisit(ownerId: number, petId: number, visit: Partial<Visit>): Promise<Visit> {
  try {
    const response = await api.post<Visit>(`owners/${ownerId}/pets/${petId}/visits`, visit);
    return response.data;
  } catch (error) {
    throw parseError(error);
  }
}

export async function updateVisit(visitId: number, visit: Visit): Promise<Visit> {
  try {
    const response = await api.put<Visit>(`${ENTITY_URL}/${visitId}`, visit);
    return response.data;
  } catch (error) {
    throw parseError(error);
  }
}

export async function deleteVisit(visitId: number): Promise<void> {
  try {
    await api.delete(`${ENTITY_URL}/${visitId}`);
  } catch (error) {
    throw parseError(error);
  }
}
