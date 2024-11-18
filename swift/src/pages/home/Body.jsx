import React, { useState } from 'react';
import { Box, Typography, Button } from '@mui/material';
import { useNavigate } from 'react-router-dom'; // Import useNavigate
import Task from './Task';
import DailyQuest from './DailyQuest';

function Body() {
  const [quests, setQuests] = useState([]);
  const [coins, setCoins] = useState(0);
  const navigate = useNavigate(); // Initialize navigate

  const handleAddFlashcard = () => {
    navigate('/flashcard-set-form'); // Navigate to /flashcard-set-form
  };

  return (
    <Box display="flex" justifyContent="space-between" sx={{ padding: '20px', height: '100%', backgroundColor: '#f5f5f5' }}>
      <DailyQuest quests={quests} setQuests={setQuests} coins={coins} setCoins={setCoins} />

      <Box sx={{ width: '42%', height: '100%' }}>
        <Typography variant="h5" sx={{ marginBottom: '10px', fontWeight: 'bold', color: '#34313A', textAlign: 'left' }}>
          Flashcards
        </Typography>
        <Box
          sx={{
            height: '100%',
            border: '1px solid #ccc',
            borderRadius: '8px',
            padding: '10px',
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'flex-start',
            backgroundColor: '#ffffff',
            boxShadow: '0px 2px 10px rgba(0, 0, 0, 0.1)',
          }}
        >
          <Button
            variant="contained"
            onClick={handleAddFlashcard} // Attach click handler
            sx={{
              backgroundColor: '#E1DFE2',
              color: '#757575',
              textAlign: 'left',
              padding: '15px 20px',
              borderRadius: '8px',
              fontWeight: 'bold',
              fontSize: '1rem',
              lineHeight: '1.5',
              width: '100%',
              justifyContent: 'flex-start',
            }}
          >
            Add a Flashcard
          </Button>
        </Box>
      </Box>

      <Task />
    </Box>
  );
}

export default Body;
