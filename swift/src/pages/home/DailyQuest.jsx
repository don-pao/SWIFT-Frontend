import React, { useState, useEffect, useCallback } from 'react';
import axios from 'axios';
import {
  Box,
  Typography,
  Grid,
  Card,
  CardContent,
  Checkbox,
  Button,
} from '@mui/material';
import { usePersonalInfo } from '../../context/PersonalInfoContext';

function DailyQuest({ tasks = [] }) {
  const { personalInfo } = usePersonalInfo();
  const userID = personalInfo.userId;
  const [quests, setQuests] = useState([]);

  // Get today's date in a readable format
  const todayDate = new Date().toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });

  // Fetch Quests for the logged-in user
  const fetchQuests = useCallback(async () => {
    if (!userID) {
      return;
    }

    try {
      const response = await axios.get(`http://localhost:8080/api/dailyquest/getDailyQuestByUserID/${userID}`);
      
      // Filtering out any potential duplicates
      const uniqueQuests = response.data.filter(
        (quest, index, self) => index === self.findIndex(q => q.title === quest.title)
      );

      // Sort quests to ensure "Login" appears before "To Do's"
      const sortedQuests = uniqueQuests.sort((a, b) => {
        if (a.title === "Login") return -1;
        if (b.title === "Login") return 1;
        return 0;
      });

      setQuests(sortedQuests);
    } catch (error) {
      console.error('Error fetching quests:', error);
    }
  }, [userID]);

  useEffect(() => {
    fetchQuests();
  }, [fetchQuests]);

  // Automatically update quest completion when 5 tasks are completed
  useEffect(() => {
    if (tasks.filter(task => task.status).length >= 5) {
      axios.put(`http://localhost:8080/api/dailyquest/updateQuestStatus/${userID}`)
        .then(() => fetchQuests()) // Refresh quests after updating status
        .catch(err => console.error('Error updating quest status:', err));
    }
  }, [tasks, userID, fetchQuests]);

  // Automatically update "Quiz" quest completion when the quiz is taken (add quiz completion check)
  useEffect(() => {
    const quizQuest = quests.find((quest) => quest.title === "Quiz");
    if (quizQuest && quizQuest.status.trim().toLowerCase() === 'incomplete') {
      axios.put(`http://localhost:8080/api/dailyquest/updateQuizQuestStatus/${userID}`)
        .then(() => fetchQuests()) // Refresh quests after updating status
        .catch(err => console.error('Error updating quiz quest status:', err));
    }
  }, [quests, userID, fetchQuests]);

  return (
    <Box sx={{ width: '30%', height: '100%' }}>
      <Typography variant="h5" sx={{ marginBottom: '10px', fontWeight: 'bold', color: '#34313A', textAlign: 'left' }}>
        Daily Quests
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
        {/* Date Display Button Styled but Disabled */}
        <Button
          variant="contained"
          disabled // Make the button non-clickable
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
            marginBottom: '10px', // Adjusted from '20px' to '10px' to lessen the space
            cursor: 'default', // Changes cursor to indicate that it's not clickable
          }}
        >
          {todayDate}
        </Button>

        <Grid container direction="column" spacing={2}> {/* Reduced spacing from 3 to 2 */}
          {quests.map((quest) => (
            <Grid item key={quest.dailyQuestId}>
              <Card
                sx={{
                  borderRadius: '12px',
                  boxShadow: '0px 4px 12px rgba(0, 0, 0, 0.1)',
                  border: '1px solid #e0e0e0',
                  backgroundColor: '#f9f9f9',
                  overflow: 'hidden',
                  display: 'flex',
                  '&:hover': {
                    boxShadow: '0px 6px 18px rgba(0, 0, 0, 0.2)',
                  },
                }}
              >
                <Box
                  sx={{
                    width: '15%',
                    backgroundColor: '#9e7aac',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    padding: 1,
                  }}
                >
                  <Checkbox
                    checked={quest.status.trim().toLowerCase() === 'complete'} // Ensuring the status is correctly handled
                    disabled // Disable user interaction with the checkbox
                    sx={{
                      color: '#ffffff',
                      '& .MuiSvgIcon-root': {
                        fontSize: 32,
                      },
                      '&.Mui-checked': {
                        color: '#ffffff',
                      },
                    }}
                  />
                </Box>
                <CardContent sx={{ flex: 1 }}>
                  <Box display="flex" alignItems="center" justifyContent="space-between">
                    <Typography variant="h6" sx={{ fontWeight: 'bold', color: '#333' }}>
                      {quest.title}
                    </Typography>
                  </Box>
                  <Typography variant="body2" sx={{ color: '#555', marginTop: '3px', fontSize: '1rem' }}>
                    {quest.description}
                  </Typography>
                  <Box display="flex" alignItems="center" gap={1} sx={{ marginTop: '3px' }}>
                    <img
                      src="/images/themes/coin.png"
                      alt="coin"
                      style={{ width: '20px', height: '20px' }}
                    />
                    <Typography variant="body2" sx={{ fontWeight: 'bold', color: '#333' }}>
                      {quest.coinsEarned}
                    </Typography>
                  </Box>
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>
      </Box>
    </Box>
  );
}

export default DailyQuest;
