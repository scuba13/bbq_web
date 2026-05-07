import React, { useState, useEffect } from "react";
import { getTemperatureData, setBBQTemperature, setProteinTemperature } from "../../Api";
import {
  Alert,
  Box,
  Button,
  Card,
  CardContent,
  Grid,
  TextField,
  Typography,
} from "@mui/material";

import FireIcon from "@mui/icons-material/Whatshot";
import FireOffIcon from "@mui/icons-material/WhatshotOutlined";
import Chunk from "@mui/icons-material/Savings";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";

const EMPTY = "--";

function Monitor() {
  const [temps, setTemps] = useState({
    bbqCurrentTemp:    EMPTY,
    bbqSetpoint:       EMPTY,
    proteinCurrentTemp: EMPTY,
    proteinSetpoint:   EMPTY,
    proteinReached:    false,
    relayState:        EMPTY,
    avgTemp:           EMPTY,
    minBBQTemp:        EMPTY,
    maxBBQTemp:        EMPTY,
    minPrtTemp:        EMPTY,
    maxPrtTemp:        EMPTY,
  });

  const [bbqInput, setBbqInput]         = useState("");
  const [proteinInput, setProteinInput] = useState("");

  useEffect(() => {
    const fetchTemps = async () => {
      try {
        const data = await getTemperatureData();
        setTemps({
          bbqCurrentTemp:    data.bbqCurrentTemp  > 0 ? data.bbqCurrentTemp  : EMPTY,
          bbqSetpoint:       data.bbqSetpoint      > 0 ? data.bbqSetpoint      : EMPTY,
          proteinCurrentTemp: data.proteinCurrentTemp > 0 ? data.proteinCurrentTemp : EMPTY,
          proteinSetpoint:   data.proteinSetpoint  > 0 ? data.proteinSetpoint  : EMPTY,
          proteinReached:    data.proteinReached,
          relayState:        data.relayState === "ON" ? "ON" : "OFF",
          avgTemp:           data.avgTemp > 0 ? data.avgTemp : EMPTY,
          minBBQTemp:        data.minBBQTemp,
          maxBBQTemp:        data.maxBBQTemp,
          minPrtTemp:        data.minPrtTemp,
          maxPrtTemp:        data.maxPrtTemp,
        });
      } catch (err) {
        console.error("Erro ao buscar temperaturas:", err);
      }
    };

    fetchTemps();
    const id = setInterval(fetchTemps, 1000);
    return () => clearInterval(id);
  }, []);

  const handleSetBBQ = async () => {
    const value = parseFloat(bbqInput);
    if (isNaN(value) || value < temps.minBBQTemp || value > temps.maxBBQTemp) {
      alert(`Temperatura BBQ deve estar entre ${temps.minBBQTemp}°C e ${temps.maxBBQTemp}°C`);
      return;
    }
    try {
      await setBBQTemperature(value);
      setBbqInput("");
    } catch (err) {
      alert(`Erro: ${err.message}`);
    }
  };

  const handleSetProtein = async () => {
    const value = parseFloat(proteinInput);
    if (isNaN(value) || value < temps.minPrtTemp || value > temps.maxPrtTemp) {
      alert(`Temperatura proteína deve estar entre ${temps.minPrtTemp}°C e ${temps.maxPrtTemp}°C`);
      return;
    }
    try {
      await setProteinTemperature(value);
      setProteinInput("");
    } catch (err) {
      alert(`Erro: ${err.message}`);
    }
  };

  const tempColor = (current, target) => {
    if (current === EMPTY || target === EMPTY) return "inherit";
    if (current > target) return "red";
    if (current < target) return "blue";
    return "green";
  };

  const getChunkStatus = () => {
    if (temps.proteinReached) return "Pronta! 🎉";
    if (temps.proteinSetpoint === EMPTY) return "---";
    if (temps.proteinCurrentTemp > temps.proteinSetpoint) return "Charcoal Special";
    if (temps.proteinCurrentTemp < temps.proteinSetpoint) return "Still Mooing";
    return "Happy As a Pig In Mud";
  };

  const bigTemp = {
    fontSize: "4rem",
    fontWeight: "bold",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    height: "100px",
  };

  const header = {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
  };

  return (
    <Box>
      {temps.proteinReached && (
        <Alert
          icon={<CheckCircleIcon />}
          severity="success"
          sx={{ mb: 2 }}
        >
          Proteína atingiu a temperatura alvo!
        </Alert>
      )}

      <Grid container spacing={2}>
        {/* BBQ */}
        <Grid item xs={12} sm={6}>
          <Card variant="outlined">
            <CardContent>
              <Box style={header}>
                <Typography variant="subtitle1" gutterBottom style={{ display: "flex", alignItems: "center" }}>
                  {temps.relayState === "ON"
                    ? <FireIcon color="error" style={{ fontSize: 30, marginRight: 5 }} />
                    : <FireOffIcon style={{ fontSize: 30, marginRight: 5 }} />}
                  BBQ
                </Typography>
                <Typography style={{ fontSize: "1rem" }}>
                  Avg: {temps.avgTemp} C
                </Typography>
              </Box>
              <Typography
                component="h2"
                style={{ ...bigTemp, color: tempColor(temps.bbqCurrentTemp, temps.bbqSetpoint) }}
              >
                {temps.bbqCurrentTemp} C
              </Typography>
              <Typography color="textSecondary">{temps.bbqSetpoint} C</Typography>
              <TextField
                type="number"
                label="Novo setpoint BBQ"
                value={bbqInput}
                onChange={(e) => setBbqInput(e.target.value)}
                inputProps={{ min: temps.minBBQTemp, max: temps.maxBBQTemp }}
                margin="normal"
                fullWidth
              />
              <Button variant="contained" onClick={handleSetBBQ} fullWidth>
                Set BBQ Temp
              </Button>
            </CardContent>
          </Card>
        </Grid>

        {/* Proteína */}
        <Grid item xs={12} sm={6}>
          <Card variant="outlined">
            <CardContent>
              <Box style={header}>
                <Typography variant="subtitle1" gutterBottom style={{ display: "flex", alignItems: "center" }}>
                  <Chunk color="inherit" style={{ fontSize: 30, marginRight: 5 }} />
                  Chunk
                </Typography>
                <Typography style={{ fontSize: "1rem" }}>
                  {getChunkStatus()}
                </Typography>
              </Box>
              <Typography
                component="h2"
                style={{ ...bigTemp, color: tempColor(temps.proteinCurrentTemp, temps.proteinSetpoint) }}
              >
                {temps.proteinCurrentTemp} C
              </Typography>
              <Typography color="textSecondary">{temps.proteinSetpoint} C</Typography>
              <TextField
                type="number"
                label="Novo setpoint proteína"
                value={proteinInput}
                onChange={(e) => setProteinInput(e.target.value)}
                inputProps={{ min: temps.minPrtTemp, max: temps.maxPrtTemp }}
                margin="normal"
                fullWidth
              />
              <Button variant="contained" onClick={handleSetProtein} fullWidth>
                Set Protein Temp
              </Button>
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </Box>
  );
}

export default Monitor;
