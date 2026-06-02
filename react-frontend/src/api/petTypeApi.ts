import axios from 'axios';
import type { PetType } from '../types';

const BASE = '/petclinic/api/pettypes';

export function getPetTypes(): Promise<PetType[]> {
  return axios.get<PetType[]>(BASE).then((r) => r.data);
}

export function getPetTypeById(id: number): Promise<PetType> {
  return axios.get<PetType>(`${BASE}/${id}`).then((r) => r.data);
}
