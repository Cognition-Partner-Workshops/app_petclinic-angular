import { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useQuery, useMutation } from '@tanstack/react-query';
import { Typography, TextField, Button, Box, Alert, CircularProgress } from '@mui/material';
import { specialtyApi } from '../../api/specialtyApi';

export default function SpecialtyEditPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const specId = Number(id);

  const { data: specialty, isLoading } = useQuery({
    queryKey: ['specialty', specId],
    queryFn: () => specialtyApi.getById(specId),
  });

  const [nameOverride, setNameOverride] = useState<string | null>(null);
  const name = nameOverride ?? specialty?.name ?? '';

  const mutation = useMutation({
    mutationFn: () => specialtyApi.update(specId, { id: specId, name }),
    onSuccess: () => navigate('/specialties'),
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    mutation.mutate();
  };

  if (isLoading) return <CircularProgress />;

  return (
    <>
      <Typography variant="h4" gutterBottom>
        Edit Specialty
      </Typography>

      {mutation.isError && <Alert severity="error" sx={{ mb: 2 }}>Failed to update specialty.</Alert>}

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
          <Button variant="outlined" onClick={() => navigate('/specialties')}>
            Cancel
          </Button>
        </Box>
      </Box>
    </>
  );
}
