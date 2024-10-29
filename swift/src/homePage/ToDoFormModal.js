import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Modal, Box, Typography, TextField, Button, FormControlLabel, Checkbox } from '@mui/material';

function ToDoFormModal({ open, handleClose, handleSave, task }) {
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    deadline: '',
    priority: '',
    status: false,
  });

  // Populate form fields if `task` is provided (for editing)
  useEffect(() => {
    if (task) {
      setFormData({
        title: task.title || '',
        description: task.description || '',
        deadline: task.deadline || '',
        priority: task.priority || '',
        status: task.status || false,
        taskId: task.taskId || null, // Include taskId for PUT requests
      });
    } else {
      // Clear fields if creating a new task
      setFormData({
        title: '',
        description: '',
        deadline: '',
        priority: '',
        status: false,
      });
    }
  }, [task]);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData({
      ...formData,
      [name]: type === 'checkbox' ? checked : value,
    });
  };

  const handleSubmit = async () => {
    try {
      if (formData.taskId) {
        // Update existing task
        const response = await axios.put(`http://localhost:8080/api/task/putTaskDetails?id=${formData.taskId}`, formData, {
          headers: {
            'Content-Type': 'application/json',
          },
        });
        console.log("Updated Task:", response.data);
        handleSave(response.data); // Pass updated task to parent
      } else {
        // Create a new task
        const response = await axios.post('http://localhost:8080/api/task/posttaskrecord', formData, {
          headers: {
            'Content-Type': 'application/json',
          },
        });
        console.log("Saved New Task:", response.data);
        handleSave(response.data); // Pass new task to parent
      }
      handleClose(); // Close the modal
    } catch (error) {
      console.error("Error saving task:", error);
    }
  };

  return (
    <Modal open={open} onClose={handleClose} aria-labelledby="add-todo-modal" aria-describedby="add-todo-description">
      <Box
        sx={{
          position: 'absolute',
          top: '50%',
          left: '50%',
          transform: 'translate(-50%, -50%)',
          width: 400,
          bgcolor: 'background.paper',
          boxShadow: 24,
          p: 4,
          borderRadius: 2,
        }}
      >
        <Typography id="add-todo-modal" variant="h6" component="h2" sx={{ mb: 2 }}>
          {formData.taskId ? 'Edit To-Do' : 'Add New To-Do'}
        </Typography>
        <TextField
          label="Title"
          name="title"
          value={formData.title}
          onChange={handleChange}
          fullWidth
          margin="normal"
        />
        <TextField
          label="Description"
          name="description"
          value={formData.description}
          onChange={handleChange}
          fullWidth
          margin="normal"
        />
        <TextField
          label="Deadline"
          name="deadline"
          type="date"
          value={formData.deadline}
          onChange={handleChange}
          fullWidth
          margin="normal"
          InputLabelProps={{ shrink: true }}
        />
        <TextField
          label="Priority"
          name="priority"
          type="number"
          value={formData.priority}
          onChange={handleChange}
          fullWidth
          margin="normal"
        />
        <FormControlLabel
          control={
            <Checkbox
              checked={formData.status}
              onChange={handleChange}
              name="status"
            />
          }
          label="Completed"
        />
        <Box sx={{ mt: 3, display: 'flex', justifyContent: 'space-between' }}>
          <Button variant="contained" color="secondary" onClick={handleClose}>
            Cancel
          </Button>
          <Button variant="contained" color="primary" onClick={handleSubmit}>
            Save
          </Button>
        </Box>
      </Box>
    </Modal>
  );
}

export default ToDoFormModal;
