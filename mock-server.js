/**
 * Mock server para desenvolvimento do BBQ-Nextion Web UI.
 * Simula todos os endpoints do firmware ESP32.
 *
 * Rodar: node mock-server.js
 * URL:   http://localhost:8080
 *
 * Em Api.js, mude baseUrl para "http://localhost:8080" ao usar o mock.
 */

const http = require("http");

const PORT = 8080;

// ─── Estado interno (simula SystemStatus do firmware) ────────────────────────

let state = {
  bbqCurrentTemp: 80,
  bbqSetpoint: 150,
  proteinCurrentTemp: 25,
  proteinSetpoint: 65,
  proteinReached: false,
  relayState: "ON",
  avgTemp: 78,
  caliTemp: 0,
  caliTempP: 0,
  internalTemp: 42,
  minBBQTemp: 30,
  maxBBQTemp: 280,
  minPrtTemp: 40,
  maxPrtTemp: 99,
  minCaliTemp: -20,
  maxCaliTemp: 20,
  minCaliTempP: -20,
  maxCaliTempP: 20,
};

let mqttConfig = {
  mqttServer: "homeassistant.local",
  mqttPort: 1883,
  mqttUser: "bbq",
  mqttPassword: "***",
  isHAAvailable: false,
};

let aiConfig = {
  aiKey: "AIzaSyA1mnDc-qRdlWebX_1nkzHteNVbYGd2k94",
  tip: "Dê uma dica rápida sobre controle de temperatura em defumação.",
};

let debugInject = { active: false, bbqTemp: 0, proteinTemp: 0, endMs: 0 };

// ─── Simula variação de temperatura ──────────────────────────────────────────

setInterval(() => {
  if (debugInject.active && Date.now() < debugInject.endMs) {
    state.bbqCurrentTemp = debugInject.bbqTemp;
    state.proteinCurrentTemp = debugInject.proteinTemp;
  } else {
    debugInject.active = false;
    // Sobe em direção ao setpoint se relé ligado, cai se desligado
    const bbqDelta = state.relayState === "ON" ? 0.5 : -0.3;
    state.bbqCurrentTemp = +(state.bbqCurrentTemp + bbqDelta + (Math.random() - 0.5) * 0.4).toFixed(1);

    // Controle de histerese simples
    if (state.bbqSetpoint > 0) {
      if (state.bbqCurrentTemp >= state.bbqSetpoint + 2) state.relayState = "OFF";
      if (state.bbqCurrentTemp <= state.bbqSetpoint - 2) state.relayState = "ON";
    }

    // Proteína sobe lentamente
    if (state.proteinCurrentTemp < state.proteinSetpoint + 10) {
      state.proteinCurrentTemp = +(state.proteinCurrentTemp + 0.1 + (Math.random() - 0.5) * 0.2).toFixed(1);
    }
  }

  // Detecta proteína atingida
  if (state.proteinSetpoint > 0 && !state.proteinReached &&
      state.proteinCurrentTemp >= state.proteinSetpoint) {
    state.proteinReached = true;
  }

  // Média móvel simples
  state.avgTemp = +(state.avgTemp * 0.99 + state.bbqCurrentTemp * 0.01).toFixed(1);
}, 500);

// ─── Helpers ─────────────────────────────────────────────────────────────────

function ok(res, message, data) {
  const body = { status: 200, message };
  if (data != null) body.data = data;
  send(res, 200, body);
}

function err(res, status, message) {
  send(res, status, { status, message });
}

function send(res, status, obj) {
  const body = JSON.stringify(obj);
  res.writeHead(status, {
    "Content-Type": "application/json",
    "Access-Control-Allow-Origin": "*",
    "Access-Control-Allow-Methods": "GET, POST, PATCH, DELETE, OPTIONS",
    "Access-Control-Allow-Headers": "Content-Type, X-API-Key",
  });
  res.end(body);
}

function parseBody(req) {
  return new Promise((resolve) => {
    let body = "";
    req.on("data", (chunk) => (body += chunk));
    req.on("end", () => {
      const params = {};
      body.split("&").forEach((pair) => {
        const [k, v] = pair.split("=").map(decodeURIComponent);
        if (k) params[k] = v;
      });
      resolve(params);
    });
  });
}

