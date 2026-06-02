export interface PetType {
  id: number;
  name: string;
}

export interface Visit {
  id: number;
  date: string;
  description: string;
  pet: Pet;
  petId?: number;
}

export interface Pet {
  id: number;
  ownerId: number;
  name: string;
  birthDate: string;
  type: PetType;
  owner: Owner;
  visits: Visit[];
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
