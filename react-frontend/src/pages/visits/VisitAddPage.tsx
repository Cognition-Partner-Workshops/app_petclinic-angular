import { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useQuery, useMutation } from '@tanstack/react-query';
import {
  Typography,
  TextField,
  Button,
  Box,
  Alert,
  CircularProgress,
} from '@mui/material';
import { petApi } from '../../api/petApi';
import { ownerApi } from '../../api/ownerApi';
import { visitApi } from '../../api/visitApi';
import dayjs from 'dayjs';

export default function VisitAddPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const petId = Number(id);

  const { data: pet, isLoading: petLoading } = useQuery({
    queryKey: ['pet', petId],
    queryFn: () => petApi.getById(petId),
  });

  const { data: owner } = useQuery({
    queryKey: ['owner', pet?.ownerId],
    queryFn: () => ownerApi.getById(pet!.ownerId),
    enabled: !!pet?.ownerId,
  });

  const [form, setForm] = useState({
    date: dayjs().format('YYYY-MM-DD'),
    description: '',
  });

  const mutation = useMutation({
    mutationFn: () =>
      visitApi.create(pet!.ownerId, petId, {
        date: form.date,
        description: form.description,
        pet: pet,
      }),
    onSuccess: () => {
      if (owner) navigate(`/owners/${owner.id}`);
      else navigate('/owners');
    },
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    mutation.mutate();
  };

  if (petLoading) return <CircularProgress />;

  return (
    <>
      <Typography variant="h4" gutterBottom>
        Add Visit
      </Typography>
      {pet && (
        <Typography variant="subtitle1" color="text.secondary" gutterBottom>
          Pet: {pet.name} {pet.type?.name ? `(${pet.type.name})` : ''}
        </Typography>
      )}
      {owner && (
        <Typography variant="subtitle2" color="text.secondary" gutterBottom>
          Owner: {owner.firstName} {owner.lastName}
        </Typography>
      )}

      {mutation.isError && <Alert severity="error" sx={{ mb: 2 }}>Failed to add visit.</Alert>}

      <Box component="form" onSubmit={handleSubmit} sx={{ maxWidth: 600 }}>
        <TextField
          label="Date"
          type="date"
          fullWidth
          required
          margin="normal"
          slotProps={{ inputLabel: { shrink: true } }}
          value={form.date}
          onChange={(e) => setForm((prev) => ({ ...prev, date: e.target.value }))}
        />
        <TextField
          label="Description"
          fullWidth
          required
          margin="normal"
          multiline
          rows={3}
          value={form.description}
          onChange={(e) => setForm((prev) => ({ ...prev, description: e.target.value }))}
        />
        <Box sx={{ mt: 2, display: 'flex', gap: 2 }}>
          <Button type="submit" variant="contained" disabled={mutation.isPending}>
            Save
          </Button>
          <Button
            variant="outlined"
            onClick={() =>
              owner ? navigate(`/owners/${owner.id}`) : navigate('/owners')
            }
          >
            Cancel
          </Button>
        </Box>
      </Box>
    </>
  );
}
