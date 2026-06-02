import type { Visit } from '../types';

const API_BASE = 'http://localhost:9966/petclinic/api';

export async function getVisits(): Promise<Visit[]> {
  const response = await fetch(`${API_BASE}/visits`);
  if (!response.ok) {
    throw new Error(`Server returned code ${response.status} with body "${await response.text()}"`);
  }
  return response.json();
}

export async function getVisitById(visitId: number): Promise<Visit> {
  const response = await fetch(`${API_BASE}/visits/${visitId}`);
  if (!response.ok) {
    throw new Error(`Server returned code ${response.status} with body "${await response.text()}"`);
  }
  return response.json();
}

export async function createVisit(
  ownerId: number,
  petId: number,
  visit: { date: string; description: string },
): Promise<Visit> {
  const response = await fetch(`${API_BASE}/owners/${ownerId}/pets/${petId}/visits`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(visit),
  });
  if (!response.ok) {
    throw new Error(`Server returned code ${response.status} with body "${await response.text()}"`);
  }
  return response.json();
}

export async function updateVisit(visitId: number, visit: Visit): Promise<Visit> {
  const response = await fetch(`${API_BASE}/visits/${visitId}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(visit),
  });
  if (!response.ok) {
    throw new Error(`Server returned code ${response.status} with body "${await response.text()}"`);
  }
  if (response.status === 204) return visit;
  return response.json();
}

export async function deleteVisit(visitId: number): Promise<void> {
  const response = await fetch(`${API_BASE}/visits/${visitId}`, {
    method: 'DELETE',
  });
  if (!response.ok) {
    throw new Error(`Server returned code ${response.status} with body "${await response.text()}"`);
  }
}
