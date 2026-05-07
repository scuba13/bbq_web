import React, { useState, useCallback } from 'react';
import { Snackbar, Alert } from '@mui/material';

export function useNotification() {
  const [state, setState] = useState({ open: false, message: '', severity: 'success' });

  const notify = useCallback((message, severity = 'success') => {
    setState({ open: true, message, severity });
  }, []);

  const handleClose = () => setState(s => ({ ...s, open: false }));

  function NotificationSnackbar() {
    return (
      <Snackbar
        open={state.open}
        autoHideDuration={4000}
        onClose={handleClose}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
      >
        <Alert severity={state.severity} onClose={handleClose} variant="filled">
          {state.message}
        </Alert>
      </Snackbar>
    );
  }

  return { notify, NotificationSnackbar };
}
