import { BrowserRouter, Routes, Route, Link, Navigate } from 'react-router-dom';
import OwnerList from './components/owners/OwnerList';
import OwnerDetail from './components/owners/OwnerDetail';
import OwnerAdd from './components/owners/OwnerAdd';
import OwnerEdit from './components/owners/OwnerEdit';
import PetList from './components/pets/PetList';
import PetAdd from './components/pets/PetAdd';
import PetEdit from './components/pets/PetEdit';
import VisitList from './components/visits/VisitList';
import VisitAdd from './components/visits/VisitAdd';
import VisitEdit from './components/visits/VisitEdit';

export default function App() {
  return (
    <BrowserRouter>
      <nav style={{ padding: 16, borderBottom: '1px solid #ccc', marginBottom: 16 }}>
        <Link to="/owners" style={{ marginRight: 16 }}>
          Owners
        </Link>
        <Link to="/pets" style={{ marginRight: 16 }}>
          Pets
        </Link>
        <Link to="/visits">Visits</Link>
      </nav>
      <div style={{ padding: 16 }}>
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
          <Route path="/visits" element={<VisitList />} />
          <Route path="/visits/add" element={<VisitAdd />} />
          <Route path="/visits/:id/edit" element={<VisitEdit />} />
        </Routes>
      </div>
    </BrowserRouter>
  );
}
