import React, { useState, useEffect } from 'react';
import axios from 'axios';
import {
  Box,
  Typography,
  Button,
  Grid,
  Card,
  CardContent,
  Checkbox,
  Avatar,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  IconButton,
  Chip,
  CardActions,
} from '@mui/material';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import ToDoFormModal from './ToDoFormModal';
import { Delete, Edit } from '@mui/icons-material';

function Body() {
  const [quests, setQuests] = useState([]);
  const [coins, setCoins] = useState(0);
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
  const [isModalOpen, setModalOpen] = useState(false);
  const [tasks, setTasks] = useState([]);
  const [selectedTask, setSelectedTask] = useState(null);

  useEffect(() => {
    fetchQuests();
    fetchTasks();
  }, []);

  const fetchQuests = async () => {
    try {
      const response = await axios.get('http://localhost:8080/api/dailyquest/getAllDailyQuest');
      setQuests(response.data);
    } catch (error) {
      console.error('Error fetching quests:', error);
    }
  };

  const fetchTasks = async () => {
    try {
      const response = await axios.get('http://localhost:8080/api/task/getAllTasks');
      const sortedTasks = response.data.sort((a, b) => a.priority - b.priority);
      setTasks(sortedTasks);
    } catch (error) {
      console.error('Error fetching tasks:', error);
    }
  };

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

  const handleOpenModal = () => {
    setModalOpen(true);
  };

  const handleCloseModal = () => {
    setModalOpen(false);
    setSelectedTask(null);
  };

  const handleSaveToDo = (newTask) => {
    setTasks((prevTasks) => [...prevTasks, newTask].sort((a, b) => a.priority - b.priority));
  };

  const deleteTask = async (taskId) => {
    try {
      await axios.delete(`http://localhost:8080/api/task/deleteTaskDetails/${taskId}`);
      setTasks((prevTasks) => prevTasks.filter((task) => task.taskId !== taskId));
    } catch (error) {
      console.error('Error deleting task:', error);
    }
  };

  const handleEditTask = (task) => {
    setSelectedTask(task);
    setModalOpen(true);
  };

  const handleUpdateTask = async (updatedTask) => {
    try {
      const response = await axios.put(`http://localhost:8080/api/task/putTaskDetails?id=${updatedTask.taskId}`, updatedTask);
      const updatedTaskData = response.data;
      setTasks((prevTasks) =>
        prevTasks.map((task) => (task.taskId === updatedTaskData.taskId ? updatedTaskData : task)).sort((a, b) => a.priority - b.priority)
      );
      handleCloseModal();
    } catch (error) {
      console.error('Error updating task:', error);
    }
  };

  return (
    <Box display="flex" justifyContent="space-between" sx={{ padding: '20px', height: '100vh', backgroundColor: '#f5f5f5' }}>
      {/* Left Box - Daily Quests */}
      <Box sx={{ width: '30%', height: '100%' }}>
        <Typography variant="h5" sx={{ marginBottom: '10px', fontWeight: 'bold', color: '#34313A', textAlign: 'left' }}>
          Daily Quests
        </Typography>
        <Box
          sx={{
            height: 'calc(100% - 80px)',
            border: '1px solid #ccc',
            borderRadius: '8px',
            padding: '10px',
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'flex-start',
            backgroundColor: '#ffffff',
            boxShadow: '0px 2px 10px rgba(0, 0, 0, 0.1)',
            overflowY: 'auto',
          }}
        >
          <Grid container direction="column" spacing={2}>
            {quests.map((quest) => (
              <Grid item key={quest.dailyQuestId}>
                <Card
                  sx={{
                    backgroundColor: '#E1DFE2',
                    padding: '10px',
                    borderRadius: '8px',
                    boxShadow: '0px 2px 5px rgba(0, 0, 0, 0.1)',
                  }}
                >
                  <CardContent>
                    <Box display="flex" alignItems="center">
                      <Avatar sx={{ backgroundColor: '#F4B400', width: 24, height: 24, marginRight: '10px' }}></Avatar>
                      <Checkbox
                        checked={quest.status === 'completed'}
                        onChange={() => handleQuestToggle(quest.dailyQuestId)}
                        color="primary"
                      />
                      <Box>
                        <Typography
                          variant="body1"
                          sx={{ fontWeight: 'bold', color: quest.status === 'completed' ? '#757575' : '#34313A' }}
                        >
                          {quest.title}
                        </Typography>
                        <Typography variant="body2" sx={{ color: '#757575' }}>
                          {quest.description}
                        </Typography>
                        <Typography
                          variant="caption"
                          sx={{ color: '#34313A', fontWeight: 'bold', marginTop: '5px' }}
                        >
                          Coins Earned: {quest.coinsEarned}
                        </Typography>
                      </Box>
                      <IconButton onClick={() => handleOpenDialog(quest)} sx={{ marginLeft: 'auto' }} color="primary">
                        <EditIcon />
                      </IconButton>
                      <IconButton onClick={() => handleOpenDeleteDialog(quest)} color="error">
                        <DeleteIcon />
                      </IconButton>
                    </Box>
                  </CardContent>
                </Card>
              </Grid>
            ))}
          </Grid>
          <Button variant="contained" onClick={() => handleOpenDialog()} sx={{ marginTop: '20px' }}>
            Add Quest
          </Button>
          <Typography variant="h6" sx={{ marginTop: '20px', fontWeight: 'bold', color: '#34313A' }}>
            Total Coins: {coins}
          </Typography>
        </Box>
      </Box>

      {/* Middle Box - Flashcards */}
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

      {/* Right Box - To Do's */}
      <Box sx={{ width: '30%', height: '100%' }}>
        <Typography variant="h5" sx={{ marginBottom: '10px', fontWeight: 'bold', color: '#34313A', textAlign: 'left' }}>
          To Do's
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
            onClick={handleOpenModal}
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
              marginBottom: '10px',
            }}
          >
            Add a To Do
          </Button>

          <ToDoFormModal
            open={isModalOpen}
            handleClose={handleCloseModal}
            handleSave={selectedTask ? handleUpdateTask : handleSaveToDo}
            task={selectedTask}
          />

          <Box>
            {tasks.map((task) => (
              <Card
                key={task.taskId}
                sx={{
                  marginBottom: '15px',
                  borderRadius: '12px',
                  boxShadow: '0px 4px 12px rgba(0, 0, 0, 0.1)',
                  border: '1px solid #e0e0e0',
                  backgroundColor: '#f9f9f9',
                  overflow: 'hidden',
                  '&:hover': {
                    boxShadow: '0px 6px 18px rgba(0, 0, 0, 0.2)',
                  },
                }}
              >
                <CardContent>
                  <Typography variant="h6" sx={{ fontWeight: 'bold', color: '#333' }}>
                    {task.title}
                  </Typography>
                  <Typography variant="body2" sx={{ color: '#555', marginBottom: '8px' }}>
                    {task.description}
                  </Typography>
                  <Box display="flex" justifyContent="space-between" alignItems="center" sx={{ marginBottom: '8px' }}>
                    <Chip
                      label={`Priority: ${task.priority}`}
                      size="small"
                      sx={{
                        backgroundColor:
                          task.priority === 1 ? '#ff8a80' : task.priority === 2 ? '#ffcc80' : '#a5d6a7',
                        color: '#fff',
                        fontWeight: 'bold',
                      }}
                    />
                    <Typography variant="caption" sx={{ color: '#757575' }}>
                      Deadline: {task.deadline}
                    </Typography>
                  </Box>
                  <Typography
                    variant="body2"
                    sx={{ color: task.status ? '#4caf50' : '#f44336', fontWeight: 'bold' }}
                  >
                    Status: {task.status ? 'Completed' : 'Pending'}
                  </Typography>
                </CardContent>
                <CardActions disableSpacing sx={{ display: 'flex', justifyContent: 'flex-end' }}>
                  <IconButton aria-label="edit task" onClick={() => handleEditTask(task)}>
                    <Edit fontSize="small" />
                  </IconButton>
                  <IconButton aria-label="delete task" onClick={() => deleteTask(task.taskId)}>
                    <Delete fontSize="small" />
                  </IconButton>
                </CardActions>
              </Card>
            ))}
          </Box>
        </Box>
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
          <Button onClick={handleCloseDialog} color="secondary">
            Cancel
          </Button>
          <Button onClick={handleSaveQuest} color="primary">
            {isEditMode ? 'Save' : 'Add'}
          </Button>
        </DialogActions>
      </Dialog>

      {/* Dialog for Deleting a Quest */}
      <Dialog open={deleteDialogOpen} onClose={handleCloseDeleteDialog}>
        <DialogTitle>Are you sure to delete this daily quest?</DialogTitle>
        <DialogActions>
          <Button onClick={handleCloseDeleteDialog} color="secondary">
            No
          </Button>
          <Button onClick={handleDeleteQuest} color="error">
            Yes
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}

export default Body;
