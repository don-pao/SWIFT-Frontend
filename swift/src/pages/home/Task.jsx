import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Box, Typography, Button, Card, CardContent, Chip, IconButton, Modal } from '@mui/material';
import ToDoFormModal from './ToDoFormModal';
import { Delete, Edit } from '@mui/icons-material';

function Task() {
  const [isModalOpen, setModalOpen] = useState(false);
  const [tasks, setTasks] = useState([]);
  const [selectedTask, setSelectedTask] = useState(null);
  const [deleteConfirmOpen, setDeleteConfirmOpen] = useState(false);
  const [taskToDelete, setTaskToDelete] = useState(null);

  const handleOpenModal = () => {
    setSelectedTask(null);
    setModalOpen(true);
  };

  const handleCloseModal = () => {
    setModalOpen(false);
    setSelectedTask(null);
  };

  const handleSaveToDo = (newTask) => {
    setTasks((prevTasks) => [...prevTasks, newTask].sort((a, b) => a.priority - b.priority));
  };

  useEffect(() => {
    const fetchTasks = async () => {
      try {
        const response = await axios.get('http://localhost:8080/api/task/getAllTasks');
        const sortedTasks = response.data.sort((a, b) => a.priority - b.priority);
        setTasks(sortedTasks);
      } catch (error) {
        console.error("Error fetching tasks:", error);
      }
    };
    fetchTasks();
  }, []);

  const deleteTask = async (taskId) => {
    try {
      await axios.delete(`http://localhost:8080/api/task/deleteTaskDetails/${taskId}`);
      setTasks((prevTasks) => prevTasks.filter((task) => task.taskId !== taskId));
      setDeleteConfirmOpen(false); // Close the confirmation modal
    } catch (error) {
      console.error("Error deleting task:", error);
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

  const handleUpdateTask = async (updatedTask) => {
    try {
      const response = await axios.put(`http://localhost:8080/api/task/putTaskDetails?id=${updatedTask.taskId}`, updatedTask);
      const updatedTaskData = response.data;
      setTasks((prevTasks) =>
        prevTasks.map((task) => (task.taskId === updatedTaskData.taskId ? updatedTaskData : task)).sort((a, b) => a.priority - b.priority)
      );
      handleCloseModal();
    } catch (error) {
      console.error("Error updating task:", error);
    }
  };

  return (
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
                <Box display="flex" justifyContent="space-between" alignItems="center">
                  <Typography variant="h6" sx={{ fontWeight: 'bold', color: '#333' }}>
                    {task.title}
                  </Typography>
                  <Chip
                    label={`Priority: ${task.priority}`}
                    size="small"
                    sx={{
                      backgroundColor: task.priority === 1 ? '#E96559' : task.priority === 2 ? '#ffcc80' : '#a5d6a7',
                      color: '#fff',
                      fontWeight: 'bold',
                    }}
                  />
                </Box>

                <Typography variant="body2" sx={{ color: '#555', marginTop: '8px', fontSize: '1rem' }}>
                  {task.description}
                </Typography>

                <Typography variant="caption" sx={{ color: '#757575', marginTop: '8px' }}>
                  Deadline: {task.deadline}
                </Typography>

                <Box display="flex" alignItems="center" justifyContent="space-between" sx={{ marginTop: '8px' }}>
                  <Typography variant="body2" sx={{ color: task.status ? '#4caf50' : '#f44336', fontWeight: 'bold' }}>
                    Status: {task.status ? 'Completed' : 'Pending'}
                  </Typography>
                  <Box>
                    <IconButton aria-label="edit task" onClick={() => handleEditTask(task)} sx={{ color: '#216ECC', marginRight: 1 }}>
                      <Edit fontSize="small" />
                    </IconButton>
                    <IconButton aria-label="delete task" onClick={() => openDeleteConfirm(task)} sx={{ color: '#E03E30' }}>
                      <Delete fontSize="small" />
                    </IconButton>
                  </Box>
                </Box>
              </CardContent>
            </Card>
          ))}
        </Box>
      </Box>

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
            <Button variant="contained" onClick={() => setDeleteConfirmOpen(false)} sx={{ backgroundColor: '#E1DFE2', color: '#757575' }}>
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
