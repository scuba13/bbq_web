import React, { useState, useEffect } from 'react';
import { Button, Card, CardContent, CircularProgress, TextField, Typography } from '@mui/material';
import SettingsApplicationsIcon from '@mui/icons-material/SettingsApplications';
import { getAiConfig, updateAIConfig } from '../../Api';
import { useNotification } from '../utils/useNotification';

function AIConfig() {
  const [config, setConfig] = useState({ aiKey: '', tip: '' });
  const [loading, setLoading] = useState(true);
  const { notify, NotificationSnackbar } = useNotification();

  useEffect(() => {
    getAiConfig()
      .then(setConfig)
      .catch(() => notify('Erro ao carregar configuração de AI', 'error'))
      .finally(() => setLoading(false));
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setConfig(prev => ({ ...prev, [name]: value }));
  };

  const handleSave = async () => {
    try {
      await updateAIConfig(config.aiKey, config.tip);
      notify('Configuração de AI atualizada');
    } catch (err) {
      notify(err.message, 'error');
    }
  };

  return (
    <Card variant="outlined">
      <CardContent>
        <Typography variant="h6" gutterBottom sx={{ display: 'flex', alignItems: 'center' }}>
          <SettingsApplicationsIcon sx={{ fontSize: 30, mr: 1 }} />
          AI Configuration
        </Typography>

        {loading ? <CircularProgress size={24} /> : (
          <>
            <TextField name="aiKey" label="AI Key (Google)" value={config.aiKey}
              onChange={handleChange} fullWidth margin="normal"
              helperText="Deixe vazio para desabilitar AI" />
            <TextField name="tip" label="Prompt padrão" value={config.tip}
              onChange={handleChange} fullWidth margin="normal" multiline rows={3} />
            <Button variant="contained" onClick={handleSave} fullWidth sx={{ mt: 2 }}>
              Salvar
            </Button>
          </>
        )}
      </CardContent>
      <NotificationSnackbar />
    </Card>
  );
}

export default AIConfig;
