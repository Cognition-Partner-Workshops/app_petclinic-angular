import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import OwnerList from './components/owners/OwnerList';
import OwnerDetail from './components/owners/OwnerDetail';
import OwnerAdd from './components/owners/OwnerAdd';
import OwnerEdit from './components/owners/OwnerEdit';
import PetList from './components/pets/PetList';
import PetAdd from './components/pets/PetAdd';
import PetEdit from './components/pets/PetEdit';
import VisitList from './components/visits/VisitList';
import VisitAdd from './components/visits/VisitAdd';

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Navigate to="/owners" replace />} />
        <Route path="/owners" element={<OwnerList />} />
        <Route path="/owners/new" element={<OwnerAdd />} />
        <Route path="/owners/:ownerId" element={<OwnerDetail />} />
        <Route path="/owners/:ownerId/edit" element={<OwnerEdit />} />
        <Route path="/owners/:ownerId/pets/new" element={<PetAdd />} />
        <Route path="/owners/:ownerId/pets/:petId/visits/new" element={<VisitAdd />} />
        <Route path="/pets" element={<PetList />} />
        <Route path="/pets/:petId/edit" element={<PetEdit />} />
        <Route path="/visits" element={<VisitList />} />
      </Routes>
    </BrowserRouter>
  );
}
