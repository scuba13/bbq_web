import React from 'react';
import { Link } from 'react-router-dom';
import { Container, Button, Stack } from '@mui/material';
import PageTitle from '../utils/PageTitle';

function HomePage() {
  return (
    <Container maxWidth="sm" sx={{ textAlign: 'center', padding: '40px 20px' }}>
      <PageTitle title="LazyQ Inc." subtitle="We Smoke While Y'All Snooze" />

      <Stack spacing={2} sx={{ mt: 2 }}>
        <Button variant="contained" component={Link} to="/monitor" fullWidth>Monitor</Button>
        <Button variant="contained" component={Link} to="/mqtt" fullWidth>MQTT</Button>
        <Button variant="contained" component={Link} to="/log" fullWidth>Log</Button>
        <Button variant="contained" component={Link} to="/system" fullWidth>System</Button>
      </Stack>

      <img
        src="/logo_gato.webp"
        alt="LazyQ Inc. Logo"
        style={{ maxWidth: '100%', height: 'auto', marginTop: '30px' }}
      />
    </Container>
  );
}

export default HomePage;
