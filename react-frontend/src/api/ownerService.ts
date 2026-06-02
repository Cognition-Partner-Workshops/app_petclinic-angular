import httpClient from './httpClient';
import type { Owner } from '../types';

const URL = 'owners';

export const ownerService = {
  getOwners(): Promise<Owner[]> {
    return httpClient.get<Owner[]>(URL).then((r) => r.data);
  },
  getOwnerById(id: number): Promise<Owner> {
    return httpClient.get<Owner>(`${URL}/${id}`).then((r) => r.data);
  },
  addOwner(owner: Partial<Owner>): Promise<Owner> {
    return httpClient.post<Owner>(URL, owner).then((r) => r.data);
  },
  updateOwner(id: number, owner: Partial<Owner>): Promise<Owner> {
    return httpClient.put<Owner>(`${URL}/${id}`, owner).then((r) => r.data);
  },
  deleteOwner(id: number): Promise<void> {
    return httpClient.delete(`${URL}/${id}`).then(() => undefined);
  },
  searchOwners(lastName: string): Promise<Owner[]> {
    return httpClient.get<Owner[]>(URL, { params: { lastName } }).then((r) => r.data);
  },
};
