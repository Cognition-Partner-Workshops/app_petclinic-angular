export interface PetType {
  id: number;
  name: string;
}

export interface Owner {
  id: number;
  firstName: string;
  lastName: string;
  address: string;
  city: string;
  telephone: string;
  pets: Pet[];
}

export interface Pet {
  id: number;
  name: string;
  birthDate: string;
  type: PetType;
  ownerId: number;
  owner: Owner | null;
  visits: Visit[];
}

export interface Visit {
  id: number;
  date: string;
  description: string;
  pet: Pet | null;
  petId?: number;
}
