# Análise de Qualidade — BBQ-Nextion Web UI

Gerado em: 2026-05-07  
Estado de referência: pasta `bbq_web/` — React 18 + MUI 5

---

## Como usar este documento

Cada item tem um **ID único** (`W-XX`), prioridade e localização.  
Ao iniciar, marque `[ em andamento ]`. Ao concluir, marque `[x]`.

---

## Prioridade 1 — Segurança

---

### W-01 — Chaves de API expostas em `src/key.tx`
- **Status:** `[ ]`
- **Arquivo:** `src/key.tx`, `src/components/utils/Weather.js:9`
- **Problema:** O arquivo `key.tx` contém três chaves em texto puro (Google AI, OpenWeather, e uma terceira não identificada). A chave do OpenWeather também está hardcoded em `Weather.js`. Qualquer pessoa que acesse o repositório ou o bundle JS final obtém essas credenciais.
- **Correção:**
  - Deletar `src/key.tx` imediatamente e revogar as chaves expostas nos respectivos painéis
  - Mover as chaves para variáveis de ambiente (`.env` local, nunca commitado)
  - A chave de AI já é gerenciada pelo firmware via `/api/v1/ai/config` — o frontend não precisa armazená-la em arquivo

---

### W-02 — Chave do OpenWeather hardcoded no código-fonte
- **Status:** `[ ]`
- **Arquivo:** `src/components/utils/Weather.js:9`
- **Problema:** `const apiKey = '3bb00f8d6c2bb1b3e5757d2ea60de0b4'` está diretamente no fonte, vai para o bundle JS e fica visível no DevTools de qualquer navegador.
- **Correção:** Usar `process.env.REACT_APP_WEATHER_KEY` e definir em `.env.local` (não commitado). Ou remover Weather.js — o componente está comentado em `HomePage.js` e não é usado.

---

## Prioridade 2 — Bugs / Funcionalidade Quebrada

---

### W-03 — Calibração de temperatura quebrada em `TempConfig.js`
- **Status:** `[ ]`
- **Arquivo:** `src/components/system/TempConfig.js:87–111`
- **Problema:** O botão "Set Calibration" chama `setTemperatureConfig(calibrationBBQ, calibrationProtein)` que não existe mais no `Api.js` refatorado. Antes existia como função que mapeava para `bbqTemperature` e `proteinTemperature` — parâmetros **errados** para calibração. Calibração deve usar `tempCalibration` e `tempCalibrationP` via `PATCH /api/v1/temperature/config`.
- **Correção:** Criar `setCalibration(calibbq, caliPrt)` em `Api.js` que envia `tempCalibration` e `tempCalibrationP`, e atualizar `TempConfig.js` para chamar essa função.

---

### W-04 — `TempConfig.js` importa função removida
- **Status:** `[ ]`
- **Arquivo:** `src/components/system/TempConfig.js:13`
- **Problema:** `import { getTempConfig, updateTempConfig, setTemperatureConfig } from "../../Api"` — `setTemperatureConfig` foi removida do `Api.js`. O build vai falhar com erro de import.
- **Correção:** Remover `setTemperatureConfig` do import após implementar W-03.

---

### W-05 — `AI.js` usa modelo Gemini descontinuado
- **Status:** `[ ]`
- **Arquivo:** `src/components/monitor/AI.js:36`
- **Problema:** `genAI.getGenerativeModel({ model: "gemini-pro" })` — `gemini-pro` foi descontinuado pela Google. Chamadas vão falhar com erro de API.
- **Correção:** Atualizar para `"gemini-1.5-flash"` (gratuito, rápido) ou `"gemini-1.5-pro"`.

---

### W-06 — Log carrega apenas uma vez, sem botão de refresh
- **Status:** `[ ]`
- **Arquivo:** `src/components/Log/Log.js`
- **Problema:** O log é carregado no `useEffect` de mount e nunca mais atualizado. Para ver novas entradas, o usuário precisa recarregar a página inteira.
- **Correção:** Adicionar botão "Atualizar" que re-dispara o fetch, ou polling opcional a cada 10s.

---

## Prioridade 3 — Estrutura e Arquitetura

---

### W-07 — Camada de páginas sem Layout compartilhado
- **Status:** `[ ]`
- **Arquivos:** `src/components/pages/*.js` (5 arquivos)
- **Problema:** Cada `*Page.js` copia o mesmo padrão: `Container` + `Watermark` + `PageTitle` + botão Home. São ~20 linhas idênticas em cada arquivo. Qualquer mudança de layout precisa ser replicada em todos.
- **Correção:** Criar `src/components/layout/PageLayout.js` que recebe `title`, `subtitle` e `children`, e usar em todas as páginas.
  ```jsx
  // PageLayout.js
  function PageLayout({ title, subtitle, children }) {
    return (
      <Container style={{ padding: "20px", position: "relative" }}>
        <Watermark />
        <PageTitle title={title} subtitle={subtitle} />
        <div style={{ textAlign: "center", marginBottom: "20px" }}>
          <Button component={Link} to="/" variant="contained">Home</Button>
        </div>
        {children}
      </Container>
    );
  }
  ```

