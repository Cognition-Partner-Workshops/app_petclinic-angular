import { Typography, Box } from '@mui/material';

export default function WelcomePage() {
  return (
    <Box sx={{ textAlign: 'center', mt: 6 }}>
      <Typography variant="h3" gutterBottom>
        Welcome to PetClinic
      </Typography>
      <Typography variant="body1" color="text.secondary">
        A Spring PetClinic application built with React
      </Typography>
    </Box>
  );
}
