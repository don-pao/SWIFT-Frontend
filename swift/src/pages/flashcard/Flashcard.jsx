import React, { useState, useEffect } from 'react';
import axios from 'axios';
import ResponsiveAppBar from '../../component/Appbar';
import AvatarTheme from '../../component/Theme';
import './Flashcard.css'; 
import { useParams } from 'react-router-dom';
import { Modal, Button, Typography, Box } from '@mui/material'; 

const FlashcardForm = () => {
  const { setId } = useParams(); 
  const [term, setTerm] = useState('');
  const [definition, setDefinition] = useState('');
  const [flashcards, setFlashcards] = useState([]);
  const [currentFlashcardId, setCurrentFlashcardId] = useState(null);
  const [flashcardSetId, setFlashcardSetId] = useState(setId); 

  const [openEditModal, setOpenEditModal] = useState(false); 
  const [selectedFlashcard, setSelectedFlashcard] = useState(null); 

  const [openDeleteModal, setOpenDeleteModal] = useState(false); 
  const [selectedFlashcardToDelete, setSelectedFlashcardToDelete] = useState(null); 

  useEffect(() => {
    if (setId) {
      setFlashcardSetId(setId);
    }
  }, [setId]);

  const fetchFlashcards = async () => {
    try {
      const response = await axios.get(`http://localhost:8080/api/flashcard/getFlashcardsBySetId/${setId}`);
      setFlashcards(response.data);
    } catch (error) {
      console.error('Error fetching flashcards for setId ' + setId + ':', error);
    }
  };

  useEffect(() => {
    if (setId) {
      fetchFlashcards(); 
    }
  }, [setId]); 

  const handleSubmit = async (e) => {
    e.preventDefault();
    const newFlashcard = { term, definition, flashcardSet: { setId } };
  
    if (!term || !definition) {
      console.error('All fields are required');
      return;
    }
  
    try {
      if (currentFlashcardId) {
        await axios.put(`http://localhost:8080/api/flashcard/putFlashcardsDetails/${currentFlashcardId}`, newFlashcard);
      } else {
        await axios.post('http://localhost:8080/api/flashcard/postflashcardrecord', newFlashcard);
      }
      fetchFlashcards(); 
      resetForm(); 
    } catch (error) {
      console.error('Error submitting flashcard:', error);
    }
  };

  const resetForm = () => {
    setTerm('');
    setDefinition('');
    setFlashcardSetId(null);
    setCurrentFlashcardId(null);
  };

  const handleEditFlashcard = (flashcard) => {
    setSelectedFlashcard(flashcard);
    setOpenEditModal(true); 
  };

  const handleConfirmEdit = () => {
    setTerm(selectedFlashcard.term);
    setDefinition(selectedFlashcard.definition);
    setFlashcardSetId(selectedFlashcard.flashcardSetId);
    setCurrentFlashcardId(selectedFlashcard.flashcardId || selectedFlashcard.id);
    setOpenEditModal(false); 
  };

  const handleDeleteFlashcard = async () => {
    try {
      await axios.delete(`http://localhost:8080/api/flashcard/deleteFlashcardDetails/${selectedFlashcardToDelete.flashcardId || selectedFlashcardToDelete.id}`);
      fetchFlashcards(); 
      setOpenDeleteModal(false); 
    } catch (error) {
      console.error('Error deleting flashcard:', error);
    }
  };

  const handleOpenDeleteModal = (flashcard) => {
    setSelectedFlashcardToDelete(flashcard);
    setOpenDeleteModal(true); 
  };

  return (
    <>
      <ResponsiveAppBar />
      <AvatarTheme />
      <div style={styles.container}>
        <div className="flashcard-header">Add a Flashcard</div>
        <form onSubmit={handleSubmit} className="flashcard-form">
          <div className="flashcard-input-container">
            <label>Term:</label>
            <input
              type="text"
              value={term}
              onChange={(e) => setTerm(e.target.value)}
              placeholder="Enter term"
              required
            />
          </div>
          <div className="flashcard-input-container">
            <label>Definition:</label>
            <input
              type="text"
              value={definition}
              onChange={(e) => setDefinition(e.target.value)}
              placeholder="Enter definition"
              required
            />
          </div>

          {/* Hidden input for flashcardSetId */}
          <input type="hidden" value={flashcardSetId} />

          <button type="submit" className="submit-button">
            {currentFlashcardId ? 'Update Flashcard' : 'Submit Flashcard'}
          </button>
          {currentFlashcardId && (
            <button type="button" className="cancel-button" onClick={resetForm}>
              Cancel
            </button>
          )}
        </form>

        <div className="flashcard-header" style={{ marginTop: '20px' }}>Flashcards</div>
        <div className="flashcard-list">
          {flashcards.map((flashcard) => (
            <div key={flashcard.flashcardId || flashcard.id} className="flashcard-item">
              <div className="term">
                <strong>Term:</strong> {flashcard.term}
              </div>
              <div className="flashcard-set-title">
                <strong>Flashcard Set:</strong> {flashcard.flashcardSet?.title || "No Set Title"}
              </div>
              <div className="definition">
                <strong>Definition:</strong> {flashcard.definition}
              </div>
              <div className="flashcard-actions">
                <button onClick={() => handleEditFlashcard(flashcard)}>Edit</button>
                <button onClick={() => handleOpenDeleteModal(flashcard)}>Delete</button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Edit Modal */}
      <Modal
        open={openEditModal}
        onClose={() => setOpenEditModal(false)}
        aria-labelledby="edit-flashcard-modal"
        aria-describedby="edit-flashcard-description"
      >
        <Box sx={modalStyle}>
          <Typography variant="h6" component="h2">
            Confirm Edit Flashcard
          </Typography>
          <Typography sx={{ mt: 2 }}>
            Are you sure you want to edit this flashcard?
          </Typography>
          <div style={{ marginTop: '20px' }}>
            <Button variant="contained" color="primary" onClick={handleConfirmEdit}>Confirm</Button>
            <Button variant="outlined" color="secondary" onClick={() => setOpenEditModal(false)} sx={{ marginLeft: '10px' }}>Cancel</Button>
          </div>
        </Box>
      </Modal>

      {/* Delete Modal */}
      <Modal
        open={openDeleteModal}
        onClose={() => setOpenDeleteModal(false)}
        aria-labelledby="delete-flashcard-modal"
        aria-describedby="delete-flashcard-description"
      >
        <Box sx={modalStyle}>
          <Typography variant="h6" component="h2">
            Confirm Delete Flashcard
          </Typography>
          <Typography sx={{ mt: 2 }}>
            Are you sure you want to delete this flashcard?
          </Typography>
          <div style={{ marginTop: '20px' }}>
            <Button variant="contained" color="error" onClick={handleDeleteFlashcard}>Delete</Button>
            <Button variant="outlined" color="secondary" onClick={() => setOpenDeleteModal(false)} sx={{ marginLeft: '10px' }}>Cancel</Button>
          </div>
        </Box>
      </Modal>
    </>
  );
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

const styles = {
  container: {
    width: '80%',
    margin: '20px auto',
    padding: '10px',
    borderRadius: '10px',
    border: '1px solid #ccc',
  },
};

export default FlashcardForm;
