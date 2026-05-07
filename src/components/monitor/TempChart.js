import React, { useState } from 'react';
import { Card, CardContent, Typography, ToggleButton, ToggleButtonGroup, Box } from '@mui/material';
import { LineChart, Line, XAxis, YAxis, Tooltip, Legend, ResponsiveContainer, ReferenceLine } from 'recharts';
import ShowChartIcon from '@mui/icons-material/ShowChart';
import { useMonitor } from '../../context/MonitorContext';

const WINDOWS = { '5m': 300, '15m': 900, '30m': 1800 };

export default function TempChart({ bbqSetpoint, proteinSetpoint }) {
  const [window, setWindow] = useState('15m');
  const { history } = useMonitor() || {};

  const slice = (history || []).slice(-WINDOWS[window]);

  // Só mostra cada N-ésimo ponto para não sobrecarregar o chart
  const step = window === '5m' ? 1 : window === '15m' ? 3 : 6;
  const data = slice.filter((_, i) => i % step === 0);

  return (
    <Card variant="outlined" sx={{ mt: 2 }}>
      <CardContent>
        <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 1 }}>
          <Typography variant="subtitle1" sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <ShowChartIcon /> Histórico de Temperatura
          </Typography>
          <ToggleButtonGroup value={window} exclusive onChange={(_, v) => v && setWindow(v)} size="small">
            <ToggleButton value="5m">5m</ToggleButton>
            <ToggleButton value="15m">15m</ToggleButton>
            <ToggleButton value="30m">30m</ToggleButton>
          </ToggleButtonGroup>
        </Box>

        {data.length < 2 ? (
          <Typography variant="body2" color="text.secondary" align="center" sx={{ py: 4 }}>
            Aguardando dados...
          </Typography>
        ) : (
          <ResponsiveContainer width="100%" height={220}>
            <LineChart data={data} margin={{ top: 5, right: 5, left: -20, bottom: 0 }}>
              <XAxis dataKey="time" tick={{ fontSize: 10 }} interval="preserveStartEnd" />
              <YAxis tick={{ fontSize: 10 }} domain={['auto', 'auto']} />
              <Tooltip
                contentStyle={{ backgroundColor: '#1e1e1e', border: '1px solid #444', fontSize: 12 }}
                formatter={(v, name) => [`${v}°C`, name]}
              />
              <Legend wrapperStyle={{ fontSize: 12 }} />
              {bbqSetpoint > 0 && (
                <ReferenceLine y={bbqSetpoint} stroke="#ff4444" strokeDasharray="4 2" label={{ value: `BBQ ${bbqSetpoint}°C`, fontSize: 10, fill: '#ff4444' }} />
              )}
              {proteinSetpoint > 0 && (
                <ReferenceLine y={proteinSetpoint} stroke="#4488ff" strokeDasharray="4 2" label={{ value: `Prot ${proteinSetpoint}°C`, fontSize: 10, fill: '#4488ff' }} />
              )}
              <Line type="monotone" dataKey="bbq"     stroke="#ff4444" name="BBQ"      dot={false} strokeWidth={2} connectNulls />
              <Line type="monotone" dataKey="protein" stroke="#4488ff" name="Proteína" dot={false} strokeWidth={2} connectNulls />
            </LineChart>
          </ResponsiveContainer>
        )}
      </CardContent>
    </Card>
  );
}
