// Dispositivo real:  "http://bbq.local"
// Mock local:        "http://localhost:8080"
// Servido pelo ESP32 (produção): ""
const baseUrl = "http://localhost:8080";

// ---------------------------------------------------------------------------
// Monitor
// ---------------------------------------------------------------------------

export const getTemperatureData = async () => {
  const response = await fetch(`${baseUrl}/api/v1/monitor`);
  if (!response.ok) throw new Error(`Erro ao buscar monitor: ${response.statusText}`);

  const { data } = await response.json();
  return {
    bbqCurrentTemp:  data.bbqCurrentTemp,
    bbqSetpoint:     data.bbqSetpoint,
    proteinCurrentTemp: data.proteinCurrentTemp,
    proteinSetpoint: data.proteinSetpoint,
    proteinReached:  data.proteinReached ?? false,
    relayState:      data.relayState,
    avgTemp:         data.avgTemp,
    caliTemp:        data.caliTemp,
    caliTempP:       data.caliTempP,
    internalTemp:    data.internalTemp,
    minBBQTemp:      data.minBBQTemp,
    maxBBQTemp:      data.maxBBQTemp,
    minPrtTemp:      data.minPrtTemp,
    maxPrtTemp:      data.maxPrtTemp,
    minCaliTemp:     data.minCaliTemp,
    maxCaliTemp:     data.maxCaliTemp,
    minCaliTempP:    data.minCaliTempP,
    maxCaliTempP:    data.maxCaliTempP,
  };
};

// ---------------------------------------------------------------------------
// Setpoints de temperatura — chamadas separadas para evitar enviar ambos juntos
// ---------------------------------------------------------------------------

export const setBBQTemperature = async (temp) => {
  const body = `bbqTemperature=${encodeURIComponent(temp)}`;
  const response = await fetch(`${baseUrl}/api/v1/temperature/config`, {
    method: "PATCH",
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
    body,
  });
  if (!response.ok) {
    const err = await response.json().catch(() => ({}));
    throw new Error(err.message || `Erro ${response.status}`);
  }
  const result = await response.json();
  return result.message;
};

export const setProteinTemperature = async (temp) => {
  const body = `proteinTemperature=${encodeURIComponent(temp)}`;
  const response = await fetch(`${baseUrl}/api/v1/temperature/config`, {
    method: "PATCH",
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
    body,
  });
  if (!response.ok) {
    const err = await response.json().catch(() => ({}));
    throw new Error(err.message || `Erro ${response.status}`);
  }
  const result = await response.json();
  return result.message;
};

// Calibração (offset de ajuste fino) — parâmetros tempCalibration / tempCalibrationP
export const setCalibration = async (caliBBQ, caliProtein) => {
  const body =
    `tempCalibration=${encodeURIComponent(caliBBQ)}&` +
    `tempCalibrationP=${encodeURIComponent(caliProtein)}`;
  const response = await fetch(`${baseUrl}/api/v1/temperature/config`, {
    method: "PATCH",
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
    body,
  });
  if (!response.ok) {
    const err = await response.json().catch(() => ({}));
    throw new Error(err.message || `Erro ${response.status}`);
  }
  const result = await response.json();
  return result.message;
};

// ---------------------------------------------------------------------------
// Configuração de limites de temperatura
// ---------------------------------------------------------------------------

export const getTempConfig = async () => {
  const response = await fetch(`${baseUrl}/api/v1/temp/config`);
  if (!response.ok) throw new Error("Falha ao buscar configuração de temperatura");

  const { data } = await response.json();
  return {
    minBBQTemp:   data.minBBQTemp,
    maxBBQTemp:   data.maxBBQTemp,
    minPrtTemp:   data.minPrtTemp,
    maxPrtTemp:   data.maxPrtTemp,
    minCaliTemp:  data.minCaliTemp,
    maxCaliTemp:  data.maxCaliTemp,
    minCaliTempP: data.minCaliTempP,
    maxCaliTempP: data.maxCaliTempP,
  };
};

export const updateTempConfig = async (
  minBBQTemp, maxBBQTemp,
  minPrtTemp, maxPrtTemp,
  minCaliTemp, maxCaliTemp,
  minCaliTempP, maxCaliTempP
) => {
  const isNum = (v) => typeof v === "number" && !isNaN(v);
  const fields = { minBBQTemp, maxBBQTemp, minPrtTemp, maxPrtTemp, minCaliTemp, maxCaliTemp, minCaliTempP, maxCaliTempP };
  for (const [k, v] of Object.entries(fields)) {
    if (!isNum(v)) throw new Error(`Valor inválido para '${k}'`);
  }

  const body = Object.entries(fields)
    .map(([k, v]) => `${k}=${encodeURIComponent(v)}`)
    .join("&");

  const response = await fetch(`${baseUrl}/api/v1/temp/config`, {
    method: "PATCH",
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
    body,
  });
  if (!response.ok) throw new Error("Falha ao atualizar configuração de temperatura");
  return "Configuração atualizada com sucesso.";
};

// ---------------------------------------------------------------------------
// MQTT
// ---------------------------------------------------------------------------

export const getMQTTConfig = async () => {
  const response = await fetch(`${baseUrl}/api/v1/mqtt/config`);
  if (!response.ok) throw new Error("Falha ao buscar configuração MQTT");

  const { data } = await response.json();
  return {
    mqttServer:   data.mqttServer   ?? "",
    mqttPort:     parseInt(data.mqttPort, 10) || 1883,
    mqttUser:     data.mqttUser     ?? "",
    // Servidor retorna "***" para senha mascarada — não popular o campo
    mqttPassword: "",
    isHAAvailable: data.isHAAvailable ?? false,
  };
};

