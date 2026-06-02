import axios from 'axios';
import { Visit } from '../types';

const BASE = '/petclinic/api/visits';

export function getVisits(): Promise<Visit[]> {
  return axios.get<Visit[]>(BASE).then((r) => r.data);
}

export function getVisit(id: number): Promise<Visit> {
  return axios.get<Visit>(`${BASE}/${id}`).then((r) => r.data);
}

export function addVisit(
  ownerId: number,
  petId: number,
  visit: { date: string; description: string },
): Promise<Visit> {
  return axios
    .post<Visit>(`/petclinic/api/owners/${ownerId}/pets/${petId}/visits`, visit)
    .then((r) => r.data);
}

export function updateVisit(id: number, visit: Visit): Promise<void> {
  return axios.put(`${BASE}/${id}`, visit).then(() => undefined);
}

export function deleteVisit(id: number): Promise<void> {
  return axios.delete(`${BASE}/${id}`).then(() => undefined);
}
