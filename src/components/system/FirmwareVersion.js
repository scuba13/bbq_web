import React, { useState, useEffect } from 'react';
import { Button, Card, CardContent, CircularProgress, Typography, Box, Chip } from '@mui/material';
import SystemUpdateAltIcon from '@mui/icons-material/SystemUpdateAlt';
import RestoreIcon from '@mui/icons-material/Restore';
import { getSystemUpdateStatus, performRollback } from '../../Api';
import { useNotification } from '../utils/useNotification';

export default function FirmwareVersion() {
  const [status, setStatus]   = useState(null);
  const [loading, setLoading] = useState(true);
  const { notify, NotificationSnackbar } = useNotification();

  useEffect(() => {
    getSystemUpdateStatus()
      .then(setStatus)
      .catch(() => notify('Erro ao buscar versão do firmware', 'error'))
      .finally(() => setLoading(false));
  }, []);

  const handleRollback = async () => {
    if (!window.confirm('Confirma o rollback para o firmware anterior?')) return;
    try {
      await performRollback();
      notify('Rollback iniciado — dispositivo reiniciando...');
    } catch (err) {
      notify(err.message, 'error');
    }
  };

  return (
    <Card variant="outlined">
      <CardContent>
        <Typography variant="subtitle1" gutterBottom sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
          <SystemUpdateAltIcon sx={{ fontSize: 28 }} />
          Versão do Firmware
        </Typography>

        {loading ? <CircularProgress size={24} /> : (
          <>
            <Box sx={{ display: 'flex', gap: 1, mb: 2, flexWrap: 'wrap' }}>
              <Chip label={`Atual: ${status?.currentVersion || '—'}`} size="small" color="primary" />
              {status?.inProgress && (
                <Chip label={`Atualizando: ${status.progress}%`} size="small" color="warning" />
              )}
            </Box>
            <Button
              variant="outlined"
              color="warning"
              startIcon={<RestoreIcon />}
              onClick={handleRollback}
              fullWidth
            >
              Rollback para versão anterior
            </Button>
          </>
        )}
      </CardContent>
      <NotificationSnackbar />
    </Card>
  );
}
