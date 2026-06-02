import axios from 'axios';
import type { Visit } from '../types';

const BASE = '/petclinic/api/visits';

export function getVisits(): Promise<Visit[]> {
  return axios.get<Visit[]>(BASE).then((r) => r.data);
}

export function getVisitById(id: number): Promise<Visit> {
  return axios.get<Visit>(`${BASE}/${id}`).then((r) => r.data);
}

export function addVisit(
  ownerId: number,
  petId: number,
  visit: Partial<Visit>
): Promise<Visit> {
  return axios
    .post<Visit>(
      `/petclinic/api/owners/${ownerId}/pets/${petId}/visits`,
      visit
    )
    .then((r) => r.data);
}

export function updateVisit(
  id: number,
  visit: Partial<Visit>
): Promise<Visit> {
  return axios.put<Visit>(`${BASE}/${id}`, visit).then((r) => r.data);
}

export function deleteVisit(id: number): Promise<void> {
  return axios.delete(`${BASE}/${id}`).then(() => undefined);
}
