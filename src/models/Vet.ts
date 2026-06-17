import { Specialty } from './Specialty';

export interface Vet {
  id: number;
  firstName: string;
  lastName: string;
  specialties: Specialty[];
}
