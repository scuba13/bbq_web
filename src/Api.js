const baseUrl = 'http://bbq.local/';
//const baseUrl = "192.168.10.129/";

// Função para buscar dados do servidor do endpoint /monitor
export const getTemperatureData = async () => {
  try {
    const response = await fetch(`${baseUrl}monitor`);
    console.log("Response from monitor endpoint:", response);
    const data = await response.json();
    console.log("Data received from monitor endpoint:", data);
    return {
      currentTemp: data.currentTemp,
      setTemp: data.setTemp,
      proteinTemp: data.proteinTemp,
      proteinTempSet: data.proteinTempSet,
      relayState: data.relayState,
      avgTemp: data.avgTemp,
    };
  } catch (error) {
    console.error("Error fetching data from monitor endpoint:", error);
    throw error;
  }
};

// // Funções para buscar dados do servidor
// export const getTemperatureData = async () => {
//     try {
//         // Gerando dados aleatórios para simular uma resposta dinâmica do servidor
//         const mockData = {
//             currentTemp: Math.floor(Math.random() * 100),
//             setTemp: Math.floor(Math.random() * 100),
//             proteinTemp: Math.floor(Math.random() * 100),
//             proteinTempSet: Math.floor(Math.random() * 100),
//             relayState: Math.random() > 0.5 ? 'ON' : 'OFF',
//             avgTemp: Math.floor(Math.random() * 100)

//         };

//         // Simulando um pequeno atraso de resposta
//         await new Promise(resolve => setTimeout(resolve, 1000));

//         console.log('Mock Response from getTemperatureData:', mockData);
//         return mockData;
//     } catch (error) {
//         console.error('Error fetching temperature data:', error);
//         throw error;
//     }
// };

export const getMQTTConfig = async () => {
  try {
    const response = await fetch(`${baseUrl}getMQTTConfig`);
    if (!response.ok) throw new Error("Failed to fetch HA config");
    return await response.json();
  } catch (error) {
    console.error("Error loading HA config:", error);
    throw error;
  }
};



// Function to update MQTT configuration
export const updateMQTTConfig = async (mqttServer, mqttPort, mqttUser, mqttPassword, isHAAvailable) => {
  try {
    // Validate input parameters
    if (!mqttServer || typeof mqttServer !== 'string') {
      throw new Error("Invalid or missing 'mqttServer'");
    }
    if (!mqttPort || typeof mqttPort !== 'number') {
      throw new Error("Invalid or missing 'mqttPort'");
    }
    if (!mqttUser || typeof mqttUser !== 'string') {
      throw new Error("Invalid or missing 'mqttUser'");
    }
    if (!mqttPassword || typeof mqttPassword !== 'string') {
      throw new Error("Invalid or missing 'mqttPassword'");
    }
    if (typeof isHAAvailable !== 'boolean') {
      throw new Error("Invalid or missing 'isHAAvailable'");
    }

    // Manually construct the POST body data as a string
    const body = `mqttServer=${encodeURIComponent(mqttServer)}&` +
                 `mqttPort=${encodeURIComponent(mqttPort)}&` +
                 `mqttUser=${encodeURIComponent(mqttUser)}&` +
                 `mqttPassword=${encodeURIComponent(mqttPassword)}&` +
                 `isHAAvailable=${encodeURIComponent(isHAAvailable)}`;

    // Sending the POST request to the server
    const response = await fetch(`${baseUrl}updateMQTTConfig`, {
      method: "POST",
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
      },
      body: body
    });

    // Check the response
    if (!response.ok) throw new Error("Failed to update HA configuration");

    return "HA configuration updated successfully.";
  } catch (error) {
    console.error("Error updating HA Configuration:", error);
    throw error;
  }
};



export const getLogContent = async () => {
  try {
    const response = await fetch(`${baseUrl}getLogContent`);
    if (!response.ok) throw new Error("Failed to fetch log content");
    return await response.text();
  } catch (error) {
    console.error("Error fetching log content:", error);
    throw error;
  }
};

// Funções para enviar dados ao servidor
export const setTemperature = async (temperature) => {
  try {
    const response = await fetch(`${baseUrl}setTemp`, {
      method: "POST",
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
      },
      body: `temp=${encodeURIComponent(temperature)}`,
    });
    if (!response.ok) throw new Error("Failed to set temperature");
    return "Temperature set successfully.";
  } catch (error) {
    console.error("Error setting BBQ Temperature:", error);
    throw error;
  }
};

export const setProteinTemp = async (proteinTemp) => {
  try {
    const response = await fetch(`${baseUrl}setProteinTemp`, {
      method: "POST",
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
      },
      body: `proteinTemp=${encodeURIComponent(proteinTemp)}`,
    });
    if (!response.ok) throw new Error("Failed to set Protein Temperature");
    return "Protein Temperature set successfully.";
  } catch (error) {
    console.error("Error setting Protein Temperature:", error);
    throw error;
  }
};

export const setTempCalibration = async (calibration) => {
  try {
    const response = await fetch(`${baseUrl}setTempCalibration`, {
      method: "POST",
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
      },
      body: `tempCalibration=${encodeURIComponent(calibration)}`,
    });
    if (!response.ok) throw new Error("Failed to set temperature calibration");
    return "Temperature calibration set successfully.";
  } catch (error) {
    console.error("Error setting temperature calibration:", error);
    throw error;
  }
};

export const resetSystem = async () => {
  try {
    const response = await fetch(`${baseUrl}resetSystem`, { method: "POST" });
    if (!response.ok) throw new Error("Failed to reset system");
    return "System reset successfully.";
  } catch (error) {
    console.error("Error resetting system:", error);
    throw error;
  }
};

export const activateCure = async () => {
  try {
    const response = await fetch(`${baseUrl}activateCure`, { method: "POST" });
    if (!response.ok) throw new Error("Failed to activate cure process");
    return "Cure process activated successfully.";
  } catch (error) {
    console.error("Error activating cure process:", error);
    throw error;
  }
};
