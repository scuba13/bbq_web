import React, { useState, useEffect } from 'react';
import { Button, Card, CardContent, CircularProgress, TextField, Typography } from '@mui/material';
import TuneIcon from '@mui/icons-material/Tune';
import { getTempConfig, setCalibration } from '../../Api';
import { useNotification } from '../utils/useNotification';

function TempCalibration() {
  const [limits, setLimits] = useState(null);
  const [caliBBQ, setCaliBBQ] = useState('');
  const [caliPrt, setCaliPrt] = useState('');
  const [loading, setLoading] = useState(true);
  const { notify, NotificationSnackbar } = useNotification();

  useEffect(() => {
    getTempConfig()
      .then(setLimits)
      .catch(() => notify('Erro ao carregar limites', 'error'))
      .finally(() => setLoading(false));
  }, []);

  const handleSave = async () => {
    const bbq = parseFloat(caliBBQ);
    const prt = parseFloat(caliPrt);

    if (isNaN(bbq) || isNaN(prt)) {
      notify('Preencha os dois campos de calibração', 'warning');
      return;
    }
    if (limits) {
      if (bbq < limits.minCaliTemp || bbq > limits.maxCaliTemp) {
        notify(`BBQ deve estar entre ${limits.minCaliTemp} e ${limits.maxCaliTemp}`, 'warning');
        return;
      }
      if (prt < limits.minCaliTempP || prt > limits.maxCaliTempP) {
        notify(`Proteína deve estar entre ${limits.minCaliTempP} e ${limits.maxCaliTempP}`, 'warning');
        return;
      }
    }

    try {
      await setCalibration(bbq, prt);
      notify('Calibração aplicada');
    } catch (err) {
      notify(err.message, 'error');
    }
  };

  return (
    <Card variant="outlined">
      <CardContent>
        <Typography variant="subtitle1" gutterBottom sx={{ display: 'flex', alignItems: 'center' }}>
          <TuneIcon sx={{ fontSize: 30, mr: 1 }} />
          Calibração de Temperatura
        </Typography>
        {loading ? (
          <CircularProgress size={24} />
        ) : (
          <>
            <TextField
              label={`Calibração BBQ (${limits?.minCaliTemp} a ${limits?.maxCaliTemp}°C)`}
              type="number"
              value={caliBBQ}
              onChange={e => setCaliBBQ(e.target.value)}
              inputProps={{ min: limits?.minCaliTemp, max: limits?.maxCaliTemp, step: 1 }}
              fullWidth
              margin="normal"
            />
            <TextField
              label={`Calibração Proteína (${limits?.minCaliTempP} a ${limits?.maxCaliTempP}°C)`}
              type="number"
              value={caliPrt}
              onChange={e => setCaliPrt(e.target.value)}
              inputProps={{ min: limits?.minCaliTempP, max: limits?.maxCaliTempP, step: 1 }}
              fullWidth
              margin="normal"
            />
            <Button variant="contained" onClick={handleSave} fullWidth sx={{ mt: 1 }}>
              Aplicar Calibração
            </Button>
          </>
        )}
      </CardContent>
      <NotificationSnackbar />
    </Card>
  );
}

export default TempCalibration;
