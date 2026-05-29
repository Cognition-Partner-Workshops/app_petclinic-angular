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
import { specialtyApi } from '../../api/specialtyApi';

export default function SpecialtyListPage() {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const [showAdd, setShowAdd] = useState(false);
  const [newName, setNewName] = useState('');

  const { data: specialties, isLoading, error } = useQuery({
    queryKey: ['specialties'],
    queryFn: () => specialtyApi.getAll(),
  });

  const deleteMutation = useMutation({
    mutationFn: (id: number) => specialtyApi.remove(id),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['specialties'] }),
  });

  const addMutation = useMutation({
    mutationFn: () => specialtyApi.create({ name: newName }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['specialties'] });
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
        Specialties
      </Typography>

      <Box sx={{ mb: 2 }}>
        <Button variant="outlined" onClick={() => setShowAdd(!showAdd)}>
          {showAdd ? 'Cancel' : 'Add Specialty'}
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
          {addMutation.isError && <Alert severity="error">Failed to add specialty.</Alert>}
        </Box>
      )}

      {isLoading && <CircularProgress />}
      {error && <Alert severity="error">Failed to load specialties.</Alert>}

      {specialties && specialties.length > 0 && (
        <TableContainer component={Paper}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Name</TableCell>
                <TableCell align="right">Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {specialties.map((s) => (
                <TableRow key={s.id}>
                  <TableCell>{s.name}</TableCell>
                  <TableCell align="right">
                    <IconButton
                      size="small"
                      onClick={() => navigate(`/specialties/${s.id}/edit`)}
                    >
                      <EditIcon fontSize="small" />
                    </IconButton>
                    <IconButton
                      size="small"
                      color="error"
                      onClick={() => deleteMutation.mutate(s.id)}
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

      {specialties && specialties.length === 0 && <Alert severity="info">No specialties found.</Alert>}
    </>
  );
}
