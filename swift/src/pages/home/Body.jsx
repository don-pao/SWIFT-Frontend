import React, { useState, useEffect } from 'react';
import { Box, Typography, Button } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import Task from './Task';
import DailyQuest from './DailyQuest';
import { usePersonalInfo } from '../../context/PersonalInfoContext';
import { useTheme } from '../../context/ThemeContext';

function Body() {
  const [quests, setQuests] = useState([]);
  const [coins, setCoins] = useState(0);
  const [flashcardSets, setFlashcardSets] = useState([]);
  const navigate = useNavigate();
  const { personalInfo } = usePersonalInfo();
  const { theme } = useTheme();
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

  // Handle clicking a flashcard set to navigate to the review page
  const handleFlashcardClick = (setId) => {
    navigate(`/review/${setId}`);
  };

  return (
    <Box display="flex" justifyContent="space-between" sx={{ padding: '20px', height: '100%', backgroundColor: theme.pageBackground, // Dynamic background
      transition: 'background-color 0.3s ease' }}>
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
              mb: '20px', // Added margin-bottom for spacing
              '&:hover': {
                backgroundColor: '#dcdcdc',
              },
            }}
          >
            Add a Flashcard
          </Button>
          <Box sx={{ flexGrow: 1, overflowY: 'auto' }}>
            {flashcardSets.length > 0 ? (
              flashcardSets.map((flashcardSet) => (
                <Box
                  key={flashcardSet.setId}
                  sx={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    padding: '15px',
                    marginBottom: '10px',
                    borderRadius: '8px',
                    border: '1px solid #ddd',
                    backgroundColor: '#ffffff',
                    boxShadow: '0px 1px 5px rgba(0, 0, 0, 0.1)',
                    transition: 'transform 0.2s',
                    '&:hover': {
                      boxShadow: '0px 4px 12px rgba(0, 0, 0, 0.2)',
                      cursor: 'pointer', // Indicate it's clickable
                      borderBottom: '4px solid #A8B1FF',
                    },
                  }}
                  onClick={() => handleFlashcardClick(flashcardSet.setId)} // Navigate on click
                >
                  {/* Metadata Section */}
                  <Box sx={{ display: 'flex', flexDirection: 'column', flex: 1 }}>
                    <Typography variant="subtitle1" sx={{ fontWeight: 'bold', color: '#34313A' }}>
                      {flashcardSet.title}
                    </Typography>
                    <Typography variant="body2" sx={{ color: '#757575', marginTop: '5px' }}>
                      {flashcardSet.description || 'No description available.'}
                    </Typography>
                    <Typography variant="caption" sx={{ marginTop: '5px', color: '#999' }}></Typography>
                  </Box>

                  {/* Edit Button */}
                  <Button
                    variant="outlined"
                    size="small"
                    sx={{
                      padding: '5px 15px',
                      borderRadius: '8px',
                      borderColor: '#ccc',
                      color: '#34313A',
                      fontWeight: 'bold',
                      textTransform: 'none',
                      '&:hover': {
                        borderColor: '#999',
                        backgroundColor: '#f9f9f9',
                      },
                    }}
                    onClick={() => navigate(`/flashcard-set-form/${flashcardSet.setId}`)} // Navigate to edit form with setId
                  >
                    Edit
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
      </Box>

      <Task />
    </Box>
  );
}

export default Body;
