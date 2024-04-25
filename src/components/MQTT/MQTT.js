import React, { useState, useEffect } from "react";
import {
  Button,
  Card,
  CardContent,
  Checkbox,
  FormControlLabel,
  TextField,
  Typography,
} from "@mui/material";
import { getMQTTConfig, updateMQTTConfig } from "../../Api";
import LinkIcon from "@mui/icons-material/Link";

function MQTTConfig() {
  const [mqttConfig, setMqttConfig] = useState({
    mqttServer: "",
    mqttPort: "",
    mqttUser: "",
    mqttPassword: "",
    isHAAvailable: false,
  });

  useEffect(() => {
    const fetchHAConfig = async () => {
      try {
        const config = await getMQTTConfig();
        setMqttConfig(config);
      } catch (error) {
        console.error("Error fetching HA config:", error);
      }
    };
    fetchHAConfig();
  }, []);

  const handleUpdateConfig = async () => {
    try {
      await updateMQTTConfig(mqttConfig);
      alert("Config updated successfully");
    } catch (error) {
      alert(`Error updating config: ${error.message}`);
    }
  };

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    const newValue = type === "checkbox" ? checked : value;
    setMqttConfig((prevConfig) => ({
      ...prevConfig,
      [name]: newValue,
    }));
  };

  return (
    <Card variant="outlined">
      <CardContent>
      <Typography variant="subtitle1" gutterBottom style={{ display: "flex", alignItems: "center" }}>
        <LinkIcon style={{ fontSize: 30, marginRight: 5 }} />
        MQTT Device Configuration
      </Typography>

        <TextField
          name="mqttServer"
          label="MQTT Server"
          value={mqttConfig.mqttServer}
          onChange={handleInputChange}
          fullWidth
          margin="normal"
        />
        <TextField
          name="mqttPort"
          label="MQTT Port"
          value={mqttConfig.mqttPort}
          onChange={handleInputChange}
          fullWidth
          margin="normal"
        />
        <TextField
          name="mqttUser"
          label="MQTT User"
          value={mqttConfig.mqttUser}
          onChange={handleInputChange}
          fullWidth
          margin="normal"
        />
        <TextField
          name="mqttPassword"
          label="MQTT Password"
          type="password"
          value={mqttConfig.mqttPassword}
          onChange={handleInputChange}
          fullWidth
          margin="normal"
        />
        <FormControlLabel
          control={
            <Checkbox
              name="isHAAvailable"
              checked={mqttConfig.isHAAvailable}
              onChange={handleInputChange}
            />
          }
          label="Is HA Available"
        />
        <Button variant="contained" onClick={handleUpdateConfig} fullWidth>
          Save Config
        </Button>
      </CardContent>
    </Card>
  );
}

export default MQTTConfig;
