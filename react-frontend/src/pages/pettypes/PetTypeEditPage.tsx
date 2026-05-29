import { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useQuery, useMutation } from '@tanstack/react-query';
import { Typography, TextField, Button, Box, Alert, CircularProgress } from '@mui/material';
import { petTypeApi } from '../../api/petTypeApi';

export default function PetTypeEditPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const typeId = Number(id);

  const { data: petType, isLoading } = useQuery({
    queryKey: ['petType', typeId],
    queryFn: () => petTypeApi.getById(typeId),
  });

  const [nameOverride, setNameOverride] = useState<string | null>(null);
  const name = nameOverride ?? petType?.name ?? '';

  const mutation = useMutation({
    mutationFn: () => petTypeApi.update(typeId, { id: typeId, name }),
    onSuccess: () => navigate('/pettypes'),
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    mutation.mutate();
  };

  if (isLoading) return <CircularProgress />;

  return (
    <>
      <Typography variant="h4" gutterBottom>
        Edit Pet Type
      </Typography>

      {mutation.isError && <Alert severity="error" sx={{ mb: 2 }}>Failed to update pet type.</Alert>}

      <Box component="form" onSubmit={handleSubmit} sx={{ maxWidth: 600 }}>
        <TextField
          label="Name"
          fullWidth
          required
          margin="normal"
          value={name}
          onChange={(e) => setNameOverride(e.target.value)}
        />
        <Box sx={{ mt: 2, display: 'flex', gap: 2 }}>
          <Button type="submit" variant="contained" disabled={mutation.isPending}>
            Update
          </Button>
          <Button variant="outlined" onClick={() => navigate('/pettypes')}>
            Cancel
          </Button>
        </Box>
      </Box>
    </>
  );
}
