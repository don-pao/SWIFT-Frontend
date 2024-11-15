import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import ResponsiveAppBar from '../../component/Appbar';
import AvatarTheme from '../../component/Theme';
import { Modal, Box, Typography, Button } from '@mui/material';
import './FlashcardSetForm.css'; // Import the CSS

const FlashcardSetForm = () => {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [flashcardSets, setFlashcardSets] = useState([]);
  const [currentSetId, setCurrentSetId] = useState(null);
  const [openEditModal, setOpenEditModal] = useState(false);
  const [openDeleteModal, setOpenDeleteModal] = useState(false);
  const [selectedSet, setSelectedSet] = useState(null);
  const navigate = useNavigate();

  const fetchFlashcardSets = async () => {
    try {
      // Retrieve the userID from localStorage or wherever it's stored
      const userID = localStorage.getItem('userID');
      if (!userID) {
        console.error('User ID is required');
        return;
      }
  
      const response = await axios.get(`http://localhost:8080/api/flashcardset/getFlashcardSetsByUser?userID=${userID}`);
      setFlashcardSets(response.data);
    } catch (error) {
      console.error('Error fetching flashcard sets:', error);
    }
  };
  
  useEffect(() => {
    fetchFlashcardSets();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    console.log('Submit button clicked');
    // Retrieve the userID (assuming it's stored in localStorage after login)
    const userID = localStorage.getItem('userID'); // or any other method you use to store the user ID
    
    if (!userID) {
      console.error('User ID is required');
      return;
    }
  
    const newFlashcardSet = { title, description, userID }; // Now that userID is available, add it to the object
  
    if (!title || !description) {
      console.error('Both title and description are required');
      return;
    }

     // Log the values before making the request
     console.log('Submitting Flashcard Set:', newFlashcardSet);
     console.log('User ID:', userID);
     console.log('Request URL:', currentSetId 
         ? `http://localhost:8080/api/flashcardset/putFlashcardSetDetails/${currentSetId}?userID=${userID}`
         : `http://localhost:8080/api/flashcardset/postflashcardsetrecord?userID=${userID}`);
     
    try {
      if (currentSetId) {
        // Update flashcard set (if currentSetId exists)
        await axios.put(`http://localhost:8080/api/flashcardset/putFlashcardSetDetails/${currentSetId}?userID=${userID}`, newFlashcardSet);
      } else {
        // Create a new flashcard set (pass userID as query parameter)
        await axios.post(`http://localhost:8080/api/flashcardset/postflashcardsetrecord?userID=${userID}`, newFlashcardSet);
      }
      fetchFlashcardSets();
      resetForm();
    } catch (error) {
      console.error('Error submitting flashcard set:', error);
    }
  };
  

  const resetForm = () => {
    setTitle('');
    setDescription('');
    setCurrentSetId(null);
  };

  const handleEditFlashcardSet = (flashcardSet) => {
    setSelectedSet(flashcardSet);
    setOpenEditModal(true);
  };

  const handleDeleteFlashcardSet = (setId) => {
    setSelectedSet(setId);
    setOpenDeleteModal(true);
  };

  const handleConfirmEdit = () => {
    if (selectedSet) {
      setTitle(selectedSet.title);
      setDescription(selectedSet.description);
      setCurrentSetId(selectedSet.setId);
      setOpenEditModal(false);
    }
  };

  const handleConfirmDelete = async () => {
    if (selectedSet) {
      try {
        await axios.delete(`http://localhost:8080/api/flashcardset/deleteFlashcardSetDetails/${selectedSet}`);
        fetchFlashcardSets();
      } catch (error) {
        console.error('Error deleting flashcard set:', error);
      }
      setOpenDeleteModal(false);
    }
  };

  const handleCancelEditModal = () => setOpenEditModal(false);
  const handleCancelDeleteModal = () => setOpenDeleteModal(false);

  const handleAddFlashcard = (setId) => {
    navigate(`/flashcard-form/${setId}`);
  };

  const handleAddQuiz = (setId) => {
    navigate(`/quiz-form/${setId}`);
  };

  return (
    <>
      <ResponsiveAppBar />
      <AvatarTheme />
      <div style={styles.container}>
        <div className="flashcard-header">Add a Flashcard Set</div>
        <form onSubmit={handleSubmit} className="flashcard-form">
          <div className="flashcard-input-container">
            <label>Title:</label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Enter title"
              required
            />
          </div>
          <div className="flashcard-input-container">
            <label>Description:</label>
            <input
              type="text"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Enter description"
              required
            />
          </div>
          <button type="submit" className="submit-button">
            {currentSetId ? 'Update Flashcard Set' : 'Submit Flashcard Set'}
          </button>
        </form>

        <div className="flashcard-header" style={{ marginTop: '20px' }}>Flashcard Sets</div>
        <div className="flashcard-list">
          {flashcardSets.map((flashcardSet) => (
            <div key={flashcardSet.setId} className="flashcard-item">
              <div className="title">
                <strong>Title:</strong> {flashcardSet.title}
              </div>
              <div className="description">
                <strong>Description:</strong> {flashcardSet.description}
              </div>
              <div className="flashcard-actions">
                <button onClick={() => handleEditFlashcardSet(flashcardSet)}>Edit</button>
                <button onClick={() => handleDeleteFlashcardSet(flashcardSet.setId)}>Delete</button>
                <button onClick={() => handleAddFlashcard(flashcardSet.setId)}>Add A Flashcard</button>
                <button onClick={() => handleAddQuiz(flashcardSet.setId)}>Add A Quiz</button>
              </div>
            </div>
          ))}
        </div>

        {/* Edit Modal */}
        <Modal
          open={openEditModal}
          onClose={handleCancelEditModal}
          aria-labelledby="edit-modal-title"
          aria-describedby="edit-modal-description"
        >
          <Box sx={modalStyle}>
            <Typography variant="h6">Confirm Edit</Typography>
            <Typography sx={{ mt: 2 }}>Are you sure you want to edit this flashcard set?</Typography>
            <div style={{ marginTop: '20px' }}>
              <Button variant="contained" color="primary" onClick={handleConfirmEdit}>
                Confirm
              </Button>
              <Button variant="outlined" color="secondary" onClick={handleCancelEditModal} sx={{ ml: 2 }}>
                Cancel
              </Button>
            </div>
          </Box>
        </Modal>

        {/* Delete Modal */}
        <Modal
          open={openDeleteModal}
          onClose={handleCancelDeleteModal}
          aria-labelledby="delete-modal-title"
          aria-describedby="delete-modal-description"
        >
          <Box sx={modalStyle}>
            <Typography variant="h6">Confirm Delete</Typography>
            <Typography sx={{ mt: 2 }}>Are you sure you want to delete this flashcard set?</Typography>
            <div style={{ marginTop: '20px' }}>
              <Button variant="contained" color="error" onClick={handleConfirmDelete}>
                Delete
              </Button>
              <Button variant="outlined" color="secondary" onClick={handleCancelDeleteModal} sx={{ ml: 2 }}>
                Cancel
              </Button>
            </div>
          </Box>
        </Modal>
      </div>
    </>
  );
};

const styles = {
  container: {
    width: '80%',
    margin: '20px auto',
    color: '#333',
  },
};

const modalStyle = {
  position: 'absolute',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  backgroundColor: 'white',
  padding: '20px',
  borderRadius: '8px',
  boxShadow: 24,
};

export default FlashcardSetForm;
