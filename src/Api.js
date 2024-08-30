const baseUrl = "http://bbq.local:8080";
//const baseUrl = "/:8080";

// Função para buscar dados do servidor do endpoint /monitor
export const getTemperatureData = async () => {
  try {
    const response = await fetch(`${baseUrl}/api/v1/monitor`, {
      //mode: 'cors' // Adiciona o modo 'cors'
    });
    console.log("Response from monitor endpoint:", response);
    
    if (!response.ok) {
      throw new Error(`Error fetching data: ${response.statusText}`);
    }
    
    const responseData = await response.json();
    console.log("Data received from monitor endpoint:", responseData);

    // Extraindo os dados do campo 'data'
    const data = responseData.data;

    return {
      currentTemp: data.currentTemp,
      setTemp: data.setTemp,
      proteinTemp: data.proteinTemp,
      proteinTempSet: data.proteinTempSet,
      relayState: data.relayState,
      avgTemp: data.avgTemp,
      caliTemp: data.caliTemp,
      caliTempP: data.caliTempP,
      minBBQTemp: data.minBBQTemp,
      maxBBQTemp: data.maxBBQTemp,
      minPrtTemp: data.minPrtTemp,
      maxPrtTemp: data.maxPrtTemp,
      minCaliTemp: data.minCaliTemp,
      maxCaliTemp: data.maxCaliTemp,
      minCaliTempP: data.minCaliTempP,
      maxCaliTempP: data.maxCaliTempP,
      internalTemp: data.internalTemp
    };
  } catch (error) {
    console.error("Error fetching data from monitor endpoint:", error);
    throw error; // Aqui estava o erro, agora corrigido
  }
};

export const getMQTTConfig = async () => {
  try {
    const response = await fetch(`${baseUrl}/api/v1/mqtt/config`);
    if (!response.ok) throw new Error("Failed to fetch MQTT config");
    
    const responseData = await response.json();
    // Extraindo os dados do campo 'data'
    const data = responseData.data;

    return {
      mqttServer: data.mqttServer,
      mqttPort: parseInt(data.mqttPort, 10), // Garantindo que mqttPort seja um número inteiro
      mqttUser: data.mqttUser,
      mqttPassword: data.mqttPassword,
      isHAAvailable: data.isHAAvailable,
    };
  } catch (error) {
    console.error("Error loading MQTT config:", error);
    throw error;
  }
};


// Função para atualizar a configuração MQTT
export const updateMQTTConfig = async (
  mqttServer,
  mqttPort,
  mqttUser,
  mqttPassword,
  isHAAvailable
) => {
  try {
    // Validação dos parâmetros de entrada
    if (!mqttServer || typeof mqttServer !== "string") {
      throw new Error("Invalid or missing 'mqttServer'");
    }
    if (!Number.isInteger(mqttPort) || mqttPort <= 0 || mqttPort > 65535) {
      throw new Error("Invalid or missing 'mqttPort'");
    }
    if (!mqttUser || typeof mqttUser !== "string") {
      throw new Error("Invalid or missing 'mqttUser'");
    }
    if (!mqttPassword || typeof mqttPassword !== "string") {
      throw new Error("Invalid or missing 'mqttPassword'");
    }
    if (typeof isHAAvailable !== "boolean") {
      throw new Error("Invalid or missing 'isHAAvailable'");
    }

    // Convertendo mqttPort para um número se necessário
    const port = Number(mqttPort);

    // Construindo o corpo da requisição manualmente como string
    const body =
      `mqttServer=${encodeURIComponent(mqttServer)}&` +
      `mqttPort=${encodeURIComponent(port)}&` +
      `mqttUser=${encodeURIComponent(mqttUser)}&` +
      `mqttPassword=${encodeURIComponent(mqttPassword)}&` +
      `isHAAvailable=${encodeURIComponent(isHAAvailable)}`;

    // Enviando a requisição POST para o servidor
    const response = await fetch(`${baseUrl}/api/v1/mqtt/config`, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
      },
      body: body,
    });

    // Verificação da resposta
    if (!response.ok) throw new Error("Failed to update MQTT configuration");

    return "MQTT configuration updated successfully.";
  } catch (error) {
    console.error("Error updating MQTT Configuration:", error);
    throw error;
  }
};

