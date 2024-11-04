import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import ResponsiveAppBar from '../../component/Appbar';
import AvatarTheme from '../../component/Theme';
const FlashcardSetForm = () => {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [flashcardSets, setFlashcardSets] = useState([]);
  const [currentSetId, setCurrentSetId] = useState(null);
  const navigate = useNavigate();

  const fetchFlashcardSets = async () => {
    try {
      const response = await axios.get('http://localhost:8080/api/flashcardset/getAllFlashcardSet');
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
    const newFlashcardSet = { title, description };

    if (!title || !description) {
      console.error('Both title and description are required');
      return;
    }

    try {
      if (currentSetId) {
        await axios.put(`http://localhost:8080/api/flashcardset/putFlashcardSetDetails/${currentSetId}`, newFlashcardSet);
      } else {
        await axios.post('http://localhost:8080/api/flashcardset/postflashcardsetrecord', newFlashcardSet);
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
    setTitle(flashcardSet.title);
    setDescription(flashcardSet.description);
    setCurrentSetId(flashcardSet.setId);
  };

  const handleDeleteFlashcardSet = async (id) => {
    const confirmDelete = window.confirm("Are you sure you want to delete this flashcard set?");
    if (!confirmDelete) return;

    try {
      await axios.delete(`http://localhost:8080/api/flashcardset/deleteFlashcardSetDetails/${id}`);
      fetchFlashcardSets();
    } catch (error) {
      console.error('Error deleting flashcard set:', error);
    }
  };

  const handleAddFlashcard = (setId) => {
    console.log(`Adding a flashcard to set with ID: ${setId}`);
    navigate(`/flashcard-form/${setId}`);
  };

  const handleAddQuiz = (setId) => {
    console.log(`Adding a quiz to set with ID: ${setId}`);
    navigate(`/quiz-form/${setId}`);
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
            .flashcard-input-container input {
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
            .title, .description {
              flex: 1;
              font-size: 0.9rem;
              color: #333;
            }
            .title strong, .description strong {
              display: block;
              font-weight: bold;
              color: #666;
            }
          `}
        </style>

        <div className="flashcard-header">Add a Flashcard Set</div>
        <form onSubmit={handleSubmit} className="flashcard-form">
          <div className="flashcard-input-container">
            <label>Title:</label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Enter title"
              required />
          </div>
          <div className="flashcard-input-container">
            <label>Description:</label>
            <input
              type="text"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Enter description"
              required />
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

export default FlashcardSetForm;
