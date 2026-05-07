import React, { useState, useRef } from 'react';
import { Box, Button, Card, CardContent, LinearProgress, Typography } from '@mui/material';
import SystemUpdateAltIcon from '@mui/icons-material/SystemUpdateAlt';
import { useNotification } from '../utils/useNotification';

const BASE_URL = "http://bbq.local";

function FirmwareUpload() {
  const [file, setFile] = useState(null);
  const [progress, setProgress] = useState(null); // null = idle, 0–100 = uploading
  const fileInputRef = useRef(null);
  const { notify, NotificationSnackbar } = useNotification();

  const handleFileChange = (e) => {
    setFile(e.target.files[0] || null);
  };

  const handleUpload = () => {
    if (!file) { notify('Selecione um arquivo .bin primeiro', 'warning'); return; }

    const formData = new FormData();
    formData.append('update', file);

    const xhr = new XMLHttpRequest();

    xhr.upload.addEventListener('progress', (e) => {
      if (e.lengthComputable) setProgress(Math.round((e.loaded / e.total) * 100));
    });

    xhr.addEventListener('load', () => {
      setProgress(null);
      if (xhr.status >= 200 && xhr.status < 300) {
        notify('Firmware enviado com sucesso! Dispositivo reiniciando...');
        setFile(null);
      } else {
        notify(`Erro no upload: ${xhr.statusText}`, 'error');
      }
    });

    xhr.addEventListener('error', () => {
      setProgress(null);
      notify('Erro de rede durante o upload', 'error');
    });

    xhr.open('POST', `${BASE_URL}/api/v1/system/update`);
    xhr.send(formData);
    setProgress(0);
  };

  return (
    <Card variant="outlined">
      <CardContent>
        <Typography variant="subtitle1" gutterBottom sx={{ display: 'flex', alignItems: 'center' }}>
          <SystemUpdateAltIcon sx={{ fontSize: 30, mr: 1 }} />
          Firmware Update
        </Typography>

        <input
          type="file" ref={fileInputRef}
          onChange={handleFileChange}
          accept=".bin"
          style={{ display: 'none' }}
        />

        <Box mt={2}>
          <Button variant="contained" onClick={() => fileInputRef.current.click()} fullWidth>
            Escolher arquivo
          </Button>
        </Box>

        {file && (
          <Typography variant="body2" sx={{ mt: 1, color: 'text.secondary' }}>
            {file.name} ({(file.size / 1024).toFixed(0)} KB)
          </Typography>
        )}

        {progress !== null && (
          <Box sx={{ mt: 2 }}>
            <LinearProgress variant="determinate" value={progress} />
            <Typography variant="body2" align="center" sx={{ mt: 0.5 }}>{progress}%</Typography>
          </Box>
        )}

        <Box mt={2}>
          <Button
            variant="contained" color="warning"
            onClick={handleUpload} fullWidth
            disabled={!file || progress !== null}
          >
            {progress !== null ? `Enviando... ${progress}%` : 'Enviar Firmware'}
          </Button>
        </Box>
      </CardContent>
      <NotificationSnackbar />
    </Card>
  );
}

export default FirmwareUpload;
