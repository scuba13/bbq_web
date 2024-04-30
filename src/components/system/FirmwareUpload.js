import React, { useState, useRef } from 'react';
import { Button, Card, CardContent, Typography, Box } from '@mui/material';
import { uploadFirmware } from '../../Api'; // Import the API function
import SystemUpdateAltIcon from '@mui/icons-material/SystemUpdateAlt'; // Import SystemUpdateAltIcon

function FirmwareUpload() {
  const [file, setFile] = useState(null);
  const [fileName, setFileName] = useState(""); // State to store the file name
  const fileInputRef = useRef(null); // Reference to the file input

  const handleFileChange = (event) => {
    const selectedFile = event.target.files[0];
    console.log('File selected:', selectedFile);
    setFile(selectedFile); // Store the selected file
    setFileName(selectedFile.name); // Set the file name in state
  };

  const handleChooseFileClick = () => {
    // Simulate a click on the file input
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
      alert(result); // Notify the user of success
    } catch (error) {
      alert(`Error: ${error.message}`); // Notify the user of the error
    }
  };

  return (
    <Card variant="outlined">
      <CardContent>
        <Typography variant="subtitle1" gutterBottom style={{ display: "flex", alignItems: "center" }}>
          <SystemUpdateAltIcon style={{ fontSize: 30, marginRight: 5 }} />
          Firmware Update
        </Typography>
        <Box mt={2}>
          {/* Hidden file input */}
          <input
            type="file"
            ref={fileInputRef} // Reference to the file input
            onChange={handleFileChange}
            accept=".bin" // Accept only .bin files
            style={{ display: 'none' }} // Hide the file input
          />
          {/* "Choose File" button */}
          <Button
            variant="contained"
            color="primary"
            onClick={handleChooseFileClick}
            fullWidth
          >
            Choose File
          </Button>
        </Box>
        {/* Display the selected file name */}
        {fileName && (
          <Box mt={2}>
            <Typography variant="body1" gutterBottom>
              Selected File: {fileName}
            </Typography>
          </Box>
        )}
        <Box mt={2}>
          {/* "Upload Firmware" button */}
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
