import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@mui/material';

function Test() {
    const navigate = useNavigate();

  return (
    <div>
      <h1>Test Page</h1>
      <Button 
        variant="contained" 
        color="primary" 
        onClick={() => navigate('/')}
      >
        Go Back
      </Button>
    </div>
  );
}

export default Test;