---

### W-08 — Nomenclatura inconsistente de pastas
- **Status:** `[ ]`
- **Problema:** Pastas de componentes misturam capitalização: `Log/`, `MQTT/` (maiúscula) vs `monitor/`, `system/`, `pages/`, `utils/` (minúscula). Em sistemas de arquivos case-sensitive (Linux/servidor) isso causa erros de import.
- **Correção:** Padronizar tudo em minúsculas: renomear `Log/` → `log/`, `MQTT/` → `mqtt/`.

---

### W-09 — Estado duplicado: limites de temperatura em dois componentes
- **Status:** `[ ]`
- **Arquivos:** `Monitor.js`, `TempConfig.js`
- **Problema:** `Monitor.js` e `TempConfig.js` ambos fazem fetch de `/api/v1/temp/config` ou incluem os limites no estado local, sem compartilhar. Se um muda os limites, o outro não sabe.
- **Correção:** Criar um custom hook `useTempConfig()` que centraliza o fetch e expõe os limites. Ambos os componentes consumiriam o mesmo hook.

---

### W-10 — `TempConfig` mistura dois conceitos em um componente
- **Status:** `[ ]`
- **Arquivo:** `src/components/system/TempConfig.js`
- **Problema:** Um único componente gerencia tanto os **limites** (min/max de cada sensor) quanto a **calibração** (offset de ajuste). São configurações independentes com UX diferente — os limites são raramente alterados, a calibração é ajuste fino. O componente tem 250 linhas e fica confuso para o usuário.
- **Correção:** Separar em `TempLimits.js` (limites min/max) e `TempCalibration.js` (offsets de calibração). Isso também resolve W-03 naturalmente.

---

### W-11 — Sem gerenciamento de estado global
- **Status:** `[ ]`
- **Problema:** Não há Context API nem estado compartilhado. Cada componente faz seu próprio fetch. A página `Monitor` faz 1 request/segundo ao dispositivo. Se `SystemPage` precisar dos dados do monitor, faria outro polling independente.
- **Nível de urgência:** Baixo por enquanto (aplicação pequena), mas vai piorar com novas features.
- **Correção mínima:** Um `AppContext` com os dados do monitor + configurações de temperatura, atualizado pelo polling do Monitor. Componentes que precisam de dados os leem do context.

---

## Prioridade 4 — Qualidade de Código

---

### W-12 — `console.log` em código de produção
- **Status:** `[ ]`
- **Arquivos:**
  - `FirmwareUpload.js:13,27` — `console.log('File selected:')`, `console.log('Upload button clicked')`
  - `TempConfig.js:34` — `console.log("Fetched Config from API:", config)`
- **Correção:** Remover todos os `console.log`. Manter apenas `console.error` para erros reais.

---

### W-13 — Tratamento de erros via `alert()` em toda a aplicação
- **Status:** `[ ]`
- **Problema:** Todos os erros e sucessos são exibidos via `alert()` nativo do browser — bloqueia a UI, é feio e inconsistente. Exemplos: `TempConfig.js:82`, `FirmwareUpload.js:32`, `MQTT.js:46`, `System.js`, `AIConfig.js:42`.
- **Correção:** Usar MUI `Snackbar` + `Alert` para feedback não-bloqueante. Criar um hook `useSnackbar()` ou componente `Feedback.js` reutilizável.

---

### W-14 — Estilos inline misturados com `sx` prop do MUI
- **Status:** `[ ]`
- **Problema:** O código usa `style={{ ... }}` (inline) e `sx={{ ... }}` (MUI) de forma aleatória no mesmo arquivo. `sx` é a forma recomendada no MUI v5, tem acesso ao tema e suporte a responsividade.
- **Correção:** Migrar `style={{ ... }}` para `sx={{ ... }}` nos componentes, especialmente `Monitor.js`, `MQTT.js`, `TempConfig.js`.

---

### W-15 — `Weather.js` é código morto
- **Status:** `[ ]`
- **Arquivo:** `src/components/utils/Weather.js`, `src/components/pages/HomePage.js:5`
- **Problema:** `WeatherComponent` está importado mas comentado em `HomePage.js`. O arquivo `Weather.js` tem chave de API hardcoded (W-02) e nunca é renderizado.
- **Correção:** Remover `Weather.js` e o import comentado em `HomePage.js`.

---

