import React from 'react';
import { Link } from 'react-router-dom';
import { Container, Button, Grid } from '@mui/material';
import PageTitle from '../utils/PageTitle';

function HomePage() {
  return (
    <Container maxWidth="sm" sx={{ textAlign: 'center', padding: '40px 20px' }}>
      <PageTitle title="LazyQ Inc." subtitle="We Smoke While Y'All Snooze" />

      <Grid container spacing={2} sx={{ mt: 2 }}>
        <Grid item xs={6}>
          <Button variant="contained" component={Link} to="/monitor" fullWidth>Monitor</Button>
        </Grid>
        <Grid item xs={6}>
          <Button variant="contained" component={Link} to="/mqtt" fullWidth>MQTT</Button>
        </Grid>
        <Grid item xs={6}>
          <Button variant="contained" component={Link} to="/log" fullWidth>Log</Button>
        </Grid>
        <Grid item xs={6}>
          <Button variant="contained" component={Link} to="/system" fullWidth>System</Button>
        </Grid>
      </Grid>

      <img
        src="/logo_gato.webp"
        alt="LazyQ Inc. Logo"
        style={{ maxWidth: '100%', height: 'auto', marginTop: '30px' }}
      />
    </Container>
  );
}

export default HomePage;
