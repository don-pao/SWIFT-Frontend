import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Modal, Box, Typography, TextField, Button, RadioGroup, FormControlLabel, Radio, FormControl, FormHelperText } from '@mui/material';

function ToDoFormModal({ open, handleClose, handleSave, task }) {
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    deadline: '',
    priority: '',
    status: false, // Default status is false
  });

  const [errors, setErrors] = useState({});

  // Get today's date in 'YYYY-MM-DD' format
  const today = new Date().toISOString().split("T")[0];

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
      setFormData({
        title: '',
        description: '',
        deadline: '',
        priority: '',
        status: false, // Ensure default status is false for new tasks
      });
      setErrors({}); // Reset errors when creating a new task
    }
  }, [task, open]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const validateFields = () => {
    const newErrors = {};
    if (!formData.title.trim()) newErrors.title = 'Title is required';
    if (!formData.description.trim()) newErrors.description = 'Description is required';
    if (!formData.deadline) newErrors.deadline = 'Deadline is required';
    if (!formData.priority) newErrors.priority = 'Priority is required';
    return newErrors;
  };

  const handleSubmit = async () => {
    const validationErrors = validateFields();
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }

    try {
      if (formData.taskId) {
        const response = await axios.put(`http://localhost:8080/api/task/putTaskDetails?id=${formData.taskId}`, formData, {
          headers: {
            'Content-Type': 'application/json',
          },
        });
        console.log("Updated Task:", response.data);
        handleSave(response.data);
      } else {
        const response = await axios.post('http://localhost:8080/api/task/posttaskrecord', formData, {
          headers: {
            'Content-Type': 'application/json',
          },
        });
        console.log("Saved New Task:", response.data);
        handleSave(response.data);
      }
      handleClose();
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
          error={!!errors.title}
          helperText={errors.title}
        />
        <TextField
          label="Description"
          name="description"
          value={formData.description}
          onChange={handleChange}
          fullWidth
          margin="normal"
          error={!!errors.description}
          helperText={errors.description}
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
          inputProps={{ min: today }}
          error={!!errors.deadline}
          helperText={errors.deadline}
        />
        <FormControl component="fieldset" fullWidth margin="normal" error={!!errors.priority}>
          <Typography>Priority Level</Typography>
          <RadioGroup
            row
            name="priority"
            value={formData.priority}
            onChange={handleChange}
          >
            <FormControlLabel value="1" control={<Radio />} label="High" />
            <FormControlLabel value="2" control={<Radio />} label="Mid" />
            <FormControlLabel value="3" control={<Radio />} label="Low" />
          </RadioGroup>
          <FormHelperText>{errors.priority}</FormHelperText>
        </FormControl>
        <Box sx={{ mt: 3, display: 'flex', justifyContent: 'space-between' }}>
          <Button
            variant="contained"
            onClick={handleClose}
            sx={{ backgroundColor: '#E03E30', '&:hover': { backgroundColor: '#cc352a' } }}
          >
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
