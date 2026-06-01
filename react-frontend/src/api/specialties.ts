import client from './client';
import { Specialty } from '../types';

export function getSpecialties(): Promise<Specialty[]> {
  return client.get<Specialty[]>('specialties').then((r) => r.data);
}

export function getSpecialtyById(id: number): Promise<Specialty> {
  return client.get<Specialty>(`specialties/${id}`).then((r) => r.data);
}

export function addSpecialty(specialty: Partial<Specialty>): Promise<Specialty> {
  return client.post<Specialty>('specialties', specialty).then((r) => r.data);
}

export function updateSpecialty(id: number, specialty: Partial<Specialty>): Promise<Specialty> {
  return client.put<Specialty>(`specialties/${id}`, specialty).then((r) => r.data);
}

export function deleteSpecialty(id: number): Promise<void> {
  return client.delete(`specialties/${id}`).then(() => undefined);
}
