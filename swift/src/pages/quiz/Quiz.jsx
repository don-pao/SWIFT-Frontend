import React, { useState, useEffect } from 'react';
import axios from 'axios';
import ResponsiveAppBar from '../../component/Appbar';
import AvatarTheme from '../../component/Theme';
import { Modal, Box, Typography, Button } from '@mui/material';
import './Quiz.css'; // Import the CSS

const QuizForm = () => {
  const [title, setTitle] = useState('');
  const [questions, setQuestions] = useState([
    { text: '', options: ['', '', '', ''], correctAnswerIndex: 0, score: 0 } // Use 'score' instead of 'questionScore'
  ]);
  const [flashcardSetId, setFlashcardSetId] = useState(null);  // For storing the selected flashcard set ID
  const [flashcardSets, setFlashcardSets] = useState([]);  // For storing the list of available flashcard sets
  const [quizzes, setQuizzes] = useState([]);
  const [currentQuizId, setCurrentQuizId] = useState(null);
  const [openEditModal, setOpenEditModal] = React.useState(false);
  const [openDeleteModal, setOpenDeleteModal] = React.useState(false);
  const [selectedQuiz, setSelectedQuiz] = React.useState(null); // Holds the quiz being edited or deleted
  
  const handleOpenEditModal = (quiz) => {
    setSelectedQuiz(quiz);
    setOpenEditModal(true);
  };
  
  const handleCancelEditModal = () => setOpenEditModal(false);
  const handleCancelDeleteModal = () => setOpenDeleteModal(false);

  const handleOpenDeleteModal = (quizId) => {
    setSelectedQuiz(quizId);
    setOpenDeleteModal(true);
  };
  
  const handleConfirmEdit = () => {
    if (selectedQuiz) {
      handleEditQuiz(selectedQuiz);
      setOpenEditModal(false);
    }
  };
  
  const handleConfirmDelete = () => {
    if (selectedQuiz) {
      handleDeleteQuiz(selectedQuiz);
      setOpenDeleteModal(false);
    }
  };

  const fetchQuizzes = async () => {
    try {
      const response = await axios.get('http://localhost:8080/api/quiz/getAllQuizzes');
      setQuizzes(response.data);
    } catch (error) {
      console.error('Error fetching quizzes:', error);
    }
  };

  const fetchFlashcardSets = async () => {
    try {
      const response = await axios.get('http://localhost:8080/api/flashcardset/getAllFlashcardSet');
      console.log('Flashcard Sets:', response.data);
      setFlashcardSets(response.data);
    } catch (error) {
      console.error('Error fetching flashcard sets:', error);
    }
  };

  useEffect(() => {
    fetchFlashcardSets();  // Fetch flashcard sets when the component mounts
    fetchQuizzes();
  }, []);

  const handleAddQuestion = () => {
    setQuestions([...questions, { text: '', options: ['', '', '', ''], correctAnswerIndex: 0, score: 0 }]);
  };

  const handleQuestionChange = (index, value) => {
    const newQuestions = [...questions];
    newQuestions[index].text = value;
    setQuestions(newQuestions);
  };

  const handleOptionChange = (questionIndex, optionIndex, value) => {
    const newQuestions = [...questions];
    newQuestions[questionIndex].options[optionIndex] = value;
    setQuestions(newQuestions);
  };

  const handleCorrectAnswerChange = (index, value) => {
    const newQuestions = [...questions];
    newQuestions[index].correctAnswerIndex = Number(value);
    setQuestions(newQuestions);
  };

  const handleQuestionScoreChange = (index, value) => {
    const newQuestions = [...questions];
    newQuestions[index].score = Number(value);  // Use 'score' instead of 'questionScore'
    setQuestions(newQuestions);
  };

  const handleCreateOrUpdateQuiz = async (e) => {
    e.preventDefault();
    const newQuiz = {
      title,
      flashcardSet: { setId: flashcardSetId },  // Include the selected flashcard set
      questions
    };

    if (!title || questions.length === 0 || questions.some(q => q.score < 0) || !flashcardSetId) {
      console.error('All fields are required and scores must be non-negative');
      return;
    }

    try {
      if (currentQuizId) {
        await axios.put(`http://localhost:8080/api/quiz/putQuizDetails/${currentQuizId}`, newQuiz);
      } else {
        await axios.post('http://localhost:8080/api/quiz/postquizrecord', newQuiz);
      }
      fetchQuizzes();
      resetForm();
    } catch (error) {
      console.error('Error submitting quiz:', error);
    }
  };

  const resetForm = () => {
    setTitle('');
    setQuestions([{ text: '', options: ['', '', '', ''], correctAnswerIndex: 0, score: 0 }]);
    setFlashcardSetId('');
    setCurrentQuizId(null);
  };

  const handleEditQuiz = (quiz) => {
    setTitle(quiz.title);
    setQuestions(quiz.questions);
    setFlashcardSetId(quiz.flashcardSetId);
    setCurrentQuizId(quiz.quizId);
  };

  const handleDeleteQuiz = async (quizId) => {
    try {
      await axios.delete(`http://localhost:8080/api/quiz/deleteQuizDetails/${quizId}`);
      fetchQuizzes();
    } catch (error) {
      console.error('Error deleting quiz:', error);
    }
  };

  return (
    <>
      <ResponsiveAppBar />
      <AvatarTheme />
      <div style={styles.container}>
        <div className="quiz-header">{currentQuizId ? 'Edit Quiz' : 'Create a Quiz'}</div>
        <form onSubmit={handleCreateOrUpdateQuiz} className="quiz-form">
          <div className="quiz-input-container">
            <label>Title:</label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Enter quiz title"
              required
            />
          </div>
          <div className="quiz-input-container">
            <label>Questions:</label>
            {questions.map((question, index) => (
              <div key={index} className="quiz-input-container">
                <input
                  type="text"
                  value={question.text}
                  onChange={(e) => handleQuestionChange(index, e.target.value)}
                  placeholder={`Question ${index + 1}`}
                  required
                />
                <div>
                  <label>Answers:</label>
                  {question.options.map((option, optionIndex) => (
                    <div key={optionIndex} className="quiz-input-container">
                      <input
                        type="text"
                        value={option}
                        onChange={(e) => handleOptionChange(index, optionIndex, e.target.value)}
                        placeholder={`Answer ${optionIndex + 1}`}
                        required
                      />
                    </div>
                  ))}
                </div>
                <label>Correct Answer:</label>
                <select
                  value={question.correctAnswerIndex}
                  onChange={(e) => handleCorrectAnswerChange(index, e.target.value)}
                >
                  {question.options.map((_, optionIndex) => (
                    <option key={optionIndex} value={optionIndex}>
                      Option {optionIndex + 1}
                    </option>
                  ))}
                </select>
                <div className="quiz-input-container">
                  <label>Score:</label>
                  <input
                    type="number"
                    value={question.score}
                    onChange={(e) => handleQuestionScoreChange(index, e.target.value)}
                    placeholder="Enter score"
                    min="0"
                    required
                  />
                </div>
              </div>
            ))}
          </div>
          <button type="button" className="submit-button" onClick={handleAddQuestion}>
            Add Question
          </button>
          <div className="quiz-input-container">
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
            {currentQuizId ? 'Update Quiz' : 'Create Quiz'}
          </button>
          {currentQuizId && (
            <button type="button" className="cancel-button" onClick={resetForm}>
              Cancel
            </button>
          )}
        </form>

        <div className="quiz-header" style={{ marginTop: '20px' }}>Quizzes</div>
        <div className="quiz-list">
        {quizzes.map((quiz) => (
          <div key={quiz.quizId} className="quiz-item">
            <div className="title">
              <strong>Title:</strong> {quiz.title}
            </div>
            <div className="flashcard-set">
              <strong>Flashcard Set:</strong> {quiz.flashcardSetTitle}
            </div>
            <div className="total-score">
              <strong>Total Score:</strong> {quiz.totalScore}
            </div>
            <div className="quiz-actions">
              <button onClick={() => handleOpenEditModal(quiz)}>Edit</button>
              <button onClick={() => handleOpenDeleteModal(quiz.quizId)}>Delete</button>
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
            <Typography sx={{ mt: 2 }}>Are you sure you want to edit this quiz?</Typography>
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
            <Typography sx={{ mt: 2 }}>Are you sure you want to delete this quiz?</Typography>
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
    color: '#333',
  },
};

export default QuizForm;
