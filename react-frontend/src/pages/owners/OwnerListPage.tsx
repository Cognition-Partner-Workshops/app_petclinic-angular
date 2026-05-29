import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import {
  Typography,
  TextField,
  Button,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Box,
  CircularProgress,
  Alert,
} from '@mui/material';
import { ownerApi } from '../../api/ownerApi';

export default function OwnerListPage() {
  const navigate = useNavigate();
  const [lastName, setLastName] = useState('');
  const [searchTerm, setSearchTerm] = useState<string | undefined>(undefined);

  const { data: owners, isLoading, error } = useQuery({
    queryKey: ['owners', searchTerm],
    queryFn: () =>
      searchTerm !== undefined
        ? ownerApi.search(searchTerm)
        : ownerApi.getAll(),
  });

  const handleSearch = () => {
    setSearchTerm(lastName);
  };

  return (
    <>
      <Typography variant="h4" gutterBottom>
        Owners
      </Typography>

      <Box sx={{ display: 'flex', gap: 2, mb: 3, alignItems: 'center' }}>
        <TextField
          label="Last Name"
          size="small"
          value={lastName}
          onChange={(e) => setLastName(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
        />
        <Button variant="contained" onClick={handleSearch}>
          Search
        </Button>
        <Button variant="outlined" onClick={() => navigate('/owners/add')}>
          Add Owner
        </Button>
      </Box>

      {isLoading && <CircularProgress />}
      {error && <Alert severity="error">Failed to load owners.</Alert>}

      {owners && owners.length > 0 && (
        <TableContainer component={Paper}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Name</TableCell>
                <TableCell>Address</TableCell>
                <TableCell>City</TableCell>
                <TableCell>Telephone</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {owners.map((owner) => (
                <TableRow
                  key={owner.id}
                  hover
                  sx={{ cursor: 'pointer' }}
                  onClick={() => navigate(`/owners/${owner.id}`)}
                >
                  <TableCell>
                    {owner.firstName} {owner.lastName}
                  </TableCell>
                  <TableCell>{owner.address}</TableCell>
                  <TableCell>{owner.city}</TableCell>
                  <TableCell>{owner.telephone}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      )}

      {owners && owners.length === 0 && (
        <Alert severity="info">No owners found.</Alert>
      )}
    </>
  );
}
