import type { Owner } from '../types';

const API_BASE = 'http://localhost:9966/petclinic/api';

export async function getOwners(lastName?: string): Promise<Owner[]> {
  const url = new URL(`${API_BASE}/owners`);
  if (lastName !== undefined) {
    url.searchParams.set('lastName', lastName);
  }
  const response = await fetch(url.toString());
  if (!response.ok) {
    throw new Error(`Server returned code ${response.status} with body "${await response.text()}"`);
  }
  return response.json();
}

export async function getOwnerById(ownerId: number): Promise<Owner> {
  const response = await fetch(`${API_BASE}/owners/${ownerId}`);
  if (!response.ok) {
    throw new Error(`Server returned code ${response.status} with body "${await response.text()}"`);
  }
  return response.json();
}

export async function createOwner(owner: Omit<Owner, 'id' | 'pets'>): Promise<Owner> {
  const response = await fetch(`${API_BASE}/owners`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(owner),
  });
  if (!response.ok) {
    throw new Error(`Server returned code ${response.status} with body "${await response.text()}"`);
  }
  return response.json();
}

export async function updateOwner(ownerId: number, owner: Owner): Promise<Owner> {
  const response = await fetch(`${API_BASE}/owners/${ownerId}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(owner),
  });
  if (!response.ok) {
    throw new Error(`Server returned code ${response.status} with body "${await response.text()}"`);
  }
  if (response.status === 204) return owner;
  return response.json();
}

export async function deleteOwner(ownerId: number): Promise<void> {
  const response = await fetch(`${API_BASE}/owners/${ownerId}`, {
    method: 'DELETE',
  });
  if (!response.ok) {
    throw new Error(`Server returned code ${response.status} with body "${await response.text()}"`);
  }
}
