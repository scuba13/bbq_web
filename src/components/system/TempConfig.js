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
  setTempCalibration,
  getTemperatureData,
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
  });
  const [calibrationValue, setCalibrationValue] = useState(""); // State for calibration value

  useEffect(() => {
    const fetchTempConfig = async () => {
      try {
        const config = await getTempConfig();
        setTempConfig(config);
      } catch (error) {
        console.error("Error fetching temperature config:", error);
      }
    };

    // Fetch calibration limits from the server
    const fetchCalibrationLimits = async () => {
      try {
        const data = await getTemperatureData();
        setTempConfig((prev) => ({
          ...prev,
          minCaliTemp: data.minCaliTemp,
          maxCaliTemp: data.maxCaliTemp,
        }));
      } catch (error) {
        console.error("Error fetching calibration limits:", error);
      }
    };

    fetchTempConfig();
    fetchCalibrationLimits();
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
      } = tempConfig;

      if (
        !isValidTemperature(minBBQTemp) ||
        !isValidTemperature(maxBBQTemp) ||
        !isValidTemperature(minPrtTemp) ||
        !isValidTemperature(maxPrtTemp) ||
        !isValidTemperature(minCaliTemp) ||
        !isValidTemperature(maxCaliTemp)
      ) {
        throw new Error("One or more temperature fields are invalid");
      }

      await updateTempConfig(
        parseInt(minBBQTemp),
        parseInt(maxBBQTemp),
        parseInt(minPrtTemp),
        parseInt(maxPrtTemp),
        parseInt(minCaliTemp),
        parseInt(maxCaliTemp)
      );

      alert("Temperature config updated successfully");
    } catch (error) {
      alert(`Error updating temperature config: ${error.message}`);
    }
  };

  const handleSetCalibration = async () => {
    // Validate calibration value is within the fetched limits
    if (
      calibrationValue < tempConfig.minCaliTemp ||
      calibrationValue > tempConfig.maxCaliTemp
    ) {
      alert(
        `Calibration value must be between ${tempConfig.minCaliTemp} and ${tempConfig.maxCaliTemp}.`
      );
      return;
    }

    try {
      const message = await setTempCalibration(calibrationValue);
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
          label="Min Calibration Temp"
          value={tempConfig.minCaliTemp}
          onChange={handleInputChange}
          fullWidth
          margin="normal"
          type="number"
        />
        <TextField
          name="maxCaliTemp"
          label="Max Calibration Temp"
          value={tempConfig.maxCaliTemp}
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
          label="Calibration Value"
          value={calibrationValue}
          onChange={(e) => setCalibrationValue(e.target.value)}
          inputProps={{
            type: "number",
            min: tempConfig.minCaliTemp,
            max: tempConfig.maxCaliTemp,
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
