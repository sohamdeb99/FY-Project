import React, { useState, useRef } from 'react';
import './PacketSniffing.css';
import { styled } from '@mui/material/styles';
import Button from '@mui/material/Button';
import CloudUploadIcon from '@mui/icons-material/CloudUpload';
import CircularProgress from '@mui/material/CircularProgress';
import axios from 'axios';
import Snackbar from '@mui/material/Snackbar';
import MuiAlert from '@mui/material/Alert';

const VisuallyHiddenInput = styled('input')({
  clip: 'rect(0 0 0 0)',
  clipPath: 'inset(50%)',
  height: 1,
  overflow: 'hidden',
  position: 'absolute',
  whiteSpace: 'nowrap',
  width: 1,
});

const Alert = React.forwardRef(function Alert(props, ref) {
  return <MuiAlert elevation={6} ref={ref} variant="filled" {...props} />;
});

function InputFileUpload() {
  const [file, setFile] = useState(null);
  const [showConfirmation, setShowConfirmation] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: '' });
  const fileInputRef = useRef();

  const handleFileChange = (event) => {
    const selectedFile = event.target.files[0];
    if (selectedFile && selectedFile.type === "text/csv") {
      setFile(selectedFile);
      setShowConfirmation(true);
    } else {
      setSnackbar({ open: true, message: 'Please upload a CSV file.', severity: 'warning' });
    }
    event.target.value = null;
  };

  const handleSave = async () => {
    setIsLoading(true);
    const formData = new FormData();
    formData.append('file', file);

    try {
      const response = await axios.post('http://localhost:3001/api/upload', formData, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      });
      setSnackbar({ open: true, message: 'File uploaded successfully', severity: 'success' });
    } catch (error) {
      setSnackbar({ open: true, message: 'Error uploading file', severity: 'error' });
    }

    setIsLoading(false);
    setShowConfirmation(false);
    setFile(null);
  };

  const handleCancel = () => {
    setFile(null);
    setShowConfirmation(false);
    setSnackbar({ open: true, message: 'Upload cancelled', severity: 'info' });
  };

  const handleCloseSnackbar = (event, reason) => {
    if (reason === 'clickaway') {
      return;
    }
    setSnackbar({ ...snackbar, open: false });
  };

  return (
    <>
      <Button component="label" variant="contained" startIcon={<CloudUploadIcon />}>
        Upload file
        <VisuallyHiddenInput 
          type="file" 
          onChange={handleFileChange} 
          ref={fileInputRef} 
          accept=".csv" 
        />
      </Button>
      {showConfirmation && !isLoading && (
        <div style={{ marginTop: '10px' }}>
          <p>{`Selected file: ${file?.name}`}</p>
          <Button variant="contained" color="primary" onClick={handleSave} style={{ marginRight: '10px' }}>
            Save & Proceed
          </Button>
          <Button variant="contained" color="secondary" onClick={handleCancel}>
            Cancel
          </Button>
        </div>
      )}
      {isLoading && (
        <div style={{ marginTop: '10px' }}>
          <CircularProgress />
          <p>Saving file...</p>
        </div>
      )}
      <Snackbar open={snackbar.open} autoHideDuration={6000} onClose={handleCloseSnackbar}>
        <Alert onClose={handleCloseSnackbar} severity={snackbar.severity} sx={{ width: '100%' }}>
          {snackbar.message}
        </Alert>
      </Snackbar>
    </>
  );
}

function MainPage() {
  return (
    <>
      <article>
        <div className="upload-section">
          <h2>Upload CSV File from Packet Sniffer</h2>
          <InputFileUpload />
        </div>
      </article>
    </>
  );
}

export default MainPage;
