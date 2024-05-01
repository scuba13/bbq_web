import React, { useState, useEffect } from "react";
import { Button, Card, CardContent, TextField, Typography } from "@mui/material";
import SettingsApplicationsIcon from '@mui/icons-material/SettingsApplications';
import { getAiConfig, updateAIConfig } from "../../Api"; // Ajuste o caminho conforme necessário

function AIConfig() {
  const [aiConfig, setAiConfig] = useState({
    aiKey: "",
    tip: "",
  });

  // Fetch initial AI configuration when the component mounts
  useEffect(() => {
    async function fetchAIConfig() {
      try {
        const config = await getAiConfig();
        setAiConfig({
          aiKey: config.aiKey || "", // Use fallback to empty string if undefined
          tip: config.tip || "",     // Use fallback to empty string if undefined
        });
      } catch (error) {
        alert(`Failed to fetch AI configuration: ${error.message}`);
      }
    }

    fetchAIConfig();
  }, []);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setAiConfig((prevConfig) => ({
      ...prevConfig,
      [name]: value,
    }));
  };

  const handleSubmit = async () => {
    try {
      const { aiKey, tip } = aiConfig;
      const message = await updateAIConfig(aiKey, tip);
      alert(`AI configuration updated successfully: ${message}`);
    } catch (error) {
      alert(`Error updating AI configuration: ${error.message}`);
    }
  };

  return (
    <Card variant="outlined">
      <CardContent>
        <Typography
          variant="h6"
          gutterBottom
          style={{ display: "flex", alignItems: "center" }}
        >
          <SettingsApplicationsIcon style={{ fontSize: 30, marginRight: 5 }} />
          AI Configuration
        </Typography>
        <TextField
          name="aiKey"
          label="AI Key"
          value={aiConfig.aiKey}
          onChange={handleInputChange}
          fullWidth
          margin="normal"
        />
        <TextField
          name="tip"
          label="Tip"
          value={aiConfig.tip}
          onChange={handleInputChange}
          fullWidth
          margin="normal"
        />
        <Button
          variant="contained"
          onClick={handleSubmit}
          fullWidth
          style={{ marginTop: 20 }}
        >
          Update AI Config
        </Button>
      </CardContent>
    </Card>
  );
}

export default AIConfig;
