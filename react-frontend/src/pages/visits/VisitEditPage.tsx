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
import { visitApi } from '../../api/visitApi';
import { petApi } from '../../api/petApi';
import { ownerApi } from '../../api/ownerApi';

export default function VisitEditPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const visitId = Number(id);

  const { data: visit, isLoading: visitLoading } = useQuery({
    queryKey: ['visit', visitId],
    queryFn: () => visitApi.getById(visitId),
  });

  const { data: pet } = useQuery({
    queryKey: ['pet', visit?.petId],
    queryFn: () => petApi.getById(visit!.petId!),
    enabled: !!visit?.petId,
  });

  const { data: owner } = useQuery({
    queryKey: ['owner', pet?.ownerId],
    queryFn: () => ownerApi.getById(pet!.ownerId),
    enabled: !!pet?.ownerId,
  });

  const [overrides, setOverrides] = useState<Record<string, string>>({});

  const defaults = {
    date: visit?.date ?? '',
    description: visit?.description ?? '',
  };

  const getValue = (field: keyof typeof defaults) => {
    if (field in overrides) return overrides[field];
    return defaults[field];
  };

  const mutation = useMutation({
    mutationFn: () =>
      visitApi.update(visitId, {
        ...visit,
        date: getValue('date'),
        description: getValue('description'),
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

  if (visitLoading) return <CircularProgress />;

  return (
    <>
      <Typography variant="h4" gutterBottom>
        Edit Visit
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

      {mutation.isError && <Alert severity="error" sx={{ mb: 2 }}>Failed to update visit.</Alert>}

      <Box component="form" onSubmit={handleSubmit} sx={{ maxWidth: 600 }}>
        <TextField
          label="Date"
          type="date"
          fullWidth
          required
          margin="normal"
          slotProps={{ inputLabel: { shrink: true } }}
          value={getValue('date')}
          onChange={(e) => setOverrides((prev) => ({ ...prev, date: e.target.value }))}
        />
        <TextField
          label="Description"
          fullWidth
          required
          margin="normal"
          multiline
          rows={3}
          value={getValue('description')}
          onChange={(e) => setOverrides((prev) => ({ ...prev, description: e.target.value }))}
        />
        <Box sx={{ mt: 2, display: 'flex', gap: 2 }}>
          <Button type="submit" variant="contained" disabled={mutation.isPending}>
            Update
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