// ─── Roteador ─────────────────────────────────────────────────────────────────

const server = http.createServer(async (req, res) => {
  const { method, url } = req;

  // Preflight CORS
  if (method === "OPTIONS") { send(res, 204, {}); return; }

  console.log(`${method} ${url}`);

  // ── Monitor ──────────────────────────────────────────────────────────────
  if (url === "/api/v1/monitor" && method === "GET") {
    ok(res, "Dados de monitoramento obtidos com sucesso", { ...state });
    return;
  }

  // ── Setpoints de temperatura ─────────────────────────────────────────────
  if (url === "/api/v1/temperature/config" && method === "GET") {
    ok(res, "Configuração obtida", {
      bbqTemperature: state.bbqSetpoint,
      proteinTemperature: state.proteinSetpoint,
      tempCalibration: state.caliTemp,
      tempCalibrationP: state.caliTempP,
    });
    return;
  }

  if (url === "/api/v1/temperature/config" && method === "PATCH") {
    const p = await parseBody(req);
    if (p.bbqTemperature !== undefined) {
      const v = parseInt(p.bbqTemperature);
      if (isNaN(v) || v < state.minBBQTemp || v > state.maxBBQTemp) {
        err(res, 400, "Temperatura BBQ fora do intervalo permitido"); return;
      }
      state.bbqSetpoint = v;
    }
    if (p.proteinTemperature !== undefined) {
      const v = parseInt(p.proteinTemperature);
      if (isNaN(v) || v < state.minPrtTemp || v > state.maxPrtTemp) {
        err(res, 400, "Temperatura proteína fora do intervalo permitido"); return;
      }
      state.proteinSetpoint = v;
      state.proteinReached = false;
    }
    if (p.tempCalibration !== undefined) state.caliTemp = parseFloat(p.tempCalibration);
    if (p.tempCalibrationP !== undefined) state.caliTempP = parseFloat(p.tempCalibrationP);
    ok(res, "Configuração atualizada com sucesso");
    return;
  }

  // ── Limites de temperatura ───────────────────────────────────────────────
  if (url === "/api/v1/temp/config" && method === "GET") {
    ok(res, "Configuração de limites obtida", {
      minBBQTemp: state.minBBQTemp, maxBBQTemp: state.maxBBQTemp,
      minPrtTemp: state.minPrtTemp, maxPrtTemp: state.maxPrtTemp,
      minCaliTemp: state.minCaliTemp, maxCaliTemp: state.maxCaliTemp,
      minCaliTempP: state.minCaliTempP, maxCaliTempP: state.maxCaliTempP,
    });
    return;
  }

  if (url === "/api/v1/temp/config" && method === "PATCH") {
    const p = await parseBody(req);
    const fields = ["minBBQTemp","maxBBQTemp","minPrtTemp","maxPrtTemp",
                    "minCaliTemp","maxCaliTemp","minCaliTempP","maxCaliTempP"];
    for (const f of fields) {
      if (p[f] !== undefined) state[f] = parseInt(p[f]);
    }
    ok(res, "Limites atualizados com sucesso");
    return;
  }

  // ── MQTT ─────────────────────────────────────────────────────────────────
  if (url === "/api/v1/mqtt/config" && method === "GET") {
    ok(res, "Configuração MQTT obtida", { ...mqttConfig });
    return;
  }

  if (url === "/api/v1/mqtt/config" && method === "PATCH") {
    const p = await parseBody(req);
    if (p.mqttServer) mqttConfig.mqttServer = p.mqttServer;
    if (p.mqttPort)   mqttConfig.mqttPort   = parseInt(p.mqttPort);
    if (p.mqttUser)   mqttConfig.mqttUser   = p.mqttUser;
    if (p.mqttPassword) mqttConfig.mqttPassword = "***"; // nunca retorna a real
    mqttConfig.isHAAvailable = p.isHAAvailable === "true";
    ok(res, "Configuração MQTT atualizada");
    return;
  }

  // ── AI ───────────────────────────────────────────────────────────────────
  if (url === "/api/v1/ai/config" && method === "GET") {
    ok(res, "Configuração AI obtida", { ...aiConfig });
    return;
  }

  if (url === "/api/v1/ai/config" && method === "PATCH") {
    const p = await parseBody(req);
    if (p.aiKey !== undefined) aiConfig.aiKey = p.aiKey;
    if (p.tip   !== undefined) aiConfig.tip   = p.tip;
    ok(res, "Configuração AI atualizada");
    return;
  }

  // ── Sistema ──────────────────────────────────────────────────────────────
  if (url === "/api/v1/system/reset" && method === "POST") {
    state.bbqSetpoint = 0;
    state.proteinSetpoint = 0;
    state.proteinReached = false;
    state.relayState = "OFF";
    state.caliTemp = 0;
    state.caliTempP = 0;
    ok(res, "Sistema resetado com sucesso");
    return;
  }

  if (url === "/api/v1/system/update" && method === "POST") {
    // Simula upload demorado
    setTimeout(() => ok(res, "Firmware recebido. Reiniciando..."), 2000);
    return;
  }

  // ── Log ──────────────────────────────────────────────────────────────────
  if (url === "/api/v1/log/content" && method === "GET") {
    const lines = Array.from({ length: 20 }, (_, i) => {
      const mins = 20 - i;
      return `12/05 10:${String(mins).padStart(2,"0")}:00 [INFO] Temperatura BBQ: ${(state.bbqCurrentTemp - i * 0.3).toFixed(1)}C`;
    }).join("\n");
    ok(res, "Log obtido", { logContent: lines + "\n12/05 10:00:00 [INFO] === BOOT ===" });
    return;
  }

  // ── Diagnósticos ─────────────────────────────────────────────────────────
  if (url === "/api/v1/diagnostics" && method === "GET") {
    ok(res, "Diagnósticos obtidos", {
      heap:    { free: 124000, min: 98000, maxAlloc: 65536, fragmentation: 12.4 },
      cpu:     { freq: 240 },
      system:  { uptime: 3600, healthy: true, resetReason: "power-on" },
      wifi:    { connected: true, rssi: -62, reconnections: 0 },
      mqtt:    { enabled: mqttConfig.isHAAvailable, connected: false, reconnections: 0 },
      sensors: { bbqReadErrors: 0, proteinReadErrors: 0, internalReadErrors: 0 },
      tasks:   { tempStack: 1824, controlStack: 980, mqttStack: 0 },
      relay:   { emergencies: 0 },
    });
    return;
  }

  // ── Debug inject ─────────────────────────────────────────────────────────
  if (url === "/api/v1/debug/inject-temp" && method === "POST") {
    const p = await parseBody(req);
    const bbq = parseFloat(p.bbqTemp);
    const prt = parseFloat(p.proteinTemp);
    const sec = parseInt(p.seconds) || 30;
    if (isNaN(bbq) || bbq < 0 || bbq > 500 || isNaN(prt) || prt < 0 || prt > 500) {
      err(res, 400, "bbqTemp e proteinTemp obrigatórios (0–500)"); return;
    }
    debugInject = { active: true, bbqTemp: bbq, proteinTemp: prt, endMs: Date.now() + sec * 1000 };
    ok(res, "Injeção ativa", { bbqTemp: bbq, proteinTemp: prt, seconds: sec });
    return;
  }

  if (url === "/api/v1/debug/inject-temp" && method === "DELETE") {
    debugInject.active = false;
    ok(res, "Injeção cancelada");
    return;
  }

  // ── Auth (mock: sempre sem chave) ────────────────────────────────────────
  if (url === "/api/v1/auth/config" && method === "GET") {
    ok(res, "Auth config", { keyConfigured: false, keyPreview: "" });
    return;
  }

  err(res, 404, `Endpoint não encontrado: ${method} ${url}`);
});

server.listen(PORT, () => {
  console.log(`\n🔥 BBQ Mock Server rodando em http://localhost:${PORT}`);
  console.log("   Em Api.js, defina: const baseUrl = \"http://localhost:8080\"\n");
});
