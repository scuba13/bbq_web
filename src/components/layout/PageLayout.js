import React from 'react';
import { Container, Button } from '@mui/material';
import { Link } from 'react-router-dom';
import PageTitle from '../utils/PageTitle';
import Watermark from '../utils/Watermark';

function PageLayout({ title, subtitle, children }) {
  return (
    <Container sx={{ padding: '20px', position: 'relative', pt: '20px' }}>
      <Watermark />
      <PageTitle title={title} subtitle={subtitle} />
      <div style={{ textAlign: 'center', marginBottom: '20px' }}>
        <Button variant="contained" component={Link} to="/">Início</Button>
      </div>
      {children}
    </Container>
  );
}

export default PageLayout;
