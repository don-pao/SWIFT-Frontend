import React, { useState, useEffect, useCallback } from 'react';
import axios from 'axios';
import { Box, Typography, Button, Card, CardContent, Chip, IconButton, Modal, Checkbox,Menu, MenuItem,} from '@mui/material';
import ToDoFormModal from './ToDoFormModal';
import { MoreVert } from '@mui/icons-material';
import { usePersonalInfo } from '../../context/PersonalInfoContext';

function Task() {
  const [isModalOpen, setModalOpen] = useState(false);
  const [tasks, setTasks] = useState([]);
  const [selectedTask, setSelectedTask] = useState(null);
  const [deleteConfirmOpen, setDeleteConfirmOpen] = useState(false);
  const [taskToDelete, setTaskToDelete] = useState(null);
  const [anchorEl, setAnchorEl] = useState(null);
  const [menuTask, setMenuTask] = useState(null);
  const [activeTab, setActiveTab] = useState('Pending');

  const { personalInfo } = usePersonalInfo();
  const userId = personalInfo?.userId;

  const handleOpenModal = () => {
    setSelectedTask(null);
    setModalOpen(true);
  };

  const handleCloseModal = () => {
    setModalOpen(false);
    setSelectedTask(null);
  };

  const fetchTasks = useCallback(async () => {
    if (!userId) return;
    try {
      const response = await axios.get(`http://localhost:8080/api/task/getTasksByUser/${userId}`);
      const sortedTasks = response.data.sort((a, b) => a.priority - b.priority);
      setTasks(sortedTasks);
    } catch (error) {
      console.error('Error fetching tasks:', error);
    }
  }, [userId]);

  const handleSaveToDo = (savedTask) => {
    setTasks((prevTasks) => {
      const taskExists = prevTasks.some((task) => task.taskId === savedTask.taskId);
  
      if (taskExists) {
        // Update the existing task
        return prevTasks.map((task) =>
          task.taskId === savedTask.taskId ? savedTask : task
        );
      } else {
        // Add a new task
        return [...prevTasks, savedTask].sort((a, b) => a.priority - b.priority);
      }
    });
  
    handleCloseModal();
  };

  const handleUpdateTask = async (updatedTask) => {
    try {
      await axios.put(`http://localhost:8080/api/task/putTaskDetails?id=${updatedTask.taskId}`, updatedTask);
      fetchTasks();
      handleCloseModal();
    } catch (error) {
      console.error('Error updating task:', error);
    }
  };

  const toggleTaskStatus = async (taskId, currentStatus) => {
    try {
      await axios.put(`http://localhost:8080/api/task/updateTaskStatus?id=${taskId}&status=${!currentStatus}`);
      fetchTasks();
    } catch (error) {
      console.error('Error updating task status:', error);
    }
  };

  useEffect(() => {
    fetchTasks();
  }, [fetchTasks]);

  const deleteTask = async (taskId) => {
    try {
      await axios.delete(`http://localhost:8080/api/task/deleteTaskDetails/${taskId}`);
      fetchTasks();
      setDeleteConfirmOpen(false);
    } catch (error) {
      console.error('Error deleting task:', error);
    }
  };

  const openDeleteConfirm = (task) => {
    setTaskToDelete(task);
    setDeleteConfirmOpen(true);
  };

  const handleEditTask = (task) => {
    setSelectedTask(task);
    setModalOpen(true);
  };

  const handleMenuOpen = (event, task) => {
    setAnchorEl(event.currentTarget);
    setMenuTask(task);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
    setMenuTask(null);
  };

  const formatDeadline = (deadline) => {
    const date = new Date(deadline);
    return new Intl.DateTimeFormat('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    }).format(date);
  };

  return (
    <Box sx={{ width: '30%', height: '100%' }}>
      {/* Task Header */}
      <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <Typography variant="h5" sx={{ fontWeight: 'bold', color: '#34313A', textAlign: 'left' }}>
          To Do's
        </Typography>
        <Box sx={{ display: 'flex', gap: 2 }}>
          <Box
            onClick={() => setActiveTab('Pending')}
            sx={{
              cursor: 'pointer',
              padding: '8px 12px',
              borderBottom: activeTab === 'Pending' ? '4px solid #4F2A93' : 'none',
            }}
          >
            <Typography sx={{ fontWeight: 'bold', color: activeTab === 'Pending' ? '#4F2A93' : '#757575' }}>
              Pending
            </Typography>
          </Box>
          <Box
            onClick={() => setActiveTab('Done')}
            sx={{
              cursor: 'pointer',
              padding: '8px 12px',
              borderBottom: activeTab === 'Done' ? '4px solid #4F2A93' : 'none',
            }}
          >
            <Typography sx={{ fontWeight: 'bold', color: activeTab === 'Done' ? '#4F2A93' : '#757575' }}>
              Done
            </Typography>
          </Box>
        </Box>
      </Box>

      {/* Task List UI */}
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
          {tasks
            .filter((task) => (activeTab === 'Pending' ? !task.status : task.status))
            .map((task) => (
              <Card
                key={task.taskId}
                sx={{
                  marginBottom: '10px',
                  borderRadius: '8px',
                  boxShadow: '0px 2px 8px rgba(0, 0, 0, 0.1)',
                  border: '1px solid #e0e0e0',
                  backgroundColor: '#f9f9f9',
                  overflow: 'hidden',
                  display: 'flex',
                  height: 'auto',
                  '&:hover': {
                    boxShadow: '0px 4px 12px rgba(0, 0, 0, 0.2)',
                  },
                }}
              >
                <Box
                  sx={{
                    width: '15%',
                    backgroundColor: '#FFBE5D',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    padding: '8px',
                  }}
                >
                  <Checkbox
                    checked={task.status}
                    onChange={() => toggleTaskStatus(task.taskId, task.status)}
                    sx={{
                      color: '#FFDFAE',
                      '& .MuiSvgIcon-root': {
                        fontSize: 28,
                      },
                      '&.Mui-checked': {
                        color: '#FFDFAE',
                      },
                    }}
                  />
                </Box>
                <CardContent
                  sx={{
                    flex: 1,
                    padding: '14px 12px',
                    paddingBottom: '12px !important',
                  }}
                >
                  <Box display="flex" alignItems="center" justifyContent="space-between">
                    <Typography variant="h6" sx={{ fontWeight: 'bold', color: '#333', fontSize: '1rem' }}>
                      {task.title}
                    </Typography>
                    <Chip
                      label={`${task.priority === 1 ? 'High' : task.priority === 2 ? 'Medium' : 'Low'}`}
                      size="small"
                      sx={{
                        width: '70px',
                        textAlign: 'center',
                        backgroundColor:
                          task.priority === 1 ? '#E96559' : task.priority === 2 ? '#ffcc80' : '#a5d6a7',
                        color: '#fff',
                        fontWeight: 'bold',
                        fontSize: '0.75rem',
                      }}
                    />
                  </Box>
                  <Typography variant="body2" sx={{ color: '#555', marginTop: '6px', fontSize: '0.875rem', fontSize: '1rem'}}>
                    {task.description}
                  </Typography>
                  <Typography variant="caption" sx={{ color: '#757575', marginTop: '6px' }}>
                    Deadline: {formatDeadline(task.deadline)}
                  </Typography>

                  <Box display="flex" alignItems="center" justifyContent="space-between" sx={{ marginTop: '6px' }}>
                    <Typography
                      variant="caption"
                      sx={{ color: task.status ? '#4caf50' : '#f44336', fontWeight: 'bold', fontSize: '0.9rem' }}
                    >
                      Status: {task.status ? 'Completed' : 'Pending'}
                    </Typography>
                    <Box>
                      <IconButton
                        aria-label="more options"
                        onClick={(event) => handleMenuOpen(event, task)}
                        sx={{ color: '#757575' }}
                      >
                        <MoreVert />
                      </IconButton>
                    </Box>
                  </Box>
                </CardContent>
              </Card>
            ))}
        </Box>
      </Box>

      <Menu anchorEl={anchorEl} open={Boolean(anchorEl)} onClose={handleMenuClose}>
        <MenuItem
          onClick={() => {
            handleEditTask(menuTask);
            handleMenuClose();
          }}
        >
          Edit
        </MenuItem>
        <MenuItem
          onClick={() => {
            openDeleteConfirm(menuTask);
            handleMenuClose();
          }}
        >
          Delete
        </MenuItem>
      </Menu>

      <Modal
        open={deleteConfirmOpen}
        onClose={() => setDeleteConfirmOpen(false)}
        aria-labelledby="delete-confirmation-modal"
        aria-describedby="delete-confirmation-description"
      >
        <Box
          sx={{
            position: 'absolute',
            top: '50%',
            left: '50%',
            transform: 'translate(-50%, -50%)',
            width: 300,
            bgcolor: 'background.paper',
            boxShadow: 24,
            p: 4,
            borderRadius: 2,
            textAlign: 'center',
          }}
        >
          <Typography id="delete-confirmation-modal" variant="h6" component="h2" sx={{ mb: 2 }}>
            Are you sure you want to delete this task?
          </Typography>
          <Box sx={{ display: 'flex', justifyContent: 'space-around', mt: 3 }}>
            <Button
              variant="contained"
              onClick={() => setDeleteConfirmOpen(false)}
              sx={{ backgroundColor: '#E1DFE2', color: '#757575' }}
            >
              Cancel
            </Button>
            <Button
              variant="contained"
              onClick={() => deleteTask(taskToDelete.taskId)}
              sx={{ backgroundColor: '#E03E30', '&:hover': { backgroundColor: '#cc352a' } }}
            >
              Delete
            </Button>
          </Box>
        </Box>
      </Modal>
    </Box>
  );
}

export default Task;
