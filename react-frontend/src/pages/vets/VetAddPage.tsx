import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
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
import { vetApi } from '../../api/vetApi';
import { specialtyApi } from '../../api/specialtyApi';

export default function VetAddPage() {
  const navigate = useNavigate();

  const { data: specialties, isLoading: specsLoading } = useQuery({
    queryKey: ['specialties'],
    queryFn: () => specialtyApi.getAll(),
  });

  const [form, setForm] = useState({
    firstName: '',
    lastName: '',
    specialtyId: '',
  });

  const mutation = useMutation({
    mutationFn: () => {
      const selectedSpec = specialties?.find((s) => s.id === Number(form.specialtyId));
      return vetApi.create({
        firstName: form.firstName,
        lastName: form.lastName,
        specialties: selectedSpec ? [selectedSpec] : [],
      });
    },
    onSuccess: () => navigate('/vets'),
  });

  const handleChange = (field: string) => (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm((prev) => ({ ...prev, [field]: e.target.value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    mutation.mutate();
  };

  if (specsLoading) return <CircularProgress />;

  return (
    <>
      <Typography variant="h4" gutterBottom>
        Add Veterinarian
      </Typography>

      {mutation.isError && <Alert severity="error" sx={{ mb: 2 }}>Failed to add veterinarian.</Alert>}

      <Box component="form" onSubmit={handleSubmit} sx={{ maxWidth: 600 }}>
        <TextField
          label="First Name"
          fullWidth
          required
          margin="normal"
          slotProps={{ htmlInput: { minLength: 2 } }}
          value={form.firstName}
          onChange={handleChange('firstName')}
        />
        <TextField
          label="Last Name"
          fullWidth
          required
          margin="normal"
          slotProps={{ htmlInput: { minLength: 2 } }}
          value={form.lastName}
          onChange={handleChange('lastName')}
        />
        <TextField
          label="Specialty"
          select
          fullWidth
          margin="normal"
          value={form.specialtyId}
          onChange={handleChange('specialtyId')}
        >
          <MenuItem value="">None</MenuItem>
          {specialties?.map((s) => (
            <MenuItem key={s.id} value={s.id}>
              {s.name}
            </MenuItem>
          ))}
        </TextField>
        <Box sx={{ mt: 2, display: 'flex', gap: 2 }}>
          <Button type="submit" variant="contained" disabled={mutation.isPending}>
            Save
          </Button>
          <Button variant="outlined" onClick={() => navigate('/vets')}>
            Cancel
          </Button>
        </Box>
      </Box>
    </>
  );
}
