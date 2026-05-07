import React from 'react';
import { Box, Button, Card, CardContent, Typography } from '@mui/material';
import { resetSystem } from '../../Api';
import SettingsIcon from '@mui/icons-material/Settings';

function System() {
  const handleResetSystem = async () => {
    if (!window.confirm("Confirma o reset do sistema?")) return;
    try {
      const message = await resetSystem();
      alert(message);
    } catch (error) {
      alert(`Erro: ${error.message}`);
    }
  };

  return (
    <Card variant="outlined">
      <CardContent>
        <Typography variant="subtitle1" gutterBottom style={{ display: "flex", alignItems: "center" }}>
          <SettingsIcon style={{ fontSize: 30, marginRight: 5 }} /> Sistema
        </Typography>
        <Box mt={2}>
          <Button variant="contained" color="error" onClick={handleResetSystem} fullWidth>
            Resetar Sistema
          </Button>
        </Box>
      </CardContent>
    </Card>
  );
}

export default System;
