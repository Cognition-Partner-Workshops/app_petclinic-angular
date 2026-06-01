import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import Navbar from './components/parts/Navbar';
import Welcome from './components/parts/Welcome';
import PageNotFound from './components/parts/PageNotFound';
import OwnerList from './components/owners/OwnerList';
import OwnerAdd from './components/owners/OwnerAdd';
import OwnerDetail from './components/owners/OwnerDetail';
import OwnerEdit from './components/owners/OwnerEdit';
import PetAdd from './components/pets/PetAdd';
import PetEdit from './components/pets/PetEdit';
import VisitAdd from './components/visits/VisitAdd';
import VisitEdit from './components/visits/VisitEdit';
import VetList from './components/vets/VetList';
import VetAdd from './components/vets/VetAdd';
import VetEdit from './components/vets/VetEdit';

export default function App() {
  return (
    <BrowserRouter>
      <Navbar />
      <div className="content-wrapper">
        <Routes>
          <Route path="/" element={<Navigate to="/welcome" replace />} />
          <Route path="/welcome" element={<Welcome />} />

          {/* Owners */}
          <Route path="/owners" element={<OwnerList />} />
          <Route path="/owners/add" element={<OwnerAdd />} />
          <Route path="/owners/:id" element={<OwnerDetail />} />
          <Route path="/owners/:id/edit" element={<OwnerEdit />} />
          <Route path="/owners/:id/pets/add" element={<PetAdd />} />

          {/* Pets */}
          <Route path="/pets/:id/edit" element={<PetEdit />} />
          <Route path="/pets/:id/visits/add" element={<VisitAdd />} />

          {/* Visits */}
          <Route path="/visits/:id/edit" element={<VisitEdit />} />

          {/* Vets */}
          <Route path="/vets" element={<VetList />} />
          <Route path="/vets/add" element={<VetAdd />} />
          <Route path="/vets/:id/edit" element={<VetEdit />} />

          <Route path="*" element={<PageNotFound />} />
        </Routes>
      </div>
    </BrowserRouter>
  );
}
