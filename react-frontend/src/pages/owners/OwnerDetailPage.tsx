import { useParams, useNavigate } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import {
  Typography,
  Button,
  Box,
  CircularProgress,
  Alert,
  Card,
  CardContent,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Chip,
  IconButton,
} from '@mui/material';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import AddIcon from '@mui/icons-material/Add';
import { ownerApi } from '../../api/ownerApi';
import { petApi } from '../../api/petApi';
import { visitApi } from '../../api/visitApi';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import type { Pet, Visit } from '../../models';

export default function OwnerDetailPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const ownerId = Number(id);

  const { data: owner, isLoading, error } = useQuery({
    queryKey: ['owner', ownerId],
    queryFn: () => ownerApi.getById(ownerId),
  });

  const deletePetMutation = useMutation({
    mutationFn: (petId: number) => petApi.remove(petId),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['owner', ownerId] }),
  });

  const deleteVisitMutation = useMutation({
    mutationFn: (visitId: number) => visitApi.remove(visitId),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['owner', ownerId] }),
  });

  if (isLoading) return <CircularProgress />;
  if (error || !owner) return <Alert severity="error">Failed to load owner.</Alert>;

  return (
    <>
      <Typography variant="h4" gutterBottom>
        Owner Details
      </Typography>

      <Card sx={{ mb: 3 }}>
        <CardContent>
          <Typography variant="h6">
            {owner.firstName} {owner.lastName}
          </Typography>
          <Typography color="text.secondary">Address: {owner.address}</Typography>
          <Typography color="text.secondary">City: {owner.city}</Typography>
          <Typography color="text.secondary">Telephone: {owner.telephone}</Typography>
          <Box sx={{ mt: 2, display: 'flex', gap: 1 }}>
            <Button
              variant="contained"
              size="small"
              startIcon={<EditIcon />}
              onClick={() => navigate(`/owners/${owner.id}/edit`)}
            >
              Edit Owner
            </Button>
            <Button
              variant="outlined"
              size="small"
              startIcon={<AddIcon />}
              onClick={() => navigate(`/owners/${owner.id}/pets/add`)}
            >
              Add Pet
            </Button>
            <Button variant="outlined" size="small" onClick={() => navigate('/owners')}>
              Back
            </Button>
          </Box>
        </CardContent>
      </Card>

      {owner.pets && owner.pets.length > 0 && (
        <>
          <Typography variant="h5" gutterBottom>
            Pets
          </Typography>
          {owner.pets.map((pet: Pet) => (
            <Card key={pet.id} sx={{ mb: 2 }}>
              <CardContent>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                  <Typography variant="h6">{pet.name}</Typography>
                  {pet.type && <Chip label={pet.type.name} size="small" />}
                </Box>
                <Typography variant="body2" color="text.secondary">
                  Birth Date: {pet.birthDate}
                </Typography>
                <Box sx={{ mt: 1, display: 'flex', gap: 1 }}>
                  <Button
                    size="small"
                    startIcon={<EditIcon />}
                    onClick={() => navigate(`/pets/${pet.id}/edit`)}
                  >
                    Edit
                  </Button>
                  <Button
                    size="small"
                    startIcon={<AddIcon />}
                    onClick={() => navigate(`/pets/${pet.id}/visits/add`)}
                  >
                    Add Visit
                  </Button>
                  <IconButton
                    size="small"
                    color="error"
                    onClick={() => deletePetMutation.mutate(pet.id)}
                  >
                    <DeleteIcon fontSize="small" />
                  </IconButton>
                </Box>

                {pet.visits && pet.visits.length > 0 && (
                  <TableContainer component={Paper} variant="outlined" sx={{ mt: 2 }}>
                    <Table size="small">
                      <TableHead>
                        <TableRow>
                          <TableCell>Date</TableCell>
                          <TableCell>Description</TableCell>
                          <TableCell align="right">Actions</TableCell>
                        </TableRow>
                      </TableHead>
                      <TableBody>
                        {pet.visits.map((visit: Visit) => (
                          <TableRow key={visit.id}>
                            <TableCell>{visit.date}</TableCell>
                            <TableCell>{visit.description}</TableCell>
                            <TableCell align="right">
                              <IconButton
                                size="small"
                                onClick={() => navigate(`/visits/${visit.id}/edit`)}
                              >
                                <EditIcon fontSize="small" />
                              </IconButton>
                              <IconButton
                                size="small"
                                color="error"
                                onClick={() => deleteVisitMutation.mutate(visit.id)}
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
              </CardContent>
            </Card>
          ))}
        </>
      )}
    </>
  );
}
