import { Routes, Route, Navigate } from 'react-router-dom'
import Layout from './components/layout/Layout'
import OwnerList from './components/owners/OwnerList'
import OwnerAdd from './components/owners/OwnerAdd'
import OwnerDetail from './components/owners/OwnerDetail'
import OwnerEdit from './components/owners/OwnerEdit'
import PetList from './components/pets/PetList'
import PetAdd from './components/pets/PetAdd'
import PetEdit from './components/pets/PetEdit'
import VisitList from './components/visits/VisitList'
import VisitAdd from './components/visits/VisitAdd'
import VisitEdit from './components/visits/VisitEdit'

function App() {
  return (
    <Routes>
      <Route element={<Layout />}>
        <Route path="/" element={<Navigate to="/owners" replace />} />

        {/* Owner routes */}
        <Route path="/owners" element={<OwnerList />} />
        <Route path="/owners/add" element={<OwnerAdd />} />
        <Route path="/owners/:id" element={<OwnerDetail />} />
        <Route path="/owners/:id/edit" element={<OwnerEdit />} />
        <Route path="/owners/:id/pets/add" element={<PetAdd />} />

        {/* Pet routes */}
        <Route path="/pets" element={<PetList />} />
        <Route path="/pets/add" element={<PetAdd />} />
        <Route path="/pets/:id/edit" element={<PetEdit />} />
        <Route path="/pets/:id/visits/add" element={<VisitAdd />} />

        {/* Visit routes */}
        <Route path="/visits" element={<VisitList />} />
        <Route path="/visits/add" element={<VisitAdd />} />
        <Route path="/visits/:id/edit" element={<VisitEdit />} />
      </Route>
    </Routes>
  )
}

export default App
