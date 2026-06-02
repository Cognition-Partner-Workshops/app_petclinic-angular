import { Routes, Route, Navigate } from 'react-router-dom';
import OwnerList from './pages/owners/OwnerList';
import OwnerDetail from './pages/owners/OwnerDetail';
import OwnerAdd from './pages/owners/OwnerAdd';
import OwnerEdit from './pages/owners/OwnerEdit';
import PetList from './pages/pets/PetList';
import PetAdd from './pages/pets/PetAdd';
import PetEdit from './pages/pets/PetEdit';
import VisitList from './pages/visits/VisitList';
import VisitAdd from './pages/visits/VisitAdd';
import VisitEdit from './pages/visits/VisitEdit';

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<Navigate to="/owners" replace />} />
      <Route path="/owners" element={<OwnerList />} />
      <Route path="/owners/add" element={<OwnerAdd />} />
      <Route path="/owners/:id" element={<OwnerDetail />} />
      <Route path="/owners/:id/edit" element={<OwnerEdit />} />
      <Route path="/owners/:id/pets/add" element={<PetAdd />} />
      <Route path="/pets" element={<PetList />} />
      <Route path="/pets/add" element={<PetAdd />} />
      <Route path="/pets/:id/edit" element={<PetEdit />} />
      <Route path="/pets/:id/visits/add" element={<VisitAdd />} />
      <Route path="/owners/:ownerId/pets/:petId/visits/add" element={<VisitAdd />} />
      <Route path="/visits" element={<VisitList />} />
      <Route path="/visits/add" element={<VisitAdd />} />
      <Route path="/visits/:id/edit" element={<VisitEdit />} />
    </Routes>
  );
}
