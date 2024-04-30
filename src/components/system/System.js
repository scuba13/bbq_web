import React from 'react';
import { Box, Button, Card, CardContent, Typography } from '@mui/material';
import { resetSystem, activateCure } from '../../Api';
import SettingsIcon from '@mui/icons-material/Settings';

function System() {
  const handleResetSystem = async () => {
    try {
      const message = await resetSystem();
      alert(message);
    } catch (error) {
      alert(`Error: ${error.message}`);
    }
  };

  const handleActivateCure = async () => {
    try {
      const message = await activateCure();
      alert(message);
    } catch (error) {
      alert(`Error: ${error.message}`);
    }
  };

  return (
    <Card variant="outlined">
      <CardContent>
        <Typography variant="subtitle1" gutterBottom style={{ display: "flex", alignItems: "center" }}>
          <SettingsIcon style={{ fontSize: 30, marginRight: 5 }} /> System
        </Typography>
        <Box mt={2}>
          <Button variant="contained" color="primary" onClick={handleResetSystem} fullWidth>
            Reset System
          </Button>
        </Box>
        <Box mt={2}>
          <Button variant="contained" color="primary" onClick={handleActivateCure} fullWidth>
            Activate Cure Process
          </Button>
        </Box>
      </CardContent>
    </Card>
  );
}

export default System;
