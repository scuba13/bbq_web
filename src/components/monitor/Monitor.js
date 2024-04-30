import React, { useState, useEffect } from "react";
import { getTemperatureData, setTemperature, setProteinTemp } from "../../Api";
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
      // Mapping the API response to display '--' if the value is zero
      const mappedData = {
        ...data,
        currentTemp: data.currentTemp > 0 ? data.currentTemp : "--",
        setTemp: data.setTemp > 0 ? data.setTemp : "--",
        proteinTemp: data.proteinTemp > 0 ? data.proteinTemp : "--",
        proteinTempSet: data.proteinTempSet > 0 ? data.proteinTempSet : "--",
        avgTemp: data.avgTemp > 0 ? data.avgTemp : "--",
        relayState: data.relayState === "ON" ? "ON" : "OFF",
        minBBQTemp: data.minBBQTemp ,
        maxBBQTemp: data.maxBBQTemp ,
        minPrtTemp: data.minPrtTemp ,
        maxPrtTemp: data.maxPrtTemp ,
        minCaliTemp: data.minCaliTemp ,
        maxCaliTemp: data.maxCaliTemp ,
      };
      setTemps(mappedData);
    };

    fetchTemps();
    const intervalId = setInterval(fetchTemps, 1000);

    return () => clearInterval(intervalId);
  }, []);

  const handleSetBbqTemp = async () => {
    try {
      // Verifica se bbqTemp está dentro da faixa permitida (minBBQTemp a maxBBQTemp)
      if (bbqTemp < temps.minBBQTemp || bbqTemp > temps.maxBBQTemp) {
        throw new Error(`BBQ temperature must be between ${temps.minBBQTemp}°C and ${temps.maxBBQTemp}°C`);
      }
      const message = await setTemperature(bbqTemp);
      alert(message);
    } catch (error) {
      alert(`Error: ${error.message}`);
    }
  };
  
  
  const handleSetProteinTemp = async () => {
    try {
      // Verifica se proteinTempValue está dentro da faixa permitida
      if (proteinTempValue < temps.minPrtTemp || proteinTempValue > temps.maxPrtTemp) {
        throw new Error(`Chunk temperature must be between ${temps.minPrtTemp}°C and ${temps.maxPrtTemp}°C`);
      }
  
      const message = await setProteinTemp(proteinTempValue);
      alert(message);
    } catch (error) {
      alert(`Error: ${error.message}`);
    }
  };
  

  const getColorForTemperatureComparison = (current, set) => {
    if (current === "--" || set === "--") return "inherit"; // No color change if no data
    if (current > set) return "red";
    if (current < set) return "blue";
    return "green";
  };

  const tempTextStyle = {
    fontSize: "4rem", // Aumenta o tamanho da fonte das temperaturas
    fontWeight: "bold", // Deixa o texto em negrito
    display: "flex", // Usa flexbox para alinhar o conteúdo
    justifyContent: "center", // Centraliza o conteúdo horizontalmente
    alignItems: "center", // Centraliza o conteúdo verticalmente
    height: "100px", // Define uma altura para o container para que fique centralizado verticalmente
  };

  const headerStyle = {
    display: "flex",
    justifyContent: "space-between", // Distribui o espaço igualmente
    alignItems: "center", // Alinha itens verticalmente
  };

  const avgTempStyle = {
    fontSize: "1rem", // Ajuste para o tamanho da fonte do avgTemp
    fontWeight: "normal", // Ajuste para o peso da fonte
    // Outros estilos podem ser adicionados aqui conforme necessário
  };

  // Função para determinar o texto de status do Chunk
  const getChunkStatus = () => {
    if (temps.proteinTempSet === "--") {
      return "---"; // Retorna isto se algum dos valores não estiver disponível
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
            {/* Cabeçalho do Card com BBQ e Avg Temp, agora incluindo ícone de estado do relé */}
            <Box style={headerStyle}>
              <Typography
                variant="subtitle1"
                gutterBottom
                style={{ display: "flex", alignItems: "center" }}
              >
                {temps.relayState === "ON" ? (
                  <FireIcon
                    color="error"
                    style={{ fontSize: 30, marginRight: 5 }} // Increase size and add left margin
                  />
                ) : (
                  <FireOffIcon style={{ fontSize: 30, marginRight: 5 }} /> // Same adjustment for the "OFF" icon
                )}
                BBQ {/* Space added here */}
              </Typography>
              {/* Valor médio de Temperatura (Avg Temp) */}
              <Typography style={avgTempStyle}>
                Avg: {temps.avgTemp} C
              </Typography>
            </Box>
            {/* Temperatura Atual */}
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

            {/* Temperatura Definida */}
            <Typography color="textSecondary">{temps.setTemp} C</Typography>

            {/* Campo de Entrada para BBQ Temp */}
            <TextField
              type="number"
              value={bbqTemp}
              onChange={(e) => setBbqTemp(e.target.value)}
              inputProps={{ min: 30, max: 200 }}
              margin="normal"
              fullWidth
            />

            {/* Botão para definir a temperatura */}
            <Button variant="contained" onClick={handleSetBbqTemp} fullWidth>
              Set BBQ Temp
            </Button>
          </CardContent>
        </Card>
      </Grid>

      <Grid item xs={12} sm={6}>
        <Card variant="outlined">
          <CardContent>
            {/* Cabeçalho com o título e o texto condicional */}
            <Box style={headerStyle}>
              <Typography
                variant="subtitle1"
                gutterBottom
                style={{ display: "flex", alignItems: "center" }}
              >
                <Chunk
                  color="inherit" // Set the color as 'inherit' so the icon inherits the color of the surrounding text
                  style={{ fontSize: 30, marginRight: 5 }}
                />
                Chunk
              </Typography>
              <Typography style={{ fontSize: "1rem", fontWeight: "normal" }}>
                {getChunkStatus()}
              </Typography>
            </Box>
            {/* Temperatura Atual do Chunk */}
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
            {/* Temperatura Definida do Chunk */}
            <Typography color="textSecondary">
              {temps.proteinTempSet} C
            </Typography>
            {/* Campo de Entrada para a Temperatura do Chunk */}
            <TextField
              type="number"
              value={proteinTempValue}
              onChange={(e) => setProteinTempValue(e.target.value)}
              inputProps={{ min: 40, max: 99 }}
              margin="normal"
              fullWidth
            />
            {/* Botão para Definir a Temperatura do Chunk */}
            <Button
              variant="contained"
              onClick={handleSetProteinTemp}
              fullWidth
            >
              Set Protein Temp
            </Button>
          </CardContent>
        </Card>
      </Grid>
      {/* Outros Grid items conforme necessário */}
    </Grid>
  );
}

export default Monitor;
