import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  AppBar,
  Toolbar,
  Typography,
  Button,
  Menu,
  MenuItem,
  Box,
} from '@mui/material';
import HomeIcon from '@mui/icons-material/Home';
import PersonIcon from '@mui/icons-material/Person';
import LocalHospitalIcon from '@mui/icons-material/LocalHospital';
import PetsIcon from '@mui/icons-material/Pets';
import ListIcon from '@mui/icons-material/List';

export default function AppNavbar() {
  const navigate = useNavigate();
  const [ownerAnchor, setOwnerAnchor] = useState<null | HTMLElement>(null);
  const [vetAnchor, setVetAnchor] = useState<null | HTMLElement>(null);

  return (
    <AppBar position="static">
      <Toolbar>
        <Typography variant="h6" sx={{ mr: 2, cursor: 'pointer' }} onClick={() => navigate('/welcome')}>
          PetClinic
        </Typography>

        <Button color="inherit" startIcon={<HomeIcon />} onClick={() => navigate('/welcome')}>
          Home
        </Button>

        <Button
          color="inherit"
          startIcon={<PersonIcon />}
          onClick={(e) => setOwnerAnchor(e.currentTarget)}
        >
          Owners
        </Button>
        <Menu
          anchorEl={ownerAnchor}
          open={Boolean(ownerAnchor)}
          onClose={() => setOwnerAnchor(null)}
        >
          <MenuItem
            onClick={() => {
              setOwnerAnchor(null);
              navigate('/owners');
            }}
          >
            Search
          </MenuItem>
          <MenuItem
            onClick={() => {
              setOwnerAnchor(null);
              navigate('/owners/add');
            }}
          >
            Add New
          </MenuItem>
        </Menu>

        <Button
          color="inherit"
          startIcon={<LocalHospitalIcon />}
          onClick={(e) => setVetAnchor(e.currentTarget)}
        >
          Veterinarians
        </Button>
        <Menu
          anchorEl={vetAnchor}
          open={Boolean(vetAnchor)}
          onClose={() => setVetAnchor(null)}
        >
          <MenuItem
            onClick={() => {
              setVetAnchor(null);
              navigate('/vets');
            }}
          >
            All
          </MenuItem>
          <MenuItem
            onClick={() => {
              setVetAnchor(null);
              navigate('/vets/add');
            }}
          >
            Add New
          </MenuItem>
        </Menu>

        <Button color="inherit" startIcon={<PetsIcon />} onClick={() => navigate('/pettypes')}>
          Pet Types
        </Button>

        <Button color="inherit" startIcon={<ListIcon />} onClick={() => navigate('/specialties')}>
          Specialties
        </Button>

        <Box sx={{ flexGrow: 1 }} />
      </Toolbar>
    </AppBar>
  );
}
