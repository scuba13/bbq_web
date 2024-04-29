import React, { useState, useRef } from 'react';
import { Button, Card, CardContent, Typography, Box } from '@mui/material';
import { uploadFirmware } from '../../Api'; // Importa a função API que você criou

function FirmwareUpload() {
  const [file, setFile] = useState(null);
  const [fileName, setFileName] = useState(""); // Estado para armazenar o nome do arquivo
  const fileInputRef = useRef(null); // Referência para o input de arquivo

  const handleFileChange = (event) => {
    const selectedFile = event.target.files[0];
    console.log('File selected:', selectedFile);
    setFile(selectedFile); // Armazena o primeiro arquivo selecionado
    setFileName(selectedFile.name); // Define o nome do arquivo no estado
  };

  const handleChooseFileClick = () => {
    // Simula o clique no input de arquivo
    fileInputRef.current.click();
  };

  const handleUploadClick = async () => {
    console.log('Upload button clicked');
    if (!file) {
      alert('Please select a file first.');
      return;
    }
    try {
      const result = await uploadFirmware(file);
      alert(result); // Notifica o usuário do sucesso
    } catch (error) {
      alert(`Error: ${error.message}`); // Notifica o usuário do erro
    }
  };

  return (
    <Card variant="outlined">
      <CardContent>
      <Typography variant="subtitle1" gutterBottom>
         Firmware Update
        </Typography>
        <Box mt={2}>
          {/* Input de arquivo oculto */}
          <input
            type="file"
            ref={fileInputRef} // Referência para o input de arquivo
            onChange={handleFileChange}
            accept=".bin" // Aceita apenas arquivos .bin
            style={{ display: 'none' }} // Oculta o input de arquivo
          />
          {/* Botão "Choose File" */}
          <Button
            variant="contained"
            color="primary"
            onClick={handleChooseFileClick}
            fullWidth
          >
            Choose File
          </Button>
        </Box>
        {/* Mostrar o nome do arquivo selecionado */}
        {fileName && (
          <Box mt={2}>
            <Typography variant="body1" gutterBottom>
              Selected File: {fileName}
            </Typography>
          </Box>
        )}
        <Box mt={2}>
          {/* Botão "Upload Firmware" */}
          <Button
            variant="contained"
            color="primary"
            onClick={handleUploadClick}
            fullWidth
          >
            Upload Firmware
          </Button>
        </Box>
      </CardContent>
    </Card>
  );
}

export default FirmwareUpload;
