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
  MenuItem,
} from '@mui/material';
import { petApi } from '../../api/petApi';
import { petTypeApi } from '../../api/petTypeApi';
import { ownerApi } from '../../api/ownerApi';

export default function PetEditPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const petId = Number(id);

  const { data: pet, isLoading: petLoading } = useQuery({
    queryKey: ['pet', petId],
    queryFn: () => petApi.getById(petId),
  });

  const { data: petTypes, isLoading: typesLoading } = useQuery({
    queryKey: ['petTypes'],
    queryFn: () => petTypeApi.getAll(),
  });

  const { data: owner } = useQuery({
    queryKey: ['owner', pet?.ownerId],
    queryFn: () => ownerApi.getById(pet!.ownerId),
    enabled: !!pet?.ownerId,
  });

  const [overrides, setOverrides] = useState<Record<string, string>>({});

  const defaults = {
    name: pet?.name ?? '',
    birthDate: pet?.birthDate ?? '',
    typeId: pet?.type?.id?.toString() ?? '',
  };

  const getValue = (field: keyof typeof defaults) => {
    if (field in overrides) return overrides[field];
    return defaults[field];
  };

  const mutation = useMutation({
    mutationFn: () => {
      const selectedType = petTypes?.find((t) => t.id === Number(getValue('typeId')));
      return petApi.update(petId, {
        ...pet,
        name: getValue('name'),
        birthDate: getValue('birthDate'),
        type: selectedType ?? pet?.type,
      });
    },
    onSuccess: () => {
      if (owner) navigate(`/owners/${owner.id}`);
      else navigate('/owners');
    },
  });

  const handleChange = (field: string) => (e: React.ChangeEvent<HTMLInputElement>) => {
    setOverrides((prev) => ({ ...prev, [field]: e.target.value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    mutation.mutate();
  };

  if (petLoading || typesLoading) return <CircularProgress />;

  return (
    <>
      <Typography variant="h4" gutterBottom>
        Edit Pet
      </Typography>
      {owner && (
        <Typography variant="subtitle1" color="text.secondary" gutterBottom>
          Owner: {owner.firstName} {owner.lastName}
        </Typography>
      )}

      {mutation.isError && <Alert severity="error" sx={{ mb: 2 }}>Failed to update pet.</Alert>}

      <Box component="form" onSubmit={handleSubmit} sx={{ maxWidth: 600 }}>
        <TextField
          label="Name"
          fullWidth
          required
          margin="normal"
          value={getValue('name')}
          onChange={handleChange('name')}
        />
        <TextField
          label="Birth Date"
          type="date"
          fullWidth
          required
          margin="normal"
          slotProps={{ inputLabel: { shrink: true } }}
          value={getValue('birthDate')}
          onChange={handleChange('birthDate')}
        />
        <TextField
          label="Type"
          select
          fullWidth
          required
          margin="normal"
          value={getValue('typeId')}
          onChange={handleChange('typeId')}
        >
          {petTypes?.map((pt) => (
            <MenuItem key={pt.id} value={pt.id.toString()}>
              {pt.name}
            </MenuItem>
          ))}
        </TextField>
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
