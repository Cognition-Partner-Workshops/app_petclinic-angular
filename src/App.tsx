import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import Layout from './components/Layout';
import Welcome from './pages/Welcome';
import NotFound from './pages/NotFound';
import OwnerList from './pages/owners/OwnerList';
import OwnerDetail from './pages/owners/OwnerDetail';
import OwnerAdd from './pages/owners/OwnerAdd';
import OwnerEdit from './pages/owners/OwnerEdit';
import PetAdd from './pages/pets/PetAdd';
import PetEdit from './pages/pets/PetEdit';
import VisitAdd from './pages/visits/VisitAdd';
import VisitEdit from './pages/visits/VisitEdit';
import VetList from './pages/vets/VetList';
import VetAdd from './pages/vets/VetAdd';
import VetEdit from './pages/vets/VetEdit';
import PetTypeList from './pages/pettypes/PetTypeList';
import PetTypeAdd from './pages/pettypes/PetTypeAdd';
import PetTypeEdit from './pages/pettypes/PetTypeEdit';
import SpecialtyList from './pages/specialties/SpecialtyList';
import SpecialtyAdd from './pages/specialties/SpecialtyAdd';
import SpecialtyEdit from './pages/specialties/SpecialtyEdit';

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route element={<Layout />}>
          <Route path="/" element={<Navigate to="/welcome" replace />} />
          <Route path="/welcome" element={<Welcome />} />
          <Route path="/owners" element={<OwnerList />} />
          <Route path="/owners/add" element={<OwnerAdd />} />
          <Route path="/owners/:id" element={<OwnerDetail />} />
          <Route path="/owners/:id/edit" element={<OwnerEdit />} />
          <Route path="/owners/:id/pets/add" element={<PetAdd />} />
          <Route path="/owners/:ownerId/pets/:petId/edit" element={<PetEdit />} />
          <Route path="/owners/:ownerId/pets/:petId/visits/add" element={<VisitAdd />} />
          <Route path="/pets/:petId/edit" element={<PetEdit />} />
          <Route path="/pets/:petId/visits/add" element={<VisitAdd />} />
          <Route path="/visits/:id/edit" element={<VisitEdit />} />
          <Route path="/vets" element={<VetList />} />
          <Route path="/vets/add" element={<VetAdd />} />
          <Route path="/vets/:id/edit" element={<VetEdit />} />
          <Route path="/pettypes" element={<PetTypeList />} />
          <Route path="/pettypes/add" element={<PetTypeAdd />} />
          <Route path="/pettypes/:id/edit" element={<PetTypeEdit />} />
          <Route path="/specialties" element={<SpecialtyList />} />
          <Route path="/specialties/add" element={<SpecialtyAdd />} />
          <Route path="/specialties/:id/edit" element={<SpecialtyEdit />} />
          <Route path="*" element={<NotFound />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}
