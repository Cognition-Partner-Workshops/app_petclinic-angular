import client from './client';
import { Vet } from '../types';

export function getVets(): Promise<Vet[]> {
  return client.get<Vet[]>('vets').then((r) => r.data);
}

export function getVetById(id: number): Promise<Vet> {
  return client.get<Vet>(`vets/${id}`).then((r) => r.data);
}

export function addVet(vet: Partial<Vet>): Promise<Vet> {
  return client.post<Vet>('vets', vet).then((r) => r.data);
}

export function updateVet(id: number, vet: Partial<Vet>): Promise<Vet> {
  return client.put<Vet>(`vets/${id}`, vet).then((r) => r.data);
}

export function deleteVet(id: number): Promise<void> {
  return client.delete(`vets/${id}`).then(() => undefined);
}
