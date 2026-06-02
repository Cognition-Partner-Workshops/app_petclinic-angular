import axios from 'axios';
import { PetType } from '../types';

const BASE = '/petclinic/api/pettypes';

export function getPetTypes(): Promise<PetType[]> {
  return axios.get<PetType[]>(BASE).then((r) => r.data);
}
