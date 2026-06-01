import client from './client';
import { Owner } from '../types';

export function getOwners(): Promise<Owner[]> {
  return client.get<Owner[]>('owners').then((r) => r.data);
}

export function searchOwners(lastName: string): Promise<Owner[]> {
  return client.get<Owner[]>('owners', { params: { lastName } }).then((r) => r.data);
}

export function getOwnerById(id: number): Promise<Owner> {
  return client.get<Owner>(`owners/${id}`).then((r) => r.data);
}

export function addOwner(owner: Partial<Owner>): Promise<Owner> {
  return client.post<Owner>('owners', { ...owner, id: null }).then((r) => r.data);
}

export function updateOwner(id: number, owner: Partial<Owner>): Promise<Owner> {
  return client.put<Owner>(`owners/${id}`, owner).then((r) => r.data);
}

export function deleteOwner(id: number): Promise<void> {
  return client.delete(`owners/${id}`).then(() => undefined);
}
