import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import {
  Typography,
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
  IconButton,
  TextField,
} from '@mui/material';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import { petTypeApi } from '../../api/petTypeApi';

export default function PetTypeListPage() {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const [showAdd, setShowAdd] = useState(false);
  const [newName, setNewName] = useState('');

  const { data: petTypes, isLoading, error } = useQuery({
    queryKey: ['petTypes'],
    queryFn: () => petTypeApi.getAll(),
  });

  const deleteMutation = useMutation({
    mutationFn: (id: number) => petTypeApi.remove(id),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['petTypes'] }),
  });

  const addMutation = useMutation({
    mutationFn: () => petTypeApi.create({ name: newName }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['petTypes'] });
      setNewName('');
      setShowAdd(false);
    },
  });

  const handleAddSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (newName.trim()) addMutation.mutate();
  };

  return (
    <>
      <Typography variant="h4" gutterBottom>
        Pet Types
      </Typography>

      <Box sx={{ mb: 2 }}>
        <Button variant="outlined" onClick={() => setShowAdd(!showAdd)}>
          {showAdd ? 'Cancel' : 'Add Pet Type'}
        </Button>
      </Box>

      {showAdd && (
        <Box component="form" onSubmit={handleAddSubmit} sx={{ mb: 3, display: 'flex', gap: 2, alignItems: 'center' }}>
          <TextField
            label="Name"
            size="small"
            required
            value={newName}
            onChange={(e) => setNewName(e.target.value)}
          />
          <Button type="submit" variant="contained" disabled={addMutation.isPending}>
            Save
          </Button>
          {addMutation.isError && <Alert severity="error">Failed to add pet type.</Alert>}
        </Box>
      )}

      {isLoading && <CircularProgress />}
      {error && <Alert severity="error">Failed to load pet types.</Alert>}

      {petTypes && petTypes.length > 0 && (
        <TableContainer component={Paper}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Name</TableCell>
                <TableCell align="right">Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {petTypes.map((pt) => (
                <TableRow key={pt.id}>
                  <TableCell>{pt.name}</TableCell>
                  <TableCell align="right">
                    <IconButton
                      size="small"
                      onClick={() => navigate(`/pettypes/${pt.id}/edit`)}
                    >
                      <EditIcon fontSize="small" />
                    </IconButton>
                    <IconButton
                      size="small"
                      color="error"
                      onClick={() => deleteMutation.mutate(pt.id)}
                    >
                      <DeleteIcon fontSize="small" />
                    </IconButton>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      )}

      {petTypes && petTypes.length === 0 && <Alert severity="info">No pet types found.</Alert>}
    </>
  );
}
