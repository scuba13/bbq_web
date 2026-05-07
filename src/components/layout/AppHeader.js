import React from 'react';
import { AppBar, Toolbar, Typography, Box } from '@mui/material';
import WhatshotIcon from '@mui/icons-material/Whatshot';
import WhatshotOutlinedIcon from '@mui/icons-material/WhatshotOutlined';
import SavingsIcon from '@mui/icons-material/Savings';
import { useMonitor } from '../../context/MonitorContext';

// Mesma lógica de cor do Monitor: azul = abaixo, verde = no setpoint, vermelho = acima
function tempColor(current, setpoint) {
  if (current === '--' || setpoint === '--' || setpoint === 0) return '#fff';
  if (current > setpoint) return '#ff4444';
  if (current < setpoint) return '#4488ff';
  return '#44ff88';
}

export default function AppHeader() {
  const ctx   = useMonitor();
  const temps = ctx?.temps;

  const fmt = (v) => (v != null && v !== '--') ? Math.round(v) : '--';

  const relayOn        = temps?.relayState        === 'ON';
  const bbq            = fmt(temps?.bbqCurrentTemp);
  const bbqSetpoint    = temps?.bbqSetpoint        ?? '--';
  const protein        = fmt(temps?.proteinCurrentTemp);
  const proteinSetpoint = temps?.proteinSetpoint   ?? '--';
  const proteinReached = temps?.proteinReached     ?? false;

  const bbqColor     = tempColor(bbq, bbqSetpoint);
  const proteinColor = proteinReached ? '#44ff88' : tempColor(protein, proteinSetpoint);

  return (
    <AppBar position="sticky" sx={{ backgroundColor: '#111', borderBottom: '1px solid #333' }} elevation={0}>
      <Toolbar variant="dense" sx={{ minHeight: 48, gap: 2 }}>
        <Typography variant="body2" sx={{ fontWeight: 'bold', color: '#888', mr: 'auto' }}>
          LazyQ Inc.
        </Typography>

        {/* BBQ */}
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
          {relayOn
            ? <WhatshotIcon sx={{ color: '#ff8800', fontSize: 18 }} />
            : <WhatshotOutlinedIcon sx={{ color: '#666', fontSize: 18 }} />}
          <Typography variant="body2" sx={{ color: bbqColor, fontWeight: 'bold' }}>
            {bbq}°C
          </Typography>
        </Box>

        <Typography variant="body2" sx={{ color: '#444' }}>|</Typography>

        {/* Proteína */}
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
          <SavingsIcon sx={{ color: proteinColor, fontSize: 18 }} />
          <Typography variant="body2" sx={{ color: proteinColor, fontWeight: 'bold' }}>
            {protein}°C
          </Typography>
        </Box>

      </Toolbar>
    </AppBar>
  );
}
