import React from 'react';
import { Typography } from '@mui/material';

function PageTitle({ title, subtitle }) {
  return (
    <div style={{ textAlign: 'center', padding: '20px 0' }}>
      <Typography variant="h4" component="h1" gutterBottom sx={{ fontWeight: 'bold' }}>
        {title}
      </Typography>
      <Typography variant="h5" component="h2" gutterBottom sx={{ fontWeight: 'bold' }}>
        {subtitle}
      </Typography>
    </div>
  );
}

export default PageTitle;
