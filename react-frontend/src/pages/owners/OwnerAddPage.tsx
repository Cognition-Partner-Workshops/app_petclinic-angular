import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useMutation } from '@tanstack/react-query';
import { Typography, TextField, Button, Box, Alert } from '@mui/material';
import { ownerApi } from '../../api/ownerApi';

export default function OwnerAddPage() {
  const navigate = useNavigate();
  const [form, setForm] = useState({
    firstName: '',
    lastName: '',
    address: '',
    city: '',
    telephone: '',
  });

  const mutation = useMutation({
    mutationFn: () => ownerApi.create(form),
    onSuccess: () => navigate('/owners'),
  });

  const handleChange = (field: string) => (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm((prev) => ({ ...prev, [field]: e.target.value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    mutation.mutate();
  };

  return (
    <>
      <Typography variant="h4" gutterBottom>
        New Owner
      </Typography>

      {mutation.isError && <Alert severity="error" sx={{ mb: 2 }}>Failed to add owner.</Alert>}

      <Box component="form" onSubmit={handleSubmit} sx={{ maxWidth: 600 }}>
        <TextField
          label="First Name"
          fullWidth
          required
          margin="normal"
          slotProps={{ htmlInput: { minLength: 1, maxLength: 30, pattern: '^[a-zA-Z]*$' } }}
          value={form.firstName}
          onChange={handleChange('firstName')}
        />
        <TextField
          label="Last Name"
          fullWidth
          required
          margin="normal"
          slotProps={{ htmlInput: { minLength: 1, maxLength: 30, pattern: '^[a-zA-Z]*$' } }}
          value={form.lastName}
          onChange={handleChange('lastName')}
        />
        <TextField
          label="Address"
          fullWidth
          required
          margin="normal"
          slotProps={{ htmlInput: { maxLength: 255 } }}
          value={form.address}
          onChange={handleChange('address')}
        />
        <TextField
          label="City"
          fullWidth
          required
          margin="normal"
          slotProps={{ htmlInput: { maxLength: 80 } }}
          value={form.city}
          onChange={handleChange('city')}
        />
        <TextField
          label="Telephone"
          fullWidth
          required
          margin="normal"
          slotProps={{ htmlInput: { minLength: 1, maxLength: 20, pattern: '^[0-9]*$' } }}
          value={form.telephone}
          onChange={handleChange('telephone')}
        />
        <Box sx={{ mt: 2, display: 'flex', gap: 2 }}>
          <Button type="submit" variant="contained" disabled={mutation.isPending}>
            Save
          </Button>
          <Button variant="outlined" onClick={() => navigate('/owners')}>
            Cancel
          </Button>
        </Box>
      </Box>
    </>
  );
}
