import client from './client';
import { Visit } from '../types';

export function getVisits(): Promise<Visit[]> {
  return client.get<Visit[]>('visits').then((r) => r.data);
}

export function getVisitById(id: number): Promise<Visit> {
  return client.get<Visit>(`visits/${id}`).then((r) => r.data);
}

export function addVisit(ownerId: number, petId: number, visit: Partial<Visit>): Promise<Visit> {
  return client
    .post<Visit>(`owners/${ownerId}/pets/${petId}/visits`, { ...visit, id: null })
    .then((r) => r.data);
}

export function updateVisit(id: number, visit: Partial<Visit>): Promise<Visit> {
  return client.put<Visit>(`visits/${id}`, visit).then((r) => r.data);
}

export function deleteVisit(id: number): Promise<void> {
  return client.delete(`visits/${id}`).then(() => undefined);
}
