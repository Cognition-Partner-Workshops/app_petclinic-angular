import httpClient from './httpClient';
import type { Visit } from '../types';

const URL = 'visits';

export const visitService = {
  getVisits(): Promise<Visit[]> {
    return httpClient.get<Visit[]>(URL).then((r) => r.data);
  },
  getVisitById(id: number): Promise<Visit> {
    return httpClient.get<Visit>(`${URL}/${id}`).then((r) => r.data);
  },
  addVisit(ownerId: number, petId: number, visit: Partial<Visit>): Promise<Visit> {
    return httpClient
      .post<Visit>(`owners/${ownerId}/pets/${petId}/visits`, visit)
      .then((r) => r.data);
  },
  updateVisit(id: number, visit: Partial<Visit>): Promise<Visit> {
    return httpClient.put<Visit>(`${URL}/${id}`, visit).then((r) => r.data);
  },
  deleteVisit(id: number): Promise<number> {
    return httpClient.delete<number>(`${URL}/${id}`).then((r) => r.data);
  },
};
