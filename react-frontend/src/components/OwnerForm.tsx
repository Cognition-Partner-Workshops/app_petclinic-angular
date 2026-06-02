import OwnerAdd from './owners/OwnerAdd';
import OwnerEdit from './owners/OwnerEdit';

export default function OwnerForm({ mode }: { mode: 'add' | 'edit' }) {
  return mode === 'add' ? <OwnerAdd /> : <OwnerEdit />;
}
