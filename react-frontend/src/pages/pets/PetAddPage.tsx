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
import { ownerApi } from '../../api/ownerApi';
import { petApi } from '../../api/petApi';
import { petTypeApi } from '../../api/petTypeApi';
import dayjs from 'dayjs';

export default function PetAddPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const ownerId = Number(id);

  const { data: owner, isLoading: ownerLoading } = useQuery({
    queryKey: ['owner', ownerId],
    queryFn: () => ownerApi.getById(ownerId),
  });

  const { data: petTypes, isLoading: typesLoading } = useQuery({
    queryKey: ['petTypes'],
    queryFn: () => petTypeApi.getAll(),
  });

  const [form, setForm] = useState({
    name: '',
    birthDate: dayjs().format('YYYY-MM-DD'),
    typeId: '',
  });

  const mutation = useMutation({
    mutationFn: () => {
      const selectedType = petTypes?.find((t) => t.id === Number(form.typeId));
      return petApi.create(ownerId, {
        name: form.name,
        birthDate: form.birthDate,
        type: selectedType,
        owner: owner,
      });
    },
    onSuccess: () => navigate(`/owners/${ownerId}`),
  });

  const handleChange = (field: string) => (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm((prev) => ({ ...prev, [field]: e.target.value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    mutation.mutate();
  };

  if (ownerLoading || typesLoading) return <CircularProgress />;

  return (
    <>
      <Typography variant="h4" gutterBottom>
        Add Pet for {owner?.firstName} {owner?.lastName}
      </Typography>

      {mutation.isError && <Alert severity="error" sx={{ mb: 2 }}>Failed to add pet.</Alert>}

      <Box component="form" onSubmit={handleSubmit} sx={{ maxWidth: 600 }}>
        <TextField
          label="Name"
          fullWidth
          required
          margin="normal"
          value={form.name}
          onChange={handleChange('name')}
        />
        <TextField
          label="Birth Date"
          type="date"
          fullWidth
          required
          margin="normal"
          slotProps={{ inputLabel: { shrink: true } }}
          value={form.birthDate}
          onChange={handleChange('birthDate')}
        />
        <TextField
          label="Type"
          select
          fullWidth
          required
          margin="normal"
          value={form.typeId}
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
            Save
          </Button>
          <Button variant="outlined" onClick={() => navigate(`/owners/${ownerId}`)}>
            Cancel
          </Button>
        </Box>
      </Box>
    </>
  );
}
