import apiClient from './apiClient';
import { Visit } from '../models/Visit';

export const getVisits = async (): Promise<Visit[]> => {
  const { data } = await apiClient.get<Visit[]>('visits');
  return data;
};

export const getVisitById = async (visitId: number): Promise<Visit> => {
  const { data } = await apiClient.get<Visit>(`visits/${visitId}`);
  return data;
};

export const addVisit = async (ownerId: number, petId: number, visit: Partial<Visit>): Promise<Visit> => {
  const { data } = await apiClient.post<Visit>(`owners/${ownerId}/pets/${petId}/visits`, visit);
  return data;
};

export const updateVisit = async (visitId: number, visit: Partial<Visit>): Promise<Visit> => {
  const { data } = await apiClient.put<Visit>(`visits/${visitId}`, visit);
  return data;
};

export const deleteVisit = async (visitId: number): Promise<void> => {
  await apiClient.delete(`visits/${visitId}`);
};