### W-16 — `HomePage` sem espaçamento entre botões
- **Status:** `[ ]`
- **Arquivo:** `src/components/pages/HomePage.js:16–38`
- **Problema:** Os quatro botões de navegação ficam colados uns nos outros sem margin ou gap. No mobile fica inutilizável.
- **Correção:** Envolver em MUI `Stack` com `spacing={2}` ou `gap`.
  ```jsx
  <Stack spacing={2} sx={{ mt: 3 }}>
    <Button component={Link} to="/monitor" variant="contained" fullWidth>Monitor</Button>
    ...
  </Stack>
  ```

---

### W-17 — Sem feedback visual de loading em `TempConfig`, `MQTT`, `AIConfig`
- **Status:** `[ ]`
- **Problema:** `Log.js` tem `CircularProgress` enquanto carrega, mas os outros três componentes que fazem fetch no mount (`TempConfig`, `MQTT`, `AIConfig`) não têm loading state — a tela fica em branco com campos vazios até a resposta chegar.
- **Correção:** Adicionar estado `loading` e exibir `CircularProgress` ou skeleton enquanto carrega.

---

### W-18 — `FirmwareUpload` sem barra de progresso
- **Status:** `[ ]`
- **Arquivo:** `src/components/system/FirmwareUpload.js`
- **Problema:** Upload de firmware pode levar 30+ segundos. Após clicar "Upload Firmware", a UI fica travada sem nenhum feedback de progresso. O usuário não sabe se está funcionando.
- **Correção:** Usar `XMLHttpRequest` com evento `progress` em vez de `fetch` para mostrar barra de progresso durante o upload.

---

### W-19 — Campo de senha MQTT sem hint de "deixe vazio para manter"
- **Status:** `[ ]`
- **Arquivo:** `src/components/MQTT/MQTT.js:91–99`
- **Problema:** Após a correção do W-01 (senha mascarada), o campo de senha carrega vazio. O usuário pode achar que não tem senha configurada. Precisa de texto de ajuda.
- **Correção:** Adicionar `helperText="Deixe vazio para manter a senha atual"` no TextField de senha.

---

## Rastreabilidade

| ID | Área | Prioridade | Status |
|---|---|---|---|
| W-01 | Segurança | 🔴 Crítico | `[ ]` |
| W-02 | Segurança | 🔴 Crítico | `[ ]` |
| W-03 | Bug | 🔴 Crítico | `[ ]` |
| W-04 | Bug | 🔴 Crítico | `[ ]` |
| W-05 | Bug | 🟠 Alto | `[ ]` |
| W-06 | Bug | 🟡 Médio | `[ ]` |
| W-07 | Estrutura | 🟠 Alto | `[ ]` |
| W-08 | Estrutura | 🟡 Médio | `[ ]` |
| W-09 | Estrutura | 🟡 Médio | `[ ]` |
| W-10 | Estrutura | 🟠 Alto | `[ ]` |
| W-11 | Estrutura | 🟡 Médio | `[ ]` |
| W-12 | Código | 🟡 Médio | `[ ]` |
| W-13 | Código | 🟠 Alto | `[ ]` |
| W-14 | Código | 🟡 Médio | `[ ]` |
| W-15 | Código | 🟡 Médio | `[ ]` |
| W-16 | UX | 🟠 Alto | `[ ]` |
| W-17 | UX | 🟡 Médio | `[ ]` |
| W-18 | UX | 🟡 Médio | `[ ]` |
| W-19 | UX | 🟡 Médio | `[ ]` |

---

## Ordem de execução sugerida

```
Fase 1 — Segurança (fazer agora, antes de qualquer commit)
  W-01  deletar key.tx e revogar chaves expostas
  W-02  remover chave OpenWeather hardcoded / remover Weather.js

Fase 2 — Bugs críticos (app quebrada sem isso)
  W-03  corrigir calibração (nova função setCalibration em Api.js)
  W-04  corrigir import de setTemperatureConfig removida
  W-05  atualizar modelo Gemini de gemini-pro para gemini-1.5-flash

Fase 3 — Estrutura (facilita tudo que vem depois)
  W-07  criar PageLayout reutilizável
  W-10  separar TempConfig em TempLimits + TempCalibration
  W-08  padronizar nomes de pastas para minúsculas

Fase 4 — UX e qualidade
  W-13  substituir alert() por MUI Snackbar
  W-16  espaçamento HomePage
  W-17  loading states em TempConfig/MQTT/AIConfig
  W-18  barra de progresso no FirmwareUpload
  W-19  helperText no campo de senha MQTT

Fase 5 — Limpeza
  W-12  remover console.log de produção
  W-14  migrar style={{}} para sx={{}}
  W-15  remover Weather.js (código morto)
  W-06  botão de refresh no Log
  W-09  custom hook useTempConfig
  W-11  AppContext (se app crescer)
```
