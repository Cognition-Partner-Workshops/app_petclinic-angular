import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom';
import OwnerList from './components/owners/OwnerList';
import OwnerDetail from './components/owners/OwnerDetail';
import OwnerAdd from './components/owners/OwnerAdd';
import OwnerEdit from './components/owners/OwnerEdit';
import PetAdd from './components/pets/PetAdd';
import PetEdit from './components/pets/PetEdit';
import VisitAdd from './components/visits/VisitAdd';
import VisitEdit from './components/visits/VisitEdit';

export default function App() {
  return (
    <BrowserRouter>
      <div style={{ padding: '1rem' }}>
        <h1>PetClinic</h1>
        <Routes>
          <Route path="/" element={<Navigate to="/owners" replace />} />
          <Route path="/owners" element={<OwnerList />} />
          <Route path="/owners/add" element={<OwnerAdd />} />
          <Route path="/owners/:id" element={<OwnerDetail />} />
          <Route path="/owners/:id/edit" element={<OwnerEdit />} />
          <Route path="/owners/:ownerId/pets/add" element={<PetAdd />} />
          <Route
            path="/owners/:ownerId/pets/:petId/edit"
            element={<PetEdit />}
          />
          <Route
            path="/owners/:ownerId/pets/:petId/visits/add"
            element={<VisitAdd />}
          />
          <Route
            path="/owners/:ownerId/pets/:petId/visits/:visitId/edit"
            element={<VisitEdit />}
          />
        </Routes>
      </div>
    </BrowserRouter>
  );
}
