import React, { useState } from 'react';
import { Box, Button, Card, CardContent, TextField, Typography } from '@mui/material';
import { setTempCalibration, resetSystem, activateCure } from '../../Api';

function System() {
  const [tempCalibrationValue, setTempCalibrationValue] = useState("");

  const handleSetTempCalibration = async () => {
    try {
      const message = await setTempCalibration(tempCalibrationValue);
      alert(message); // Notify user of success
    } catch (error) {
      alert(`Error: ${error.message}`); // Notify user of error
    }
  };

  const handleResetSystem = async () => {
    try {
      const message = await resetSystem();
      alert(message); // Notify user of success
    } catch (error) {
      alert(`Error: ${error.message}`); // Notify user of error
    }
  };

  const handleActivateCure = async () => {
    try {
      const message = await activateCure();
      alert(message); // Notify user of success
    } catch (error) {
      alert(`Error: ${error.message}`); // Notify user of error
    }
  };

  return (
    <Card variant="outlined">
      <CardContent>
        <Typography variant="subtitle1" gutterBottom>
          System Controls
        </Typography>
        <TextField
          type="number"
          value={tempCalibrationValue}
          onChange={(e) => setTempCalibrationValue(e.target.value)}
          inputProps={{ min: -20, max: 20 }}
          fullWidth
          margin="normal"
        />
        <Button variant="contained" onClick={handleSetTempCalibration} fullWidth>
          Set Calibration
        </Button>
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
