import axios from 'axios';
import type { Owner } from '../types';

const BASE = '/petclinic/api/owners';

export function getOwners(): Promise<Owner[]> {
  return axios.get<Owner[]>(BASE).then((r) => r.data);
}

export function searchOwners(lastName: string): Promise<Owner[]> {
  return axios
    .get<Owner[]>(BASE, { params: { lastName } })
    .then((r) => r.data);
}

export function getOwnerById(id: number): Promise<Owner> {
  return axios.get<Owner>(`${BASE}/${id}`).then((r) => r.data);
}

export function addOwner(owner: Partial<Owner>): Promise<Owner> {
  return axios.post<Owner>(BASE, owner).then((r) => r.data);
}

export function updateOwner(id: number, owner: Partial<Owner>): Promise<Owner> {
  return axios.put<Owner>(`${BASE}/${id}`, owner).then((r) => r.data);
}

export function deleteOwner(id: number): Promise<void> {
  return axios.delete(`${BASE}/${id}`).then(() => undefined);
}
