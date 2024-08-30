import React, { useState, useEffect } from "react";
import { getTemperatureData, setTemperatureConfig } from "../../Api";
import {
  Card,
  CardContent,
  Typography,
  TextField,
  Button,
  Grid,
  Box,
} from "@mui/material";

import FireIcon from "@mui/icons-material/Whatshot";
import FireOffIcon from "@mui/icons-material/WhatshotOutlined";
import Chunk from "@mui/icons-material/Savings";

function Monitor() {
  const [temps, setTemps] = useState({
    currentTemp: "--",
    setTemp: "--",
    proteinTemp: "--",
    proteinTempSet: "--",
    relayState: "--",
    avgTemp: "--",
    minBBQTemp: "--",
    maxBBQTemp: "--",
    minPrtTemp: "--",
    maxPrtTemp: "--",
    minCaliTemp: "--",
    maxCaliTemp: "--",
  });

  const [bbqTemp, setBbqTemp] = useState("");
  const [proteinTempValue, setProteinTempValue] = useState("");

  useEffect(() => {
    const fetchTemps = async () => {
      const data = await getTemperatureData();
      const mappedData = {
        ...data,
        currentTemp: data.currentTemp > 0 ? data.currentTemp : "--",
        setTemp: data.setTemp > 0 ? data.setTemp : "--",
        proteinTemp: data.proteinTemp > 0 ? data.proteinTemp : "--",
        proteinTempSet: data.proteinTempSet > 0 ? data.proteinTempSet : "--",
        avgTemp: data.avgTemp > 0 ? data.avgTemp : "--",
        relayState: data.relayState === "ON" ? "ON" : "OFF",
        minBBQTemp: data.minBBQTemp,
        maxBBQTemp: data.maxBBQTemp,
        minPrtTemp: data.minPrtTemp,
        maxPrtTemp: data.maxPrtTemp,
        minCaliTemp: data.minCaliTemp,
        maxCaliTemp: data.maxCaliTemp,
      };
      setTemps(mappedData);
    };

    fetchTemps();
    const intervalId = setInterval(fetchTemps, 1000);

    return () => clearInterval(intervalId);
  }, []);

  const handleSetTemperatureConfig = async () => {
    try {
      // Verifica se bbqTemp está dentro da faixa permitida para BBQ
      if (parseFloat(bbqTemp) < parseFloat(temps.minBBQTemp) || parseFloat(bbqTemp) > parseFloat(temps.maxBBQTemp)) {
        throw new Error(`BBQ temperature must be between ${temps.minBBQTemp}°C and ${temps.maxBBQTemp}°C`);
      }
      
      // Verifica se proteinTempValue está dentro da faixa permitida para proteína
      if (parseFloat(proteinTempValue) < parseFloat(temps.minPrtTemp) || parseFloat(proteinTempValue) > parseFloat(temps.maxPrtTemp)) {
        throw new Error(`Protein temperature must be between ${temps.minPrtTemp}°C and ${temps.maxPrtTemp}°C`);
      }
  
      // Define minCaliTemp e maxCaliTemp como vazios independentemente dos valores atuais
      const minCaliTemp = "";
      const maxCaliTemp = "";
  
      // Chama a função combinada para definir as temperaturas
      const message = await setTemperatureConfig(bbqTemp, proteinTempValue, minCaliTemp, maxCaliTemp);
      alert(message);
    } catch (error) {
      alert(`Error: ${error.message}`);
    }
  };
  

  const getColorForTemperatureComparison = (current, set) => {
    if (current === "--" || set === "--") return "inherit"; 
    if (current > set) return "red";
    if (current < set) return "blue";
    return "green";
  };

  const tempTextStyle = {
    fontSize: "4rem",
    fontWeight: "bold",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    height: "100px",
  };

  const headerStyle = {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
  };

  const avgTempStyle = {
    fontSize: "1rem",
    fontWeight: "normal",
  };

  const getChunkStatus = () => {
    if (temps.proteinTempSet === "--") {
      return "---";
    }
    if (temps.proteinTemp > temps.proteinTempSet) {
      return "Charcoal Special";
    } else if (temps.proteinTemp < temps.proteinTempSet) {
      return "Still Mooing";
    } else {
      return "Happy As a Pig In Mud";
    }
  };

  return (
    <Grid container spacing={2}>
      <Grid item xs={12} sm={6}>
        <Card variant="outlined">
          <CardContent>
            <Box style={headerStyle}>
              <Typography
                variant="subtitle1"
                gutterBottom
                style={{ display: "flex", alignItems: "center" }}
              >
                {temps.relayState === "ON" ? (
                  <FireIcon
                    color="error"
                    style={{ fontSize: 30, marginRight: 5 }}
                  />
                ) : (
                  <FireOffIcon style={{ fontSize: 30, marginRight: 5 }} />
                )}
                BBQ
              </Typography>
              <Typography style={avgTempStyle}>
                Avg: {temps.avgTemp} C
              </Typography>
            </Box>
            <Typography
              component="h2"
              style={{
                ...tempTextStyle,
                color: getColorForTemperatureComparison(
                  temps.currentTemp,
                  temps.setTemp
                ),
              }}
            >
              {temps.currentTemp} C
            </Typography>
            <Typography color="textSecondary">{temps.setTemp} C</Typography>
            <TextField
              type="number"
              value={bbqTemp}
              onChange={(e) => setBbqTemp(e.target.value)}
              inputProps={{ min: temps.minBBQTemp, max: temps.maxBBQTemp }}
              margin="normal"
              fullWidth
            />
            <Button variant="contained" onClick={handleSetTemperatureConfig} fullWidth>
              Set BBQ Temp
            </Button>
          </CardContent>
        </Card>
      </Grid>

      <Grid item xs={12} sm={6}>
        <Card variant="outlined">
          <CardContent>
            <Box style={headerStyle}>
              <Typography
                variant="subtitle1"
                gutterBottom
                style={{ display: "flex", alignItems: "center" }}
              >
                <Chunk
                  color="inherit"
                  style={{ fontSize: 30, marginRight: 5 }}
                />
                Chunk
              </Typography>
              <Typography style={{ fontSize: "1rem", fontWeight: "normal" }}>
                {getChunkStatus()}
              </Typography>
            </Box>
            <Typography
              component="h2"
              style={{
                ...tempTextStyle,
                color: getColorForTemperatureComparison(
                  temps.proteinTemp,
                  temps.proteinTempSet
                ),
              }}
            >
              {temps.proteinTemp} C
            </Typography>
            <Typography color="textSecondary">
              {temps.proteinTempSet} C
            </Typography>
            <TextField
              type="number"
              value={proteinTempValue}
              onChange={(e) => setProteinTempValue(e.target.value)}
              inputProps={{ min: temps.minPrtTemp, max: temps.maxPrtTemp }}
              margin="normal"
              fullWidth
            />
            <Button
              variant="contained"
              onClick={handleSetTemperatureConfig}
              fullWidth
            >
              Set Protein Temp
            </Button>
          </CardContent>
        </Card>
      </Grid>
    </Grid>
  );
}

export default Monitor;
