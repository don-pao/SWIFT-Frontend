import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Box, Typography, Button, Card, CardContent, CardActions, Chip, IconButton } from '@mui/material';
import ToDoFormModal from './ToDoFormModal';
import { Delete, Edit } from '@mui/icons-material';

function Body() {
  const [isModalOpen, setModalOpen] = useState(false);
  const [tasks, setTasks] = useState([]); // State to store the list of tasks
  const [selectedTask, setSelectedTask] = useState(null);

  const handleOpenModal = () => {
    setModalOpen(true);
  };

  const handleCloseModal = () => {
    setModalOpen(false);
    setSelectedTask(null);
  };

  const handleSaveToDo = (newTask) => {
    setTasks((prevTasks) => [...prevTasks, newTask].sort((a, b) => a.priority - b.priority)); // Sort tasks after adding new task
  };

  // Fetch tasks from the API when the component mounts
  useEffect(() => {
    const fetchTasks = async () => {
        try {
            const response = await axios.get('http://localhost:8080/api/task/getAllTasks');
            console.log("Fetched tasks:", response.data); // Log the response
            response.data.forEach(task => console.log("Task ID:", task.taskId)); // Log each task's ID for verification
            const sortedTasks = response.data.sort((a, b) => a.priority - b.priority);
            setTasks(sortedTasks);
        } catch (error) {
            console.error("Error fetching tasks:", error);
        }
    };
    fetchTasks();
}, []);

  // Function to delete a task
  const deleteTask = async (taskId) => {
    if (!taskId) {
        console.error("Error: taskId is undefined");
        return;
    }
    console.log(`Attempting to delete task with ID: ${taskId}`);
    try {
        const response = await axios.delete(`http://localhost:8080/api/task/deleteTaskDetails/${taskId}`);
        console.log(response.data); // Should display a success message from the backend
        setTasks((prevTasks) => prevTasks.filter((task) => task.taskId !== taskId)); // Use `task.taskId`
    } catch (error) {
        console.error("Error deleting task:", error.response ? error.response.data : error.message);
    }
};

  // Function to open modal for editing a task
  const handleEditTask = (task) => {
    setSelectedTask(task); // Set the task to be edited
    setModalOpen(true); // Open the modal
  };

  // Function to update the task in the backend and state
  const handleUpdateTask = async (updatedTask) => {
    try {
      const response = await axios.put(`http://localhost:8080/api/task/putTaskDetails?id=${updatedTask.taskId}`, updatedTask);
      const updatedTaskData = response.data;
      
      // Update the tasks state with the updated task data
      setTasks((prevTasks) =>
        prevTasks.map((task) => (task.taskId === updatedTaskData.taskId ? updatedTaskData : task)).sort((a, b) => a.priority - b.priority)
      );
      
      handleCloseModal(); // Close the modal
    } catch (error) {
      console.error("Error updating task:", error.response ? error.response.data : error.message);
    }
  };


  return (
    <Box
      display="flex"
      justifyContent="space-between"
      sx={{ padding: '20px', height: '100%', backgroundColor: '#f5f5f5' }}
    >
      {/* Left Box */}
      <Box sx={{ width: '30%', height: '100%' }}>
        <Typography variant="h5" sx={{ marginBottom: '10px', fontWeight: 'bold', color: '#34313A', textAlign: 'left' }}>
          Daily Quest
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
            Add a Daily Quest
          </Button>
        </Box>
      </Box>

      {/* Middle Box */}
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

      {/* Right Box */}
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
              marginBottom: '10px'
            }}
          >
            Add a To Do
          </Button>

          <ToDoFormModal
            open={isModalOpen}
            handleClose={handleCloseModal}
            handleSave={selectedTask ? handleUpdateTask : handleSaveToDo} // Save or update based on the selectedTask
            task={selectedTask} // Pass selected task to pre-fill in modal if editing
          />

          {/* Display list of tasks */}
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
                        backgroundColor: task.priority === 1 ? '#ff8a80' : task.priority === 2 ? '#ffcc80' : '#a5d6a7',
                        color: '#fff',
                        fontWeight: 'bold',
                      }}
                    />
                    <Typography variant="caption" sx={{ color: '#757575' }}>
                      Deadline: {task.deadline}
                    </Typography>
                  </Box>
                  <Typography variant="body2" sx={{ color: task.status ? '#4caf50' : '#f44336', fontWeight: 'bold' }}>
                    Status: {task.status ? 'Completed' : 'Pending'}
                  </Typography>
                </CardContent>
                <CardActions disableSpacing sx={{ display: 'flex', justifyContent: 'flex-end' }}>
                <IconButton aria-label="edit task" onClick={() => handleEditTask(task)}>
                    <Edit fontSize="small" />
                  </IconButton>
                  <IconButton aria-label="delete task" onClick={() => {
                    console.log("Deleting task with ID:", task.taskId); // Use `task.taskId` as the ID
                    deleteTask(task.taskId);
                  }}>
                    <Delete fontSize="small" />
                  </IconButton>
                </CardActions>
              </Card>
            ))}
          </Box>
        </Box>
      </Box>
    </Box>
  );
}

export default Body;
