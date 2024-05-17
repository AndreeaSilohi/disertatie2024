import React, { useState } from 'react';
import Snackbar from '@mui/material/Snackbar';
import MuiAlert from '@mui/material/Alert';

function CustomAlert({ open, onClose, severity, message }) {
  return (
    <Snackbar open={open} autoHideDuration={3000} onClose={onClose}>
      <MuiAlert onClose={onClose} severity={severity} sx={{ width: '100%' }}>
        {message}
      </MuiAlert>
    </Snackbar>
  );
}

export default CustomAlert;
