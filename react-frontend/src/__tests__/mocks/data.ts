import type { Owner, Pet, PetType, Visit, Vet, Specialty } from '../../types';

export const petTypes: PetType[] = [
  { id: 1, name: 'cat' },
  { id: 2, name: 'dog' },
  { id: 3, name: 'lizard' },
];

export const specialties: Specialty[] = [
  { id: 1, name: 'radiology' },
  { id: 2, name: 'surgery' },
  { id: 3, name: 'dentistry' },
];

// Flat owner objects (pets populated with flat pet references below)
const ownerBase = (id: number, firstName: string, lastName: string, address: string, city: string, telephone: string) =>
  ({ id, firstName, lastName, address, city, telephone, pets: [] as Pet[] });

export const owners: Owner[] = [
  ownerBase(1, 'George', 'Franklin', '110 W. Liberty St.', 'Madison', '6085551023'),
  ownerBase(2, 'Betty', 'Davis', '638 Cardinal Ave.', 'Sun Prairie', '6085551749'),
  ownerBase(3, 'Eduardo', 'Rodriquez', '2693 Commerce St.', 'McFarland', '6085558763'),
];

// Pets reference a *shallow copy* of the owner (without back-referencing pets)
// to avoid circular JSON serialization issues.
const ownerRef = (o: Owner): Owner => ({ ...o, pets: [] });

export const pets: Pet[] = [
  {
    id: 1,
    ownerId: 1,
    name: 'Leo',
    birthDate: '2020-09-07',
    type: petTypes[0],
    owner: ownerRef(owners[0]),
    visits: [],
  },
  {
    id: 2,
    ownerId: 2,
    name: 'Basil',
    birthDate: '2021-08-06',
    type: petTypes[1],
    owner: ownerRef(owners[1]),
    visits: [],
  },
];

// Visits reference a *shallow copy* of the pet (without the owner back-ref)
const petRef = (p: Pet): Pet => ({ ...p, owner: ownerRef(p.owner), visits: [] });

export const visits: Visit[] = [
  {
    id: 1,
    date: '2023-01-04',
    description: 'rabies shot',
    pet: petRef(pets[0]),
    petId: 1,
  },
  {
    id: 2,
    date: '2023-03-15',
    description: 'neutering',
    pet: petRef(pets[1]),
    petId: 2,
  },
];

export const vets: Vet[] = [
  {
    id: 1,
    firstName: 'James',
    lastName: 'Carter',
    specialties: [],
  },
  {
    id: 2,
    firstName: 'Helen',
    lastName: 'Leary',
    specialties: [specialties[0]],
  },
  {
    id: 3,
    firstName: 'Linda',
    lastName: 'Douglas',
    specialties: [specialties[1], specialties[2]],
  },
];

// Populate owner.pets with shallow copies (no circular refs)
owners[0].pets = [petRef(pets[0])];
owners[1].pets = [petRef(pets[1])];
