  import React, { useState, useEffect } from 'react';
  import axios from 'axios';
  import ResponsiveAppBar from '../../component/Appbar';
  import AvatarTheme from '../../component/Theme';

  const FlashcardForm = () => {
    const [term, setTerm] = useState('');
    const [definition, setDefinition] = useState('');
    const [flashcards, setFlashcards] = useState([]);
    const [currentFlashcardId, setCurrentFlashcardId] = useState(null);

    const fetchFlashcards = async () => {
      try {
        const response = await axios.get('http://localhost:8080/api/flashcard/getAllFlashcards');
        setFlashcards(response.data);
      } catch (error) {
        console.error('Error fetching flashcards:', error);
      }
    };

    useEffect(() => {
      fetchFlashcards();
    }, []);

    const handleSubmit = async (e) => {
      e.preventDefault();
      const newFlashcard = { term, definition };

      if (!term || !definition) {
        console.error('Both term and definition are required');
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
      setCurrentFlashcardId(null);
    };

    const handleEditFlashcard = (flashcard) => {
      setTerm(flashcard.term);
      setDefinition(flashcard.definition);
      setCurrentFlashcardId(flashcard.flashcardId || flashcard.id);
    };

    const handleDeleteFlashcard = async (id) => {
      const confirmDelete = window.confirm("Are you sure you want to delete this flashcard?");
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
      <><ResponsiveAppBar /><AvatarTheme /><div style={styles.container}>
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

            .term, .definition {
              flex: 1;
              font-size: 0.9rem;
              color: #333;
            }

            .term strong, .definition strong {
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
          <button type="submit" className="submit-button">
            {currentFlashcardId ? 'Update Flashcard' : 'Submit Flashcard'}
          </button>
        </form>

        <div className="flashcard-header" style={{ marginTop: '20px' }}>Flashcards</div>
        <div className="flashcard-list">
          {flashcards.map((flashcard) => (
            <div key={flashcard.flashcardId || flashcard.id} className="flashcard-item">
              <div className="term">
                <strong>Term:</strong> {flashcard.term}
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
      </div></>
    );
  };

  const styles = {
    container: {
      width: '80%',
      margin: '20px auto',
      color: '#333',
    },
  };

  export default FlashcardForm;
