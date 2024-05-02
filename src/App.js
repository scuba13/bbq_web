import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import HomePage from './components/pages/HomePage';
import MonitorPage from './components/pages/MonitorPage';
import SystemPage from './components/pages/SystemPage';
import MQTTPage from './components/pages/MQTTPage';
import LogPage from './components/pages/LogPage';
import WeatherPage from './components/pages/WeatherPage';

const theme = createTheme({
  palette: {
    mode: 'dark', // Ativa o modo escuro
    background: {
      default: '#000', // Preto
      paper: '#1e1e1e',
    },
    text: {
      primary: '#ffffff',
      secondary: '#b0b0b0'
    }
  },
  typography: {
    fontFamily: 'Montserrat, sans-serif',
    // Adicionando estilo para elementos <code>
    code: {
      fontFamily: 'source-code-pro, Menlo, Monaco, Consolas, "Courier New", monospace',
    },
  },
  components: {
    MuiCssBaseline: {
      styleOverrides: `
        body {
          -webkit-font-smoothing: antialiased;  // Suavização de fonte para WebKit (Chrome, Safari)
          -moz-osx-font-smoothing: grayscale;  // Suavização de fonte para Firefox no macOS
        }
        code {
          font-family: 'source-code-pro, Menlo, Monaco, Consolas, "Courier New", monospace';
        }
      `,
    },
    MuiButton: {
      styleOverrides: {
        root: {
          backgroundColor: '#000', // Botão preto
          color: '#fff', // Texto branco
          '&:hover': {
            backgroundColor: '#fff', // Botão branco ao passar o mouse
            color: '#000', // Texto preto ao passar o mouse
          },
        }
      }
    }
  }
});

function App() {
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Router>
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/monitor" element={<MonitorPage />} />
          <Route path="/system" element={<SystemPage />} />
          <Route path="/mqtt" element={<MQTTPage />} />
          <Route path="/log" element={<LogPage />} />
          <Route path="/weather" element={<WeatherPage />} />
        </Routes>
      </Router>
    </ThemeProvider>
  );
}

export default App;
