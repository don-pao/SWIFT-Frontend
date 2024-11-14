import React, { useState, useEffect, useCallback } from 'react';
import axios from 'axios';
import {
  Box,
  Typography,
  Button,
  Grid,
  Card,
  CardContent,
  Checkbox,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  IconButton,
} from '@mui/material';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';

function DailyQuest({ quests, setQuests, coins, setCoins }) {
  const [openDialog, setOpenDialog] = useState(false);
  const [isEditMode, setIsEditMode] = useState(false);
  const [currentQuestId, setCurrentQuestId] = useState(null);
  const [newQuestData, setNewQuestData] = useState({
    title: '',
    description: '',
    reward: 0,
  });
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [questToDelete, setQuestToDelete] = useState(null);
  const [editConfirmationDialogOpen, setEditConfirmationDialogOpen] = useState(false);
  const [questToEdit, setQuestToEdit] = useState(null);

  const fetchQuests = useCallback(async () => {
    try {
      const response = await axios.get('http://localhost:8080/api/dailyquest/getAllDailyQuest');
      setQuests(response.data);
    } catch (error) {
      console.error('Error fetching quests:', error);
    }
  }, [setQuests]);

  useEffect(() => {
    fetchQuests();
  }, [fetchQuests]);

  const handleQuestToggle = async (id) => {
    try {
      const quest = quests.find((quest) => quest.dailyQuestId === id);
      const updatedQuest = { ...quest, status: quest.status === 'completed' ? 'incomplete' : 'completed' };

      await axios.put(`http://localhost:8080/api/dailyquest/putDailyQuestDetails?id=${id}`, updatedQuest);

      setQuests((prevQuests) =>
        prevQuests.map((quest) => (quest.dailyQuestId === id ? updatedQuest : quest))
      );

      if (quest.status === 'incomplete') {
        setCoins((prevCoins) => prevCoins + quest.coinsEarned);
      } else {
        setCoins((prevCoins) => prevCoins - quest.coinsEarned);
      }
    } catch (error) {
      console.error('Error updating quest:', error);
    }
  };

  const handleOpenDialog = (quest = null) => {
    if (quest) {
      setNewQuestData({
        title: quest.title,
        description: quest.description,
        reward: quest.coinsEarned,
      });
      setIsEditMode(true);
      setCurrentQuestId(quest.dailyQuestId);
    } else {
      setNewQuestData({
        title: '',
        description: '',
        reward: 0,
      });
      setIsEditMode(false);
      setCurrentQuestId(null);
    }
    setOpenDialog(true);
  };

  const handleCloseDialog = () => {
    setOpenDialog(false);
    setNewQuestData({
      title: '',
      description: '',
      reward: 0,
    });
    setIsEditMode(false);
    setCurrentQuestId(null);
  };

  const handleSaveQuest = async () => {
    const questData = {
      title: newQuestData.title,
      description: newQuestData.description,
      status: isEditMode ? undefined : 'incomplete',
      coinsEarned: newQuestData.reward,
    };

    try {
      if (isEditMode && currentQuestId) {
        await axios.put(
          `http://localhost:8080/api/dailyquest/putDailyQuestDetails?id=${currentQuestId}`,
          questData
        );
      } else {
        await axios.post('http://localhost:8080/api/dailyquest/postDailyQuestRecord', questData);
      }
      handleCloseDialog();
      fetchQuests();
    } catch (error) {
      console.error('Error saving quest:', error);
    }
  };

  const handleOpenDeleteDialog = (quest) => {
    setQuestToDelete(quest);
    setDeleteDialogOpen(true);
  };

  const handleCloseDeleteDialog = () => {
    setDeleteDialogOpen(false);
    setQuestToDelete(null);
  };

  const handleDeleteQuest = async () => {
    if (!questToDelete) return;
    try {
      await axios.delete(`http://localhost:8080/api/dailyquest/deleteDailyQuestDetails/${questToDelete.dailyQuestId}`);
      setQuests((prevQuests) => prevQuests.filter((quest) => quest.dailyQuestId !== questToDelete.dailyQuestId));
      handleCloseDeleteDialog();
    } catch (error) {
      console.error('Error deleting quest:', error);
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
        <Button
          variant="contained"
          onClick={() => handleOpenDialog()}
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
          }}
        >
          Add a Quest
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
                    onChange={() => handleQuestToggle(quest.dailyQuestId)}
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
                    <Box display="flex" alignItems="center" gap={1}>
                      <img
                        src="/images/themes/coin.jpg"
                        alt="coin"
                        style={{ width: '20px', height: '20px' }}
                      />
                      <Typography variant="body2" sx={{ fontWeight: 'bold', color: '#333' }}>
                        {quest.coinsEarned}
                      </Typography>
                    </Box>
                  </Box>
                  <Typography variant="body2" sx={{ color: '#555', marginTop: '3px', fontSize: '1rem' }}>
                    {quest.description}
                  </Typography>
                  <Box display="flex" alignItems="center" justifyContent="flex-end" sx={{ marginTop: '8px' }}>
                    <IconButton onClick={() => { setEditConfirmationDialogOpen(true); setQuestToEdit(quest); }} sx={{ color: '#216ECC', marginRight: 1 }}>
                      <EditIcon fontSize="small" />
                    </IconButton>
                    <IconButton onClick={() => handleOpenDeleteDialog(quest)} sx={{ color: '#E03E30' }}>
                      <DeleteIcon fontSize="small" />
                    </IconButton>
                  </Box>
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>
      </Box>

      {/* Dialog for Adding or Editing a Quest */}
      <Dialog open={openDialog} onClose={handleCloseDialog}>
        <DialogTitle>{isEditMode ? 'Edit Quest' : 'Add New Quest'}</DialogTitle>
        <DialogContent>
          <TextField
            label="Title"
            fullWidth
            margin="dense"
            value={newQuestData.title}
            onChange={(e) => setNewQuestData({ ...newQuestData, title: e.target.value })}
          />
          <TextField
            label="Description"
            fullWidth
            margin="dense"
            value={newQuestData.description}
            onChange={(e) => setNewQuestData({ ...newQuestData, description: e.target.value })}
          />
          <TextField
            label="Coins Earned"
            type="number"
            fullWidth
            margin="dense"
            value={newQuestData.reward}
            onChange={(e) => setNewQuestData({ ...newQuestData, reward: parseInt(e.target.value, 10) })}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDialog} sx={{ backgroundColor: '#E1DFE2', color: '#757575' }}>
            Cancel
          </Button>
          <Button onClick={handleSaveQuest} sx={{ backgroundColor: '#216ECC', color: '#ffffff', '&:hover': { backgroundColor: '#1a5dab' } }}>
            {isEditMode ? 'Save' : 'Add'}
          </Button>
        </DialogActions>
      </Dialog>

      {/* Dialog for Deleting a Quest */}
      <Dialog open={deleteDialogOpen} onClose={handleCloseDeleteDialog}>
        <DialogTitle>Are you sure you want to delete this record?</DialogTitle>
        <DialogActions>
          <Button onClick={handleCloseDeleteDialog} sx={{ backgroundColor: '#E1DFE2', color: '#757575' }}>
            No
          </Button>
          <Button onClick={handleDeleteQuest} sx={{ backgroundColor: '#E03E30', color: '#ffffff', '&:hover': { backgroundColor: '#cc352a' } }}>
            Yes
          </Button>
        </DialogActions>
      </Dialog>

      {/* Confirmation Dialog for Editing a Quest */}
      <Dialog open={editConfirmationDialogOpen} onClose={() => setEditConfirmationDialogOpen(false)}>
        <DialogTitle>Are you sure you want to update this record?</DialogTitle>
        <DialogActions>
          <Button onClick={() => setEditConfirmationDialogOpen(false)} sx={{ backgroundColor: '#E1DFE2', color: '#757575' }}>
            Cancel
          </Button>
          <Button onClick={() => { setEditConfirmationDialogOpen(false); handleOpenDialog(questToEdit); }} sx={{ backgroundColor: '#216ECC', color: '#ffffff', '&:hover': { backgroundColor: '#1a5dab' } }}>
            Yes
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}

export default DailyQuest;
