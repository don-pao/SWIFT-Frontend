import React, { useState, useEffect } from 'react';
import axios from 'axios';
import ResponsiveAppBar from '../../component/Appbar';
import AvatarTheme from '../../component/Theme';

const FlashcardForm = () => {
  const [term, setTerm] = useState('');
  const [definition, setDefinition] = useState('');
  const [flashcards, setFlashcards] = useState([]);
  const [currentFlashcardId, setCurrentFlashcardId] = useState(null);
  const [flashcardSetId, setFlashcardSetId] = useState(null); // To store selected FlashcardSet ID
  const [flashcardSets, setFlashcardSets] = useState([]); // To store list of FlashcardSets

  // Fetch all flashcards
  const fetchFlashcards = async () => {
    try {
      const response = await axios.get('http://localhost:8080/api/flashcard/getAllFlashcards');
      setFlashcards(response.data);
    } catch (error) {
      console.error('Error fetching flashcards:', error);
    }
  };

  // Fetch all flashcard sets
  const fetchFlashcardSets = async () => {
    try {
      const response = await axios.get('http://localhost:8080/api/flashcardset/getAllFlashcardSet');
      setFlashcardSets(response.data);
    } catch (error) {
      console.error('Error fetching flashcard sets:', error);
    }
  };

  useEffect(() => {
    fetchFlashcardSets(); // Fetch flashcard sets on mount
    fetchFlashcards(); // Fetch flashcards on mount
  }, []);

  // Handle form submission (create or update flashcard)
  const handleSubmit = async (e) => {
    e.preventDefault();
    const newFlashcard = { term, definition, flashcardSet: { setId: flashcardSetId } };

    if (!term || !definition || !flashcardSetId) {
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

  // Reset form
  const resetForm = () => {
    setTerm('');
    setDefinition('');
    setFlashcardSetId(null);
    setCurrentFlashcardId(null);
  };

  // Handle editing flashcard
  const handleEditFlashcard = (flashcard) => {
    const confirmEdit = window.confirm('Are you sure you want to edit this flashcard?');
    if (confirmEdit) {
      setTerm(flashcard.term);
      setDefinition(flashcard.definition);
      setFlashcardSetId(flashcard.flashcardSetId); // Set the flashcard set ID when editing
      setCurrentFlashcardId(flashcard.flashcardId || flashcard.id);
    }
  };

  // Handle deleting flashcard
  const handleDeleteFlashcard = async (id) => {
    const confirmDelete = window.confirm('Are you sure you want to delete this flashcard?');
    if (confirmDelete) {
      try {
        await axios.delete(`http://localhost:8080/api/flashcard/deleteFlashcardDetails/${id}`);
        fetchFlashcards();
      } catch (error) {
        console.error('Error deleting flashcard:', error);
      }
    }
  };

  return (
    <>
      <ResponsiveAppBar />
      <AvatarTheme />
      <div style={styles.container}>
        <style>
          {`
            .flashcard-header {
              display: flex;
              justify-content: space-between;
              align-items: center;
              background-color: #f4f4f4;
              border-radius: 8px;
              padding: 10px 20px;
              font-size: 1.2rem;
              color: #555;
              font-weight: bold;
            }

            .flashcard-form {
              background-color: #f9f9f9;
              padding: 20px;
              border-radius: 10px;
              box-shadow: 0px 4px 8px rgba(0, 0, 0, 0.1);
            }

            .flashcard-input-container {
              display: flex;
              flex-direction: column;
              margin-bottom: 15px;
            }

            .flashcard-input-container label {
              font-size: 0.9rem;
              color: #333;
              margin-bottom: 5px;
            }

            .flashcard-input-container input, .flashcard-input-container select{
              padding: 10px;
              border: 1px solid #ccc;
              border-radius: 5px;
              font-size: 0.9rem;
            }

            .submit-button {
              background-color: #4caf50;
              color: #fff;
              padding: 10px;
              border: none;
              border-radius: 5px;
              cursor: pointer;
              font-size: 1rem;
            }

            .cancel-button {
              background-color: #f44336;
              color: #fff;
              padding: 10px;
              border: none;
              border-radius: 5px;
              cursor: pointer;
              font-size: 1rem;
              margin-left: 10px;
            }

            .flashcard-list {
              margin-top: 20px;
            }

            .flashcard-item {
              background-color: #fff;
              padding: 15px;
              margin-bottom: 10px;
              border-radius: 8px;
              box-shadow: 0px 2px 4px rgba(0, 0, 0, 0.1);
              display: flex;
              justify-content: space-between;
              align-items: center;
            }

            .flashcard-actions {
              display: flex;
              gap: 10px;
            }

            .flashcard-actions button {
              background: none;
              border: none;
              color: #4caf50;
              font-size: 0.9rem;
              cursor: pointer;
            }

            .flashcard-actions button:hover {
              text-decoration: underline;
            }

            .term, .definition, .flashcard-set-title {
              flex: 1;
              font-size: 0.9rem;
              color: #333;
            }

            .term strong, .definition strong, flashcard-set-title strong {
              display: block;
              font-weight: bold;
              color: #666;
            }
          `}
        </style>

        <div className="flashcard-header">Add a Flashcard</div>
        <form onSubmit={handleSubmit} className="flashcard-form">
          <div className="flashcard-input-container">
            <label>Term:</label>
            <input
              type="text"
              value={term}
              onChange={(e) => setTerm(e.target.value)}
              placeholder="Enter term"
              required />
          </div>
          <div className="flashcard-input-container">
            <label>Definition:</label>
            <input
              type="text"
              value={definition}
              onChange={(e) => setDefinition(e.target.value)}
              placeholder="Enter definition"
              required />
          </div>
          <div className="flashcard-input-container">
            <label>Flashcard Set:</label>
            <select
              value={flashcardSetId}
              onChange={(e) => setFlashcardSetId(e.target.value)}
              required
            >
              <option value="">Select Flashcard Set</option>
              {flashcardSets.map((set) => (
                <option key={set.setId} value={set.setId}>
                  {set.title}
                </option>
              ))}
            </select>
          </div>
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
      {/* Displaying the Flashcard Set title */}
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
        <button onClick={() => handleDeleteFlashcard(flashcard.flashcardId || flashcard.id)}>Delete</button>
      </div>
    </div>
  ))}
</div>

      </div>
    </>
  );
};

const styles = {
  container: {
    padding: '20px',
    fontFamily: 'Arial, sans-serif',
    backgroundColor: '#f9f9f9',
    minHeight: '100vh',
  },
};

export default FlashcardForm;
