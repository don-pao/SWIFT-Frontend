import React, { useState, useEffect } from 'react';
import { Box, Typography, Button } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import Task from './Task';
import DailyQuest from './DailyQuest';
import { usePersonalInfo } from '../../context/PersonalInfoContext';

function Body() {
  const [quests, setQuests] = useState([]);
  const [coins, setCoins] = useState(0);
  const [flashcardSets, setFlashcardSets] = useState([]);
  const navigate = useNavigate();
  const { personalInfo } = usePersonalInfo();

  const handleAddFlashcard = () => {
    navigate('/flashcard-set-form');
  };

  const fetchFlashcardSets = async () => {
    try {
      const response = await axios.get(`http://localhost:8080/api/flashcardset/getAllFlashcardSetByUser/${personalInfo.userId}`);
      setFlashcardSets(response.data);
    } catch (error) {
      console.error('Error fetching flashcard sets:', error);
    }
  };

  useEffect(() => {
    if (personalInfo?.userId) {
      fetchFlashcardSets();
    }
  }, [personalInfo?.userId]);

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
            onClick={handleAddFlashcard}
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

          <Typography variant="h6" sx={{ marginTop: '20px', fontWeight: 'bold', color: '#34313A' }}>
            Flashcard Sets
          </Typography>
          {flashcardSets.length > 0 ? (
            flashcardSets.map((flashcardSet) => (
              <Box key={flashcardSet.setId} sx={{ marginTop: '10px', border: '1px solid #ddd', borderRadius: '8px', padding: '10px' }}>
                <Typography variant="subtitle1" sx={{ fontWeight: 'bold' }}>
                  {flashcardSet.title}
                </Typography>
                <Typography variant="body2">{flashcardSet.description}</Typography>
                <Button
                  variant="outlined"
                  sx={{ marginTop: '10px', ml: 'auto' }}
                  onClick={() => navigate(`/flashcard-set-form/`)}
                >
                  Edit Flashcard Set
                </Button>
              </Box>
            ))
          ) : (
            <Typography sx={{ marginTop: '20px', color: '#757575' }}>
              No flashcard sets found. Start by adding one!
            </Typography>
          )}
        </Box>
      </Box>

      <Task />
    </Box>
  );
}

export default Body;