export const updateMQTTConfig = async (
  mqttServer, mqttPort, mqttUser, mqttPassword, isHAAvailable
) => {
  if (!mqttServer) throw new Error("mqttServer obrigatório");
  if (!Number.isInteger(mqttPort) || mqttPort <= 0 || mqttPort > 65535)
    throw new Error("mqttPort inválido (1–65535)");
  if (typeof isHAAvailable !== "boolean")
    throw new Error("isHAAvailable deve ser boolean");

  let body =
    `mqttServer=${encodeURIComponent(mqttServer)}&` +
    `mqttPort=${encodeURIComponent(mqttPort)}&` +
    `mqttUser=${encodeURIComponent(mqttUser)}&` +
    `isHAAvailable=${encodeURIComponent(isHAAvailable)}`;

  // Só envia senha se o usuário digitou algo (campo não vazio)
  if (mqttPassword) {
    body += `&mqttPassword=${encodeURIComponent(mqttPassword)}`;
  }

  const response = await fetch(`${baseUrl}/api/v1/mqtt/config`, {
    method: "PATCH",
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
    body,
  });
  if (!response.ok) throw new Error("Falha ao atualizar configuração MQTT");
  return "Configuração MQTT atualizada com sucesso.";
};

// ---------------------------------------------------------------------------
// AI
// ---------------------------------------------------------------------------

export const getAiConfig = async () => {
  const response = await fetch(`${baseUrl}/api/v1/ai/config`);
  if (!response.ok) throw new Error("Falha ao buscar configuração de AI");

  const { data } = await response.json();
  return {
    // Em dev: REACT_APP_GOOGLE_AI_KEY em .env.local tem prioridade sobre a API
    // Em produção (ESP32): variável não existe, usa o que veio do dispositivo
    aiKey: process.env.REACT_APP_GOOGLE_AI_KEY || data.aiKey || "",
    tip:   data.tip ?? "",
  };
};

export const updateAIConfig = async (aiKey, tip) => {
  // aiKey pode ser vazio (desabilita AI); tip deve ser string
  if (typeof aiKey !== "string") throw new Error("aiKey deve ser string");
  if (typeof tip !== "string")   throw new Error("tip deve ser string");

  const body = `aiKey=${encodeURIComponent(aiKey)}&tip=${encodeURIComponent(tip)}`;
  const response = await fetch(`${baseUrl}/api/v1/ai/config`, {
    method: "PATCH",
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
    body,
  });
  if (!response.ok) throw new Error("Falha ao atualizar configuração de AI");
  return "Configuração de AI atualizada com sucesso.";
};

// ---------------------------------------------------------------------------
// Sistema
// ---------------------------------------------------------------------------

export const resetSystem = async () => {
  const response = await fetch(`${baseUrl}/api/v1/system/reset`, { method: "POST" });
  if (!response.ok) throw new Error("Falha ao resetar o sistema");
  return "Sistema resetado com sucesso.";
};

export const getSystemUpdateStatus = async () => {
  const response = await fetch(`${baseUrl}/api/v1/system/update/status`);
  if (!response.ok) throw new Error("Falha ao buscar status do firmware");
  const { data } = await response.json();
  return data;
};

export const performRollback = async () => {
  const response = await fetch(`${baseUrl}/api/v1/system/rollback`, { method: "POST" });
  if (!response.ok) throw new Error("Falha ao iniciar rollback");
  return "Rollback iniciado.";
};

// ---------------------------------------------------------------------------
// Auth (Chave de API)
// ---------------------------------------------------------------------------

export const getAuthConfig = async () => {
  const response = await fetch(`${baseUrl}/api/v1/auth/config`);
  if (!response.ok) throw new Error("Falha ao buscar configuração de auth");
  const { data } = await response.json();
  return data;
};

export const updateAuthConfig = async (currentKey, newKey) => {
  let body = `newKey=${encodeURIComponent(newKey)}`;
  if (currentKey) body += `&currentKey=${encodeURIComponent(currentKey)}`;
  const response = await fetch(`${baseUrl}/api/v1/auth/config`, {
    method: "PATCH",
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
    body,
  });
  if (!response.ok) {
    const err = await response.json().catch(() => ({}));
    throw new Error(err.message || `Erro ${response.status}`);
  }
  return "Configuração atualizada.";
};

// ---------------------------------------------------------------------------
// Diagnósticos
// ---------------------------------------------------------------------------

export const getDiagnostics = async () => {
  const response = await fetch(`${baseUrl}/api/v1/diagnostics`);
  if (!response.ok) throw new Error("Falha ao buscar diagnósticos");
  const { data } = await response.json();
  return data;
};

export const uploadFirmware = async (file) => {
  const formData = new FormData();
  formData.append("update", file);

  const response = await fetch(`${baseUrl}/api/v1/system/update`, {
    method: "POST",
    body: formData,
  });
  if (!response.ok) throw new Error("Falha no upload do firmware");
  return await response.text();
};

// ---------------------------------------------------------------------------
// Log
// ---------------------------------------------------------------------------

export const getLogContent = async () => {
  const response = await fetch(`${baseUrl}/api/v1/log/content`);
  if (!response.ok) throw new Error("Falha ao buscar log");

  const json = await response.json();
  const content = json?.data?.logContent;
  if (!content) throw new Error("Conteúdo do log não encontrado na resposta");
  return content;
};
