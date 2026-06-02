import axios from 'axios';
import { Owner } from '../types';

const BASE = '/petclinic/api/owners';

export function getOwners(lastName?: string): Promise<Owner[]> {
  const url = lastName ? `${BASE}?lastName=${encodeURIComponent(lastName)}` : BASE;
  return axios.get<Owner[]>(url).then((r) => r.data);
}

export function getOwner(id: number): Promise<Owner> {
  return axios.get<Owner>(`${BASE}/${id}`).then((r) => r.data);
}

export function addOwner(owner: Omit<Owner, 'id' | 'pets'>): Promise<Owner> {
  return axios.post<Owner>(BASE, owner).then((r) => r.data);
}

export function updateOwner(id: number, owner: Owner): Promise<void> {
  return axios.put(`${BASE}/${id}`, owner).then(() => undefined);
}

export function deleteOwner(id: number): Promise<void> {
  return axios.delete(`${BASE}/${id}`).then(() => undefined);
}
