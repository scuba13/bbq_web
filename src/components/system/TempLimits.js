import React, { useState, useEffect } from 'react';
import { Button, Card, CardContent, CircularProgress, Grid, TextField, Typography } from '@mui/material';
import ThermostatIcon from '@mui/icons-material/Thermostat';
import { getTempConfig, updateTempConfig } from '../../Api';
import { useNotification } from '../utils/useNotification';

function TempLimits() {
  const [config, setConfig] = useState(null);
  const [loading, setLoading] = useState(true);
  const { notify, NotificationSnackbar } = useNotification();

  useEffect(() => {
    getTempConfig()
      .then(setConfig)
      .catch(() => notify('Erro ao carregar limites de temperatura', 'error'))
      .finally(() => setLoading(false));
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setConfig(prev => ({ ...prev, [name]: value }));
  };

  const handleSave = async () => {
    try {
      const c = config;
      await updateTempConfig(
        parseInt(c.minBBQTemp), parseInt(c.maxBBQTemp),
        parseInt(c.minPrtTemp), parseInt(c.maxPrtTemp),
        parseInt(c.minCaliTemp), parseInt(c.maxCaliTemp),
        parseInt(c.minCaliTempP), parseInt(c.maxCaliTempP)
      );
      notify('Limites de temperatura atualizados');
    } catch (err) {
      notify(err.message, 'error');
    }
  };

  const field = (name, label) => (
    <Grid item xs={12} sm={6}>
      <TextField
        name={name}
        label={label}
        type="number"
        value={config?.[name] ?? ''}
        onChange={handleChange}
        fullWidth
        margin="dense"
      />
    </Grid>
  );

  return (
    <Card variant="outlined">
      <CardContent>
        <Typography variant="subtitle1" gutterBottom sx={{ display: 'flex', alignItems: 'center' }}>
          <ThermostatIcon sx={{ fontSize: 30, mr: 1 }} />
          Limites de Temperatura
        </Typography>
        {loading ? (
          <CircularProgress size={24} />
        ) : (
          <>
            <Grid container spacing={1}>
              {field('minBBQTemp', 'BBQ Mín')}
              {field('maxBBQTemp', 'BBQ Máx')}
              {field('minPrtTemp', 'Proteína Mín')}
              {field('maxPrtTemp', 'Proteína Máx')}
              {field('minCaliTemp', 'Calibração BBQ Mín')}
              {field('maxCaliTemp', 'Calibração BBQ Máx')}
              {field('minCaliTempP', 'Calibração Prot. Mín')}
              {field('maxCaliTempP', 'Calibração Prot. Máx')}
            </Grid>
            <Button variant="contained" onClick={handleSave} fullWidth sx={{ mt: 2 }}>
              Salvar Limites
            </Button>
          </>
        )}
      </CardContent>
      <NotificationSnackbar />
    </Card>
  );
}

export default TempLimits;
