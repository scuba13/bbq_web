import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import HomePage from './components/pages/HomePage';
import MonitorPage from './components/pages/MonitorPage';
import SystemPage from './components/pages/SystemPage';

// Cria um tema personalizado com botões e fonte Montserrat
const theme = createTheme({
  palette: {
    mode: 'dark', // Ativa o modo escuro
    background: {
      default: '#0D0D0D', // Um preto muito escuro como fundo padrão
      paper: '#1e1e1e',
    },
    text: {
      primary: '#ffffff',
      secondary: '#b0b0b0'
    }
  },
  typography: {
    fontFamily: 'Montserrat, sans-serif',
  },
  components: {
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
        </Routes>
      </Router>
    </ThemeProvider>
  );
}

export default App;
