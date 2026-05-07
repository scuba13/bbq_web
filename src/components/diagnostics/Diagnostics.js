import React, { useState, useEffect, useCallback } from 'react';
import {
  Box, Button, Card, CardContent, CircularProgress,
  Grid, LinearProgress, Typography, Chip,
} from '@mui/material';
import RefreshIcon from '@mui/icons-material/Refresh';
import { getDiagnostics } from '../../Api';
import { useNotification } from '../utils/useNotification';

function MetricRow({ label, value, unit = '' }) {
  return (
    <Box sx={{ display: 'flex', justifyContent: 'space-between', py: 0.4 }}>
      <Typography variant="body2" color="text.secondary">{label}</Typography>
      <Typography variant="body2" fontWeight="bold">{value}{unit}</Typography>
    </Box>
  );
}

function Section({ title, children }) {
  return (
    <Card variant="outlined" sx={{ height: '100%' }}>
      <CardContent>
        <Typography variant="subtitle2" gutterBottom sx={{ color: 'primary.main', textTransform: 'uppercase', fontSize: 11 }}>
          {title}
        </Typography>
        {children}
      </CardContent>
    </Card>
  );
}

function uptime(seconds) {
  const h = Math.floor(seconds / 3600);
  const m = Math.floor((seconds % 3600) / 60);
  const s = seconds % 60;
  return `${h}h ${m}m ${s}s`;
}

export default function Diagnostics() {
  const [data, setData]     = useState(null);
  const [loading, setLoading] = useState(true);
  const { notify, NotificationSnackbar } = useNotification();

  const load = useCallback(async () => {
    setLoading(true);
    try {
      setData(await getDiagnostics());
    } catch {
      notify('Erro ao buscar diagnósticos', 'error');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { load(); }, [load]);

  if (loading) return <Box sx={{ display: 'flex', justifyContent: 'center', mt: 4 }}><CircularProgress /></Box>;
  if (!data)   return null;

  const { heap, cpu, system, wifi, mqtt, sensors, tasks, relay } = data;

  return (
    <Box>
      <Box sx={{ display: 'flex', justifyContent: 'flex-end', mb: 2 }}>
        <Button startIcon={<RefreshIcon />} onClick={load} variant="outlined" size="small">
          Atualizar
        </Button>
      </Box>

      <Grid container spacing={2}>
        {/* Sistema */}
        <Grid item xs={12} sm={6} md={4}>
          <Section title="Sistema">
            <Box sx={{ mb: 1 }}>
              <Chip
                label={system.healthy ? 'Saudável' : 'Atenção'}
                color={system.healthy ? 'success' : 'error'}
                size="small"
              />
            </Box>
            <MetricRow label="Uptime"         value={uptime(system.uptime)} />
            <MetricRow label="Reset reason"   value={system.resetReason} />
            <MetricRow label="CPU"            value={cpu.freq} unit=" MHz" />
          </Section>
        </Grid>

        {/* Memória */}
        <Grid item xs={12} sm={6} md={4}>
          <Section title="Memória">
            <MetricRow label="Heap livre"     value={(heap.free / 1024).toFixed(1)}    unit=" KB" />
            <MetricRow label="Heap mínimo"    value={(heap.min / 1024).toFixed(1)}     unit=" KB" />
            <MetricRow label="Maior bloco"    value={(heap.maxAlloc / 1024).toFixed(1)} unit=" KB" />
            <Box sx={{ mt: 1 }}>
              <Typography variant="caption" color="text.secondary">
                Fragmentação: {heap.fragmentation.toFixed(1)}%
              </Typography>
              <LinearProgress
                variant="determinate"
                value={Math.min(heap.fragmentation, 100)}
                color={heap.fragmentation > 60 ? 'error' : heap.fragmentation > 40 ? 'warning' : 'success'}
                sx={{ mt: 0.5, height: 6, borderRadius: 3 }}
              />
            </Box>
          </Section>
        </Grid>

        {/* WiFi */}
        <Grid item xs={12} sm={6} md={4}>
          <Section title="WiFi">
            <Box sx={{ mb: 1 }}>
              <Chip
                label={wifi.connected ? 'Conectado' : 'Desconectado'}
                color={wifi.connected ? 'success' : 'error'}
                size="small"
              />
            </Box>
            <MetricRow label="RSSI"           value={wifi.rssi}           unit=" dBm" />
            <MetricRow label="Reconexões"     value={wifi.reconnections} />
          </Section>
        </Grid>

        {/* MQTT */}
        <Grid item xs={12} sm={6} md={4}>
          <Section title="MQTT">
            <Box sx={{ mb: 1, display: 'flex', gap: 1 }}>
              <Chip label={mqtt.enabled ? 'Habilitado' : 'Desabilitado'} size="small" color={mqtt.enabled ? 'primary' : 'default'} />
              {mqtt.enabled && <Chip label={mqtt.connected ? 'Conectado' : 'Offline'} size="small" color={mqtt.connected ? 'success' : 'warning'} />}
            </Box>
            <MetricRow label="Reconexões" value={mqtt.reconnections} />
          </Section>
        </Grid>

        {/* Sensores */}
        <Grid item xs={12} sm={6} md={4}>
          <Section title="Sensores">
            <MetricRow label="Erros BBQ"      value={sensors.bbqReadErrors} />
            <MetricRow label="Erros Proteína" value={sensors.proteinReadErrors} />
            <MetricRow label="Erros Interno"  value={sensors.internalReadErrors} />
            <MetricRow label="Emergências relé" value={relay.emergencies} />
          </Section>
        </Grid>

        {/* Tasks */}
        <Grid item xs={12} sm={6} md={4}>
          <Section title="Tasks (stack livre)">
            <MetricRow label="TempTask"    value={tasks.tempStack}    unit=" B" />
            <MetricRow label="ControlTask" value={tasks.controlStack} unit=" B" />
            <MetricRow label="MQTTTask"    value={tasks.mqttStack || '—'} unit={tasks.mqttStack ? ' B' : ''} />
          </Section>
        </Grid>
      </Grid>
      <NotificationSnackbar />
    </Box>
  );
}