// Função para enviar os quatro campos ao servidor
export const setTemperatureConfig = async (
  bbqTemperature,
  proteinTemperature,
  tempCalibration,
  tempCalibrationP
) => {
  try {
    // Construindo o corpo da requisição com os quatro parâmetros
    const body = 
      `bbqTemperature=${encodeURIComponent(bbqTemperature)}&` +
      `proteinTemperature=${encodeURIComponent(proteinTemperature)}&` +
      `tempCalibration=${encodeURIComponent(tempCalibration)}&` +
      `tempCalibrationP=${encodeURIComponent(tempCalibrationP)}`;

    const response = await fetch(`${baseUrl}/api/v1/temperature/config`, {
      method: "PATCH",  // Mudando para PATCH
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
      },
      body: body,
    });

    // Verificação da resposta
    if (!response.ok) throw new Error("Failed to set temperature configuration");

    const result = await response.json();  // Ajuste para ler a resposta JSON
    return result.message;  // Ajuste para retornar a mensagem da resposta
  } catch (error) {
    console.error("Error setting temperature configuration:", error);
    throw error;
  }
};

export const resetSystem = async () => {
  try {
    const response = await fetch(`${baseUrl}/api/v1/system/reset`, { method: "POST" });
    if (!response.ok) throw new Error("Failed to reset system");
    return "System reset successfully.";
  } catch (error) {
    console.error("Error resetting system:", error);
    throw error;
  }
};

// Função para ativar o processo de cura
export const activateCure = async () => {
  try {
    // Enviando a requisição POST para o servidor
    const response = await fetch(`${baseUrl}/api/v1/system/activateCure`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
    });

    // Verificação da resposta
    if (!response.ok) throw new Error("Failed to activate cure process");

    const responseData = await response.json();

    // Verifica se a resposta tem a estrutura correta
    if (responseData && responseData.message) {
      return responseData.message;
    } else {
      throw new Error("Unexpected response structure");
    }
  } catch (error) {
    console.error("Error activating cure process:", error);
    throw error;
  }
};


// Função para buscar o conteúdo do log do servidor
export const getLogContent = async () => {
  try {
    const response = await fetch(`${baseUrl}/api/v1/log/content`);
    if (!response.ok) throw new Error("Failed to fetch log content");

    // Parse da resposta como JSON
    const jsonResponse = await response.json();

    // Verifica se a estrutura da resposta contém o campo logContent
    if (jsonResponse.data && jsonResponse.data.logContent) {
      return jsonResponse.data.logContent;
    } else {
      throw new Error("Log content not found in response");
    }
  } catch (error) {
    console.error("Error fetching log content:", error);
    throw error;
  }
};

/**
 * Função para enviar um arquivo de firmware para atualização OTA.
 * @param {File} file - O arquivo de firmware para upload.
 */
export const uploadFirmware = async (file) => {
  try {
    const formData = new FormData();
    formData.append("update", file); // 'update' é o nome do campo que o servidor espera

    const response = await fetch(`${baseUrl}/api/v1/system/updateFirmware`, {
      method: "POST",
      body: formData, // FormData será enviado como 'multipart/form-data'
    });

    if (!response.ok) throw new Error("Failed to upload firmware");

    const result = await response.text(); // Supondo que a resposta seja texto
    return result; // Retorna a resposta do servidor
  } catch (error) {
    console.error("Error uploading firmware:", error);
    throw error;
  }
};

// Função para obter a configuração de temperatura
export const getTempConfig = async () => {
  try {
    const response = await fetch(`${baseUrl}/api/v1/temp/config`);
    if (!response.ok)
      throw new Error("Falha ao buscar configuração de temperatura");

    const result = await response.json();

    // Certificando-se de que estamos acessando o nó 'data'
    const data = result.data;

    // Retornar os campos específicos
    return {
      minBBQTemp: data.minBBQTemp,
      maxBBQTemp: data.maxBBQTemp,
      minPrtTemp: data.minPrtTemp,
      maxPrtTemp: data.maxPrtTemp,
      minCaliTemp: data.minCaliTemp,
      maxCaliTemp: data.maxCaliTemp,
      minCaliTempP: data.minCaliTempP,
      maxCaliTempP: data.maxCaliTempP,
    };
  } catch (error) {
    console.error("Erro ao carregar configuração de temperatura:", error);
    throw error;
  }
};


