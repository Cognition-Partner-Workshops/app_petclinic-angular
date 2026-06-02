import { Routes, Route } from 'react-router-dom';
import Navbar from './components/parts/Navbar';
import Welcome from './components/parts/Welcome';
import PageNotFound from './components/parts/PageNotFound';

import OwnerList from './components/owners/OwnerList';
import OwnerAdd from './components/owners/OwnerAdd';
import OwnerDetail from './components/owners/OwnerDetail';
import OwnerEdit from './components/owners/OwnerEdit';

import PetAdd from './components/pets/PetAdd';
import PetEdit from './components/pets/PetEdit';

import VisitList from './components/visits/VisitList';
import VisitAdd from './components/visits/VisitAdd';
import VisitEdit from './components/visits/VisitEdit';

import VetList from './components/vets/VetList';
import VetAdd from './components/vets/VetAdd';
import VetEdit from './components/vets/VetEdit';

import PetTypeList from './components/pettypes/PetTypeList';
import PetTypeAdd from './components/pettypes/PetTypeAdd';
import PetTypeEdit from './components/pettypes/PetTypeEdit';

import SpecialtyList from './components/specialties/SpecialtyList';
import SpecialtyAdd from './components/specialties/SpecialtyAdd';
import SpecialtyEdit from './components/specialties/SpecialtyEdit';

function App() {
  return (
    <>
      <Navbar />
      <div className="content-wrapper">
        <Routes>
          <Route path="/" element={<Welcome />} />
          <Route path="/welcome" element={<Welcome />} />

          <Route path="/owners" element={<OwnerList />} />
          <Route path="/owners/add" element={<OwnerAdd />} />
          <Route path="/owners/:id" element={<OwnerDetail />} />
          <Route path="/owners/:id/edit" element={<OwnerEdit />} />
          <Route path="/owners/:id/pets/add" element={<PetAdd />} />

          <Route path="/pets/:id/edit" element={<PetEdit />} />
          <Route path="/pets/:id/visits/add" element={<VisitAdd />} />

          <Route path="/visits" element={<VisitList />} />
          <Route path="/visits/add" element={<VisitAdd />} />
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

          <Route path="*" element={<PageNotFound />} />
        </Routes>
      </div>
    </>
  );
}

export default App;
