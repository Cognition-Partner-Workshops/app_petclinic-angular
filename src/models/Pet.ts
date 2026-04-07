import { Owner } from './Owner';
import { Visit } from './Visit';
import { PetType } from './PetType';

export interface Pet {
  id: number;
  ownerId: number;
  name: string;
  birthDate: string;
  type: PetType;
  owner: Owner;
  visits: Visit[];
}
