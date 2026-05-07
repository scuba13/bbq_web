import React, { useState } from "react";
import { setBBQTemperature, setProteinTemperature } from "../../Api";
import { useMonitor } from "../../context/MonitorContext";
import {
  Alert, Box, Button, Card, CardContent,
  Grid, TextField, Typography,
} from "@mui/material";
import FireIcon from "@mui/icons-material/Whatshot";
import FireOffIcon from "@mui/icons-material/WhatshotOutlined";
import Chunk from "@mui/icons-material/Savings";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import TempChart from "./TempChart";
import { useNotification } from "../utils/useNotification";

const EMPTY = "--";

function Monitor() {
  const ctx   = useMonitor();
  const temps = ctx?.temps ?? {};

  const fmt = (v) => (v != null && v !== EMPTY) ? Math.round(v) : EMPTY;

  const bbqCurrentTemp    = fmt(temps.bbqCurrentTemp);
  const bbqSetpoint       = fmt(temps.bbqSetpoint);
  const proteinCurrentTemp = fmt(temps.proteinCurrentTemp);
  const proteinSetpoint   = fmt(temps.proteinSetpoint);
  const proteinReached    = temps.proteinReached    ?? false;
  const relayState        = temps.relayState        ?? EMPTY;
  const avgTemp           = fmt(temps.avgTemp);
  const minBBQTemp        = temps.minBBQTemp        ?? EMPTY;
  const maxBBQTemp        = temps.maxBBQTemp        ?? EMPTY;
  const minPrtTemp        = temps.minPrtTemp        ?? EMPTY;
  const maxPrtTemp        = temps.maxPrtTemp        ?? EMPTY;

  const [bbqInput, setBbqInput]         = useState("");
  const [proteinInput, setProteinInput] = useState("");
  const { notify, NotificationSnackbar } = useNotification();

  const handleSetBBQ = async () => {
    const value = parseFloat(bbqInput);
    if (isNaN(value) || value < minBBQTemp || value > maxBBQTemp) {
      notify(`Temperatura BBQ deve estar entre ${minBBQTemp}°C e ${maxBBQTemp}°C`, 'warning');
      return;
    }
    try {
      await setBBQTemperature(value);
      setBbqInput("");
      notify(`BBQ setpoint → ${value}°C`);
    } catch (err) {
      notify(err.message, 'error');
    }
  };

  const handleSetProtein = async () => {
    const value = parseFloat(proteinInput);
    if (isNaN(value) || value < minPrtTemp || value > maxPrtTemp) {
      notify(`Temperatura proteína deve estar entre ${minPrtTemp}°C e ${maxPrtTemp}°C`, 'warning');
      return;
    }
    try {
      await setProteinTemperature(value);
      setProteinInput("");
      notify(`Protein setpoint → ${value}°C`);
    } catch (err) {
      notify(err.message, 'error');
    }
  };

  const getChunkStatus = () => {
    if (proteinReached)                             return "Ready! 🎉";
    if (proteinSetpoint === EMPTY)                  return "---";
    if (proteinCurrentTemp > proteinSetpoint)       return "Charcoal Special";
    if (proteinCurrentTemp < proteinSetpoint)       return "Still Mooing";
    return "Happy As a Pig In Mud";
  };

  const tempColor = (current, target) => {
    if (current === EMPTY || target === EMPTY) return "inherit";
    if (current > target) return "red";
    if (current < target) return "blue";
    return "green";
  };

  const bigTemp = { fontSize: "4rem", fontWeight: "bold", display: "flex", justifyContent: "center", alignItems: "center", height: "100px" };
  const header  = { display: "flex", justifyContent: "space-between", alignItems: "center" };

  return (
    <Box>
      {proteinReached && (
        <Alert icon={<CheckCircleIcon />} severity="success" sx={{ mb: 2 }}>
          Proteína atingiu a temperatura alvo!
        </Alert>
      )}

      <Grid container spacing={2}>
        {/* BBQ */}
        <Grid item xs={12} sm={6}>
          <Card variant="outlined">
            <CardContent>
              <Box style={header}>
                <Typography variant="subtitle1" gutterBottom sx={{ display: "flex", alignItems: "center" }}>
                  {relayState === "ON"
                    ? <FireIcon color="error" style={{ fontSize: 30, marginRight: 5 }} />
                    : <FireOffIcon style={{ fontSize: 30, marginRight: 5 }} />}
                  BBQ
                </Typography>
                <Typography style={{ fontSize: "1rem" }}>Média: {avgTemp} C</Typography>
              </Box>
              <Typography component="h2" style={{ ...bigTemp, color: tempColor(bbqCurrentTemp, bbqSetpoint) }}>
                {bbqCurrentTemp} C
              </Typography>
              <Typography color="textSecondary">{bbqSetpoint} C</Typography>
              <TextField
                type="number" label="Novo setpoint BBQ" value={bbqInput}
                onChange={e => setBbqInput(e.target.value)}
                inputProps={{ min: minBBQTemp, max: maxBBQTemp }}
                margin="normal" fullWidth
              />
              <Button variant="contained" onClick={handleSetBBQ} fullWidth>
                Definir Temp BBQ
              </Button>
            </CardContent>
          </Card>
        </Grid>

        {/* Proteína */}
        <Grid item xs={12} sm={6}>
          <Card variant="outlined">
            <CardContent>
              <Box style={header}>
                <Typography variant="subtitle1" gutterBottom sx={{ display: "flex", alignItems: "center" }}>
                  <Chunk color="inherit" style={{ fontSize: 30, marginRight: 5 }} />
                  Chunk
                </Typography>
                <Typography style={{ fontSize: "1rem" }}>{getChunkStatus()}</Typography>
              </Box>
              <Typography component="h2" style={{ ...bigTemp, color: tempColor(proteinCurrentTemp, proteinSetpoint) }}>
                {proteinCurrentTemp} C
              </Typography>
              <Typography color="textSecondary">{proteinSetpoint} C</Typography>
              <TextField
                type="number" label="New protein setpoint" value={proteinInput}
                onChange={e => setProteinInput(e.target.value)}
                inputProps={{ min: minPrtTemp, max: maxPrtTemp }}
                margin="normal" fullWidth
              />
              <Button variant="contained" onClick={handleSetProtein} fullWidth>
                Set Protein Temp
              </Button>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      <TempChart
        bbqSetpoint={bbqSetpoint !== EMPTY ? Number(bbqSetpoint) : 0}
        proteinSetpoint={proteinSetpoint !== EMPTY ? Number(proteinSetpoint) : 0}
      />

      <NotificationSnackbar />
    </Box>
  );
}

export default Monitor;
