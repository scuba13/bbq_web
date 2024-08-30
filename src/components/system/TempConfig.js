import React, { useState, useEffect } from "react";
import {
  Button,
  Card,
  CardContent,
  TextField,
  Typography,
} from "@mui/material";
import {
  getTempConfig,
  updateTempConfig,
  setTemperatureConfig,
} from "../../Api";
import ThermostatIcon from "@mui/icons-material/Thermostat";

function TempConfig() {
  const [tempConfig, setTempConfig] = useState({
    minBBQTemp: "",
    maxBBQTemp: "",
    minPrtTemp: "",
    maxPrtTemp: "",
    minCaliTemp: "",
    maxCaliTemp: "",
    minCaliTempP: "",
    maxCaliTempP: "",
  });
  const [calibrationBBQ, setCalibrationBBQ] = useState(""); // State for BBQ calibration value
  const [calibrationProtein, setCalibrationProtein] = useState(""); // State for Protein calibration value

  useEffect(() => {
    const fetchTempConfig = async () => {
      try {
        const config = await getTempConfig();
        console.log("Fetched Config from API:", config);
        setTempConfig(config);
      } catch (error) {
        console.error("Error fetching temperature config:", error);
      }
    };

    fetchTempConfig();
  }, []);

  const handleUpdateConfig = async () => {
    try {
      const {
        minBBQTemp,
        maxBBQTemp,
        minPrtTemp,
        maxPrtTemp,
        minCaliTemp,
        maxCaliTemp,
        minCaliTempP,
        maxCaliTempP,
      } = tempConfig;

      if (
        !isValidTemperature(minBBQTemp) ||
        !isValidTemperature(maxBBQTemp) ||
        !isValidTemperature(minPrtTemp) ||
        !isValidTemperature(maxPrtTemp) ||
        !isValidTemperature(minCaliTemp) ||
        !isValidTemperature(maxCaliTemp) ||
        !isValidTemperature(minCaliTempP) ||
        !isValidTemperature(maxCaliTempP)
      ) {
        throw new Error("One or more temperature fields are invalid");
      }

      await updateTempConfig(
        parseInt(minBBQTemp),
        parseInt(maxBBQTemp),
        parseInt(minPrtTemp),
        parseInt(maxPrtTemp),
        parseInt(minCaliTemp),
        parseInt(maxCaliTemp),
        parseInt(minCaliTempP),
        parseInt(maxCaliTempP)
      );

      alert("Temperature config updated successfully");
    } catch (error) {
      alert(`Error updating temperature config: ${error.message}`);
    }
  };

  const handleSetCalibration = async () => {
    // Validate calibration values are within the fetched limits
    if (
      calibrationBBQ < tempConfig.minCaliTemp ||
      calibrationBBQ > tempConfig.maxCaliTemp ||
      calibrationProtein < tempConfig.minCaliTempP ||
      calibrationProtein > tempConfig.maxCaliTempP
    ) {
      alert(
        `Calibration values must be within their respective ranges.`
      );
      return;
    }

    try {
      // Use setTemperatureConfig to set both calibration values
      const message = await setTemperatureConfig(
        calibrationBBQ, // BBQ calibration value
        calibrationProtein // Protein calibration value
      );
      alert(`Calibration set successfully: ${message}`);
    } catch (error) {
      alert(`Error setting calibration: ${error.message}`);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setTempConfig((prevConfig) => ({
      ...prevConfig,
      [name]: value,
    }));
  };

  const isValidTemperature = (temperature) => {
    return !isNaN(temperature) && temperature !== "";
  };

  return (
    <Card variant="outlined">
      <CardContent>
        <Typography
          variant="subtitle1"
          gutterBottom
          style={{ display: "flex", alignItems: "center" }}
        >
          <ThermostatIcon style={{ fontSize: 30, marginRight: 5 }} />
          Temperature Configuration
        </Typography>

        <TextField
          name="minBBQTemp"
          label="Min BBQ Temp"
          value={tempConfig.minBBQTemp}
          onChange={handleInputChange}
          fullWidth
          margin="normal"
          type="number"
        />
        <TextField
          name="maxBBQTemp"
          label="Max BBQ Temp"
          value={tempConfig.maxBBQTemp}
          onChange={handleInputChange}
          fullWidth
          margin="normal"
          type="number"
        />
        <TextField
          name="minPrtTemp"
          label="Min Protein Temp"
          value={tempConfig.minPrtTemp}
          onChange={handleInputChange}
          fullWidth
          margin="normal"
          type="number"
        />
        <TextField
          name="maxPrtTemp"
          label="Max Protein Temp"
          value={tempConfig.maxPrtTemp}
          onChange={handleInputChange}
          fullWidth
          margin="normal"
          type="number"
        />
        <TextField
          name="minCaliTemp"
          label="Min Calibration BBQ Temp"
          value={tempConfig.minCaliTemp}
          onChange={handleInputChange}
          fullWidth
          margin="normal"
          type="number"
        />
        <TextField
          name="maxCaliTemp"
          label="Max Calibration BBQ Temp"
          value={tempConfig.maxCaliTemp}
          onChange={handleInputChange}
          fullWidth
          margin="normal"
          type="number"
        />
        <TextField
          name="minCaliTempP"
          label="Min Calibration Protein Temp"
          value={tempConfig.minCaliTempP}
          onChange={handleInputChange}
          fullWidth
          margin="normal"
          type="number"
        />
        <TextField
          name="maxCaliTempP"
          label="Max Calibration Protein Temp"
          value={tempConfig.maxCaliTempP}
          onChange={handleInputChange}
          fullWidth
          margin="normal"
          type="number"
        />
        <Button
          variant="contained"
          onClick={handleUpdateConfig}
          fullWidth
          style={{ marginTop: 20 }}
        >
          Save Config
        </Button>

        <TextField
          label="Calibration Value BBQ"
          value={calibrationBBQ}
          onChange={(e) => setCalibrationBBQ(e.target.value)}
          inputProps={{
            type: "number",
            min: tempConfig.minCaliTemp,
            max: tempConfig.maxCaliTemp,
          }}
          fullWidth
          margin="normal"
          type="number"
        />
        <TextField
          label="Calibration Value Protein"
          value={calibrationProtein}
          onChange={(e) => setCalibrationProtein(e.target.value)}
          inputProps={{
            type: "number",
            min: tempConfig.minCaliTempP,
            max: tempConfig.maxCaliTempP,
          }}
          fullWidth
          margin="normal"
          type="number"
        />
        <Button variant="contained" onClick={handleSetCalibration} fullWidth>
          Set Calibration
        </Button>
      </CardContent>
    </Card>
  );
}

export default TempConfig;
