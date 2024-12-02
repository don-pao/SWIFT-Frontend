import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { Button, Typography } from '@mui/material';
import './FlashcardReview.css'; // Import the custom styles
import ResponsiveAppBar from '../../component/Appbar';
import AvatarTheme from '../../component/Theme';

const FlashcardReview = () => {
  const { setId } = useParams();  // Get the setId from the URL
  const [flashcards, setFlashcards] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [showTerm, setShowTerm] = useState(false);  // Set this to false to show definition first
  
  // Create a navigate function to navigate back
  const navigate = useNavigate();

  // Fetch the flashcards and set title
  useEffect(() => {
    const fetchFlashcards = async () => {
      try {
        const response = await axios.get(`http://localhost:8080/api/flashcard/getFlashcardsBySetId/${setId}`);
        setFlashcards(response.data);
      } catch (error) {
        console.error('Error fetching flashcards:', error);
      }
    };
    fetchFlashcards();
  }, [setId]);

  const handleNext = () => {
    setCurrentIndex((prevIndex) => (prevIndex + 1) % flashcards.length);
  };

  const handlePrevious = () => {
    setCurrentIndex((prevIndex) => (prevIndex - 1 + flashcards.length) % flashcards.length);
  };

  const toggleTermDefinition = () => {
    setShowTerm(!showTerm);  // Toggle between term and definition
  };

  // Display loading message if flashcards are not fetched yet
  if (flashcards.length === 0) {
    return <Typography variant="h5">Loading flashcards...</Typography>;
  }

  const currentFlashcard = flashcards[currentIndex];

  return (
    <>
      <ResponsiveAppBar />
      <AvatarTheme />
      <div className="review-container">
        {/* Back Button */}
        <Button 
          onClick={() => navigate('/flashcard-set-form')}  // Replace with the correct route
          className="nav-button"
        >
          Return
        </Button>
        
        <div className="flashcard-box">
          <div className="flashcard-term-definition">
            <Typography variant="h6">
              {showTerm ? 'Term' : 'Definition'}
            </Typography>
          </div>

          <Typography variant="h4" className="flashcard-content">
            {showTerm ? currentFlashcard.term : currentFlashcard.definition}
          </Typography>
        </div>

        <div className="controls">
          <Button onClick={handlePrevious} variant="contained" color="primary" className="nav-button">
            Previous
          </Button>

          <Button onClick={toggleTermDefinition} variant="contained" color="secondary">
            {showTerm ? 'Show Definition' : 'Show Term'}
          </Button>

          <Button onClick={handleNext} variant="contained" color="primary" className="nav-button">
            Next
          </Button>
        </div>
      </div>
    </>
  );
};

export default FlashcardReview;