// Função para atualizar a configuração de temperatura
export const updateTempConfig = async (
  minBBQTemp,
  maxBBQTemp,
  minPrtTemp,
  maxPrtTemp,
  minCaliTemp,
  maxCaliTemp,
  minCaliTempP,
  maxCaliTempP
) => {
  try {
    // Validar os parâmetros de entrada
    const isValidTemperature = (temp) => typeof temp === "number" && !isNaN(temp);

    if (!isValidTemperature(minBBQTemp)) {
      throw new Error("Valor inválido ou ausente para 'minBBQTemp'");
    }
    if (!isValidTemperature(maxBBQTemp)) {
      throw new Error("Valor inválido ou ausente para 'maxBBQTemp'");
    }
    if (!isValidTemperature(minPrtTemp)) {
      throw new Error("Valor inválido ou ausente para 'minPrtTemp'");
    }
    if (!isValidTemperature(maxPrtTemp)) {
      throw new Error("Valor inválido ou ausente para 'maxPrtTemp'");
    }
    if (!isValidTemperature(minCaliTemp)) {
      throw new Error("Valor inválido ou ausente para 'minCaliTemp'");
    }
    if (!isValidTemperature(maxCaliTemp)) {
      throw new Error("Valor inválido ou ausente para 'maxCaliTemp'");
    }
    if (!isValidTemperature(minCaliTempP)) {
      throw new Error("Valor inválido ou ausente para 'minCaliTempP'");
    }
    if (!isValidTemperature(maxCaliTempP)) {
      throw new Error("Valor inválido ou ausente para 'maxCaliTempP'");
    }

    // Construir manualmente os dados do corpo da requisição POST como uma string
    const body =
      `minBBQTemp=${encodeURIComponent(minBBQTemp)}&` +
      `maxBBQTemp=${encodeURIComponent(maxBBQTemp)}&` +
      `minPrtTemp=${encodeURIComponent(minPrtTemp)}&` +
      `maxPrtTemp=${encodeURIComponent(maxPrtTemp)}&` +
      `minCaliTemp=${encodeURIComponent(minCaliTemp)}&` +
      `maxCaliTemp=${encodeURIComponent(maxCaliTemp)}&` +
      `minCaliTempP=${encodeURIComponent(minCaliTempP)}&` +
      `maxCaliTempP=${encodeURIComponent(maxCaliTempP)}`;
      

    // Enviar a requisição PATCH para o servidor
    const response = await fetch(`${baseUrl}/api/v1/temp/config`, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
      },
      body: body,
    });

    // Verificar a resposta
    if (!response.ok)
      throw new Error("Falha ao atualizar a configuração de temperatura");

    return "Configuração de temperatura atualizada com sucesso.";
  } catch (error) {
    console.error("Erro ao atualizar a configuração de temperatura:", error);
    throw error;
  }
};

// Função para obter a configuração de AI
export const getAiConfig = async () => {
  try {
    const response = await fetch(`${baseUrl}/api/v1/ai/config`);
    
    if (!response.ok)
      throw new Error("Falha ao buscar configuração de AI");

    const responseData = await response.json();

    // Extraindo os dados do campo 'data'
    const data = responseData.data;

    // Retornar os campos específicos
    return {
      aiKey: data.aiKey,
      tip: data.tip,
    };
  } catch (error) {
    console.error("Erro ao carregar configuração de AI:", error);
    throw error;
  }
};

// Função para atualizar a configuração de AI
export const updateAIConfig = async (aiKey, tip) => {
  try {
    // Validar os parâmetros de entrada
    if (!aiKey || typeof aiKey !== 'string') {
      throw new Error("Invalid or missing 'aiKey'");
    }
    if (!tip || typeof tip !== 'string') {
      throw new Error("Invalid or missing 'tip'");
    }

    // Construir manualmente os dados do corpo da requisição POST como uma string
    const body = `aiKey=${encodeURIComponent(aiKey)}&tip=${encodeURIComponent(tip)}`;

    // Enviar a requisição PATCH para o servidor
    const response = await fetch(`${baseUrl}/api/v1/ai/config`, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      body: body,
    });

    // Verificar a resposta
    if (!response.ok) throw new Error("Falha ao atualizar a configuração de AI");

    return "Configuração de AI atualizada com sucesso.";
  } catch (error) {
    console.error("Erro ao atualizar a configuração de AI:", error);
    throw error;
  }
};

