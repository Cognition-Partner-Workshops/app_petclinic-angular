import VisitAdd from './visits/VisitAdd';
import VisitEdit from './visits/VisitEdit';

export default function VisitForm({ mode }: { mode: 'add' | 'edit' }) {
  return mode === 'add' ? <VisitAdd /> : <VisitEdit />;
}
