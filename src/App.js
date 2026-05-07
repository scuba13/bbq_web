import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import { MonitorProvider } from './context/MonitorContext';
import AppHeader from './components/layout/AppHeader';
import HomePage from './components/pages/HomePage';
import MonitorPage from './components/pages/MonitorPage';
import SystemPage from './components/pages/SystemPage';
import MQTTPage from './components/pages/MQTTPage';
import LogPage from './components/pages/LogPage';
import DiagnosticsPage from './components/pages/DiagnosticsPage';

const theme = createTheme({
  palette: {
    mode: 'dark',
    background: { default: '#000', paper: '#1e1e1e' },
    text: { primary: '#ffffff', secondary: '#b0b0b0' },
  },
  typography: {
    fontFamily: 'Montserrat, sans-serif',
  },
  components: {
    MuiCssBaseline: {
      styleOverrides: `
        body { -webkit-font-smoothing: antialiased; -moz-osx-font-smoothing: grayscale; }
      `,
    },
    MuiButton: {
      styleOverrides: {
        root: {
          backgroundColor: '#000',
          color: '#fff',
          '&:hover': { backgroundColor: '#fff', color: '#000' },
        },
      },
    },
  },
});

function App() {
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <MonitorProvider>
        <Router>
          <AppHeader />
          <Routes>
            <Route path="/"            element={<HomePage />} />
            <Route path="/monitor"     element={<MonitorPage />} />
            <Route path="/system"      element={<SystemPage />} />
            <Route path="/mqtt"        element={<MQTTPage />} />
            <Route path="/log"         element={<LogPage />} />
            <Route path="/diagnostics" element={<DiagnosticsPage />} />
          </Routes>
        </Router>
      </MonitorProvider>
    </ThemeProvider>
  );
}

export default App;
