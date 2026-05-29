import { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useQuery, useMutation } from '@tanstack/react-query';
import { Typography, TextField, Button, Box, Alert, CircularProgress } from '@mui/material';
import { ownerApi } from '../../api/ownerApi';

export default function OwnerEditPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const ownerId = Number(id);

  const { data: owner, isLoading, error: loadError } = useQuery({
    queryKey: ['owner', ownerId],
    queryFn: () => ownerApi.getById(ownerId),
  });

  const [overrides, setOverrides] = useState<Record<string, string>>({});

  const getValue = (field: keyof typeof defaults) => {
    if (field in overrides) return overrides[field];
    return defaults[field];
  };

  const defaults = {
    firstName: owner?.firstName ?? '',
    lastName: owner?.lastName ?? '',
    address: owner?.address ?? '',
    city: owner?.city ?? '',
    telephone: owner?.telephone ?? '',
  };

  const mutation = useMutation({
    mutationFn: () =>
      ownerApi.update(ownerId, {
        ...owner!,
        firstName: getValue('firstName'),
        lastName: getValue('lastName'),
        address: getValue('address'),
        city: getValue('city'),
        telephone: getValue('telephone'),
      }),
    onSuccess: () => navigate(`/owners/${ownerId}`),
  });

  const handleChange = (field: string) => (e: React.ChangeEvent<HTMLInputElement>) => {
    setOverrides((prev) => ({ ...prev, [field]: e.target.value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    mutation.mutate();
  };

  if (isLoading) return <CircularProgress />;
  if (loadError) return <Alert severity="error">Failed to load owner.</Alert>;

  return (
    <>
      <Typography variant="h4" gutterBottom>
        Edit Owner
      </Typography>

      {mutation.isError && <Alert severity="error" sx={{ mb: 2 }}>Failed to update owner.</Alert>}

      <Box component="form" onSubmit={handleSubmit} sx={{ maxWidth: 600 }}>
        <TextField
          label="First Name"
          fullWidth
          required
          margin="normal"
          slotProps={{ htmlInput: { minLength: 1, maxLength: 30, pattern: '^[a-zA-Z]*$' } }}
          value={getValue('firstName')}
          onChange={handleChange('firstName')}
        />
        <TextField
          label="Last Name"
          fullWidth
          required
          margin="normal"
          slotProps={{ htmlInput: { minLength: 1, maxLength: 30, pattern: '^[a-zA-Z]*$' } }}
          value={getValue('lastName')}
          onChange={handleChange('lastName')}
        />
        <TextField
          label="Address"
          fullWidth
          required
          margin="normal"
          slotProps={{ htmlInput: { maxLength: 255 } }}
          value={getValue('address')}
          onChange={handleChange('address')}
        />
        <TextField
          label="City"
          fullWidth
          required
          margin="normal"
          slotProps={{ htmlInput: { maxLength: 80 } }}
          value={getValue('city')}
          onChange={handleChange('city')}
        />
        <TextField
          label="Telephone"
          fullWidth
          required
          margin="normal"
          slotProps={{ htmlInput: { minLength: 1, maxLength: 20, pattern: '^[0-9]*$' } }}
          value={getValue('telephone')}
          onChange={handleChange('telephone')}
        />
        <Box sx={{ mt: 2, display: 'flex', gap: 2 }}>
          <Button type="submit" variant="contained" disabled={mutation.isPending}>
            Update
          </Button>
          <Button variant="outlined" onClick={() => navigate(`/owners/${ownerId}`)}>
            Cancel
          </Button>
        </Box>
      </Box>
    </>
  );
}
