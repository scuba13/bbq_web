import React, { useState, useEffect } from 'react';
import {
  Button, Card, CardContent, Checkbox, CircularProgress,
  FormControlLabel, TextField, Typography,
} from '@mui/material';
import LinkIcon from '@mui/icons-material/Link';
import { getMQTTConfig, updateMQTTConfig } from '../../Api';
import { useNotification } from '../utils/useNotification';

function MQTTConfig() {
  const [config, setConfig] = useState({
    mqttServer: '', mqttPort: '', mqttUser: '', mqttPassword: '', isHAAvailable: false,
  });
  const [loading, setLoading] = useState(true);
  const { notify, NotificationSnackbar } = useNotification();

  useEffect(() => {
    getMQTTConfig()
      .then(setConfig)
      .catch(() => notify('Erro ao carregar configuração MQTT', 'error'))
      .finally(() => setLoading(false));
  }, []);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setConfig(prev => ({ ...prev, [name]: type === 'checkbox' ? checked : value }));
  };

  const handleSave = async () => {
    try {
      await updateMQTTConfig(
        config.mqttServer,
        Number(config.mqttPort),
        config.mqttUser,
        config.mqttPassword,
        config.isHAAvailable
      );
      notify('Configuração MQTT atualizada');
    } catch (err) {
      notify(err.message, 'error');
    }
  };

  return (
    <Card variant="outlined">
      <CardContent>
        <Typography variant="subtitle1" gutterBottom sx={{ display: 'flex', alignItems: 'center' }}>
          <LinkIcon sx={{ fontSize: 30, mr: 1 }} />
          MQTT Device Configuration
        </Typography>

        {loading ? <CircularProgress size={24} /> : (
          <>
            <TextField name="mqttServer" label="Servidor MQTT" value={config.mqttServer}
              onChange={handleChange} fullWidth margin="normal" />
            <TextField name="mqttPort" label="Porta" type="number" value={config.mqttPort}
              onChange={handleChange} fullWidth margin="normal" />
            <TextField name="mqttUser" label="Usuário" value={config.mqttUser}
              onChange={handleChange} fullWidth margin="normal" />
            <TextField
              name="mqttPassword" label="Senha" type="password"
              value={config.mqttPassword} onChange={handleChange}
              fullWidth margin="normal"
              helperText="Deixe vazio para manter a senha atual"
            />
            <FormControlLabel
              control={<Checkbox name="isHAAvailable" checked={config.isHAAvailable} onChange={handleChange} />}
              label="Home Assistant disponível"
            />
            <Button variant="contained" onClick={handleSave} fullWidth sx={{ mt: 1 }}>
              Salvar
            </Button>
          </>
        )}
      </CardContent>
      <NotificationSnackbar />
    </Card>
  );
}

export default MQTTConfig;
