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
  Chip,
  IconButton,
} from '@mui/material';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import { vetApi } from '../../api/vetApi';

export default function VetListPage() {
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  const { data: vets, isLoading, error } = useQuery({
    queryKey: ['vets'],
    queryFn: () => vetApi.getAll(),
  });

  const deleteMutation = useMutation({
    mutationFn: (id: number) => vetApi.remove(id),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['vets'] }),
  });

  return (
    <>
      <Typography variant="h4" gutterBottom>
        Veterinarians
      </Typography>

      <Box sx={{ mb: 2 }}>
        <Button variant="outlined" onClick={() => navigate('/vets/add')}>
          Add Vet
        </Button>
      </Box>

      {isLoading && <CircularProgress />}
      {error && <Alert severity="error">Failed to load veterinarians.</Alert>}

      {vets && vets.length > 0 && (
        <TableContainer component={Paper}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Name</TableCell>
                <TableCell>Specialties</TableCell>
                <TableCell align="right">Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {vets.map((vet) => (
                <TableRow key={vet.id}>
                  <TableCell>
                    {vet.firstName} {vet.lastName}
                  </TableCell>
                  <TableCell>
                    {vet.specialties && vet.specialties.length > 0
                      ? vet.specialties.map((s) => (
                          <Chip key={s.id} label={s.name} size="small" sx={{ mr: 0.5 }} />
                        ))
                      : 'none'}
                  </TableCell>
                  <TableCell align="right">
                    <IconButton
                      size="small"
                      onClick={() => navigate(`/vets/${vet.id}/edit`)}
                    >
                      <EditIcon fontSize="small" />
                    </IconButton>
                    <IconButton
                      size="small"
                      color="error"
                      onClick={() => deleteMutation.mutate(vet.id)}
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

      {vets && vets.length === 0 && <Alert severity="info">No veterinarians found.</Alert>}
    </>
  );
}
