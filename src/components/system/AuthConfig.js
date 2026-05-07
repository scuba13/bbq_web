import React, { useState, useEffect } from 'react';
import { Button, Card, CardContent, CircularProgress, TextField, Typography, Chip, Box } from '@mui/material';
import LockIcon from '@mui/icons-material/Lock';
import LockOpenIcon from '@mui/icons-material/LockOpen';
import { getAuthConfig, updateAuthConfig } from '../../Api';
import { useNotification } from '../utils/useNotification';

export default function AuthConfig() {
  const [status, setStatus]       = useState(null);
  const [currentKey, setCurrentKey] = useState('');
  const [newKey, setNewKey]       = useState('');
  const [loading, setLoading]     = useState(true);
  const { notify, NotificationSnackbar } = useNotification();

  const load = () => {
    setLoading(true);
    getAuthConfig()
      .then(setStatus)
      .catch(() => notify('Erro ao carregar status de autenticação', 'error'))
      .finally(() => setLoading(false));
  };

  useEffect(() => { load(); }, []);

  const handleSave = async () => {
    try {
      await updateAuthConfig(status?.keyConfigured ? currentKey : '', newKey);
      notify(newKey ? 'Chave de API definida' : 'Autenticação desabilitada');
      setCurrentKey('');
      setNewKey('');
      load();
    } catch (err) {
      notify(err.message, 'error');
    }
  };

  return (
    <Card variant="outlined">
      <CardContent>
        <Typography variant="subtitle1" gutterBottom sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
          {status?.keyConfigured ? <LockIcon sx={{ fontSize: 28 }} /> : <LockOpenIcon sx={{ fontSize: 28 }} />}
          Chave de API
        </Typography>

        {loading ? <CircularProgress size={24} /> : (
          <>
            <Box sx={{ mb: 2, display: 'flex', alignItems: 'center', gap: 1 }}>
              <Chip
                label={status?.keyConfigured ? `Ativa — ${status.keyPreview}` : 'Desabilitada'}
                color={status?.keyConfigured ? 'success' : 'default'}
                size="small"
              />
            </Box>

            {status?.keyConfigured && (
              <TextField
                label="Chave atual"
                type="password"
                value={currentKey}
                onChange={e => setCurrentKey(e.target.value)}
                fullWidth margin="dense"
                helperText="Obrigatório para alterar ou remover"
              />
            )}

            <TextField
              label="Nova chave (vazio = desabilitar)"
              type="password"
              value={newKey}
              onChange={e => setNewKey(e.target.value)}
              fullWidth margin="dense"
              inputProps={{ maxLength: 32 }}
              helperText="Máximo 32 caracteres"
            />

            <Button variant="contained" onClick={handleSave} fullWidth sx={{ mt: 1 }}>
              {newKey ? 'Salvar Chave' : 'Desabilitar Autenticação'}
            </Button>
          </>
        )}
      </CardContent>
      <NotificationSnackbar />
    </Card>
  );
}
