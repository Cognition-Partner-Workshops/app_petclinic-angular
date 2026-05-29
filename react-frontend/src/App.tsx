import { Routes, Route, Navigate } from 'react-router-dom';
import AppNavbar from './components/AppNavbar';
import WelcomePage from './pages/WelcomePage';
import NotFoundPage from './pages/NotFoundPage';
import OwnerListPage from './pages/owners/OwnerListPage';
import OwnerAddPage from './pages/owners/OwnerAddPage';
import OwnerDetailPage from './pages/owners/OwnerDetailPage';
import OwnerEditPage from './pages/owners/OwnerEditPage';
import PetAddPage from './pages/pets/PetAddPage';
import PetEditPage from './pages/pets/PetEditPage';
import VisitAddPage from './pages/visits/VisitAddPage';
import VisitEditPage from './pages/visits/VisitEditPage';
import VetListPage from './pages/vets/VetListPage';
import VetAddPage from './pages/vets/VetAddPage';
import VetEditPage from './pages/vets/VetEditPage';
import PetTypeListPage from './pages/pettypes/PetTypeListPage';
import PetTypeEditPage from './pages/pettypes/PetTypeEditPage';
import SpecialtyListPage from './pages/specialties/SpecialtyListPage';
import SpecialtyEditPage from './pages/specialties/SpecialtyEditPage';
import { Box, Container } from '@mui/material';

export default function App() {
  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
      <AppNavbar />
      <Container maxWidth="lg" sx={{ mt: 3, mb: 3, flex: 1 }}>
        <Routes>
          <Route path="/" element={<Navigate to="/welcome" replace />} />
          <Route path="/welcome" element={<WelcomePage />} />

          <Route path="/owners" element={<OwnerListPage />} />
          <Route path="/owners/add" element={<OwnerAddPage />} />
          <Route path="/owners/:id" element={<OwnerDetailPage />} />
          <Route path="/owners/:id/edit" element={<OwnerEditPage />} />
          <Route path="/owners/:id/pets/add" element={<PetAddPage />} />

          <Route path="/pets/:id/edit" element={<PetEditPage />} />
          <Route path="/pets/:id/visits/add" element={<VisitAddPage />} />

          <Route path="/visits/:id/edit" element={<VisitEditPage />} />

          <Route path="/vets" element={<VetListPage />} />
          <Route path="/vets/add" element={<VetAddPage />} />
          <Route path="/vets/:id/edit" element={<VetEditPage />} />

          <Route path="/pettypes" element={<PetTypeListPage />} />
          <Route path="/pettypes/:id/edit" element={<PetTypeEditPage />} />

          <Route path="/specialties" element={<SpecialtyListPage />} />
          <Route path="/specialties/:id/edit" element={<SpecialtyEditPage />} />

          <Route path="*" element={<NotFoundPage />} />
        </Routes>
      </Container>
    </Box>
  );
}
