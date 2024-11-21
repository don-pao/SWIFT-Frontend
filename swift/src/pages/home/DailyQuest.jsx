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
import { usePersonalInfo } from '../../context/PersonalInfoContext'; // Import the context hook

function DailyQuest({ quests, setQuests, coins, setCoins, tasks = [] }) {
  // Access the user info from context
  const { personalInfo } = usePersonalInfo();
  const userID = personalInfo.userId;

  // Get today's date in a readable format
  const todayDate = new Date().toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });

  // Fetch Quests for the logged-in user
  const fetchQuests = useCallback(async () => {
    if (!userID) {
      return; // Ensure userID is present before fetching quests
    }

    try {
      const response = await axios.get(`http://localhost:8080/api/dailyquest/getDailyQuestByUserID/${userID}`);
      setQuests(response.data);
    } catch (error) {
      console.error('Error fetching quests:', error);
    }
  }, [setQuests, userID]);

  useEffect(() => {
    fetchQuests();
  }, [fetchQuests]);

  // Automatically update quest completion based on specific requirements
  useEffect(() => {
    if (Array.isArray(tasks) && Array.isArray(quests)) {
      const completedTasksCount = tasks.filter((task) => task.status === 1).length;

      // Check if a quest like "Complete 5 to do's today" exists and mark it as completed if requirements are met
      quests.forEach((quest) => {
        if (quest.title === "Complete 5 to do's today" && completedTasksCount >= 5 && quest.status === 'incomplete') {
          updateQuestStatus(quest.dailyQuestId, 'completed');
        }
      });
    }
  }, [tasks, quests]);

  // Handle quest status update
  const updateQuestStatus = async (questId, newStatus) => {
    try {
      await axios.put(`http://localhost:8080/api/dailyquest/putDailyQuestDetails?id=${questId}`, {
        status: newStatus,
      });
      fetchQuests(); // Refresh quests after updating status
    } catch (error) {
      console.error('Error updating quest status:', error);
    }
  };

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
            marginBottom: '20px',
            cursor: 'default', // Changes cursor to indicate that it's not clickable
          }}
        >
          {todayDate}
        </Button>

        <Grid container direction="column" spacing={3}> {/* Adjusted spacing to ensure uniform gap */}
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
                    checked={quest.status === 'completed'}
                    disabled // Disable user interaction
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