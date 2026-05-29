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
  Autocomplete,
} from '@mui/material';
import { vetApi } from '../../api/vetApi';
import { specialtyApi } from '../../api/specialtyApi';
import type { Specialty } from '../../models';

export default function VetEditPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const vetId = Number(id);

  const { data: vet, isLoading: vetLoading } = useQuery({
    queryKey: ['vet', vetId],
    queryFn: () => vetApi.getById(vetId),
  });

  const { data: allSpecialties, isLoading: specsLoading } = useQuery({
    queryKey: ['specialties'],
    queryFn: () => specialtyApi.getAll(),
  });

  const [overrides, setOverrides] = useState<Record<string, string>>({});
  const [specsOverride, setSpecsOverride] = useState<Specialty[] | null>(null);

  const defaults = {
    firstName: vet?.firstName ?? '',
    lastName: vet?.lastName ?? '',
  };

  const getValue = (field: keyof typeof defaults) => {
    if (field in overrides) return overrides[field];
    return defaults[field];
  };

  const selectedSpecs = specsOverride ?? vet?.specialties ?? [];

  const mutation = useMutation({
    mutationFn: () =>
      vetApi.update(vetId, {
        id: vetId,
        firstName: getValue('firstName'),
        lastName: getValue('lastName'),
        specialties: selectedSpecs,
      }),
    onSuccess: () => navigate('/vets'),
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    mutation.mutate();
  };

  if (vetLoading || specsLoading) return <CircularProgress />;

  return (
    <>
      <Typography variant="h4" gutterBottom>
        Edit Veterinarian
      </Typography>

      {mutation.isError && <Alert severity="error" sx={{ mb: 2 }}>Failed to update veterinarian.</Alert>}

      <Box component="form" onSubmit={handleSubmit} sx={{ maxWidth: 600 }}>
        <TextField
          label="First Name"
          fullWidth
          required
          margin="normal"
          slotProps={{ htmlInput: { minLength: 2 } }}
          value={getValue('firstName')}
          onChange={(e) => setOverrides((prev) => ({ ...prev, firstName: e.target.value }))}
        />
        <TextField
          label="Last Name"
          fullWidth
          required
          margin="normal"
          slotProps={{ htmlInput: { minLength: 2 } }}
          value={getValue('lastName')}
          onChange={(e) => setOverrides((prev) => ({ ...prev, lastName: e.target.value }))}
        />
        <Autocomplete<Specialty, true>
          multiple
          options={allSpecialties || []}
          getOptionLabel={(option) => option.name}
          value={selectedSpecs}
          onChange={(_e, value) => setSpecsOverride(value)}
          isOptionEqualToValue={(option, value) => option.id === value.id}
          renderInput={(params) => (
            <TextField {...params} label="Specialties" margin="normal" />
          )}
        />
        <Box sx={{ mt: 2, display: 'flex', gap: 2 }}>
          <Button type="submit" variant="contained" disabled={mutation.isPending}>
            Update
          </Button>
          <Button variant="outlined" onClick={() => navigate('/vets')}>
            Cancel
          </Button>
        </Box>
      </Box>
    </>
  );
}
