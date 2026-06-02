import PetAdd from './pets/PetAdd';
import PetEdit from './pets/PetEdit';

export default function PetForm({ mode }: { mode: 'add' | 'edit' }) {
  return mode === 'add' ? <PetAdd /> : <PetEdit />;
}
