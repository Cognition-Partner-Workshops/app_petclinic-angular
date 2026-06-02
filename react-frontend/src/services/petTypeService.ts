import type { PetType } from '../types';
import api, { parseError } from './api';

const ENTITY_URL = 'pettypes';

export async function getPetTypes(): Promise<PetType[]> {
  try {
    const response = await api.get<PetType[]>(ENTITY_URL);
    return response.data;
  } catch (error) {
    throw parseError(error);
  }
}
