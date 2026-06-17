import { Pet } from './Pet';

export interface Visit {
  id: number;
  date: string;
  description: string;
  pet: Pet;
  petId?: number;
}
