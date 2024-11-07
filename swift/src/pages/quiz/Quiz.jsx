import React, { useState, useEffect } from 'react';
import axios from 'axios';
import ResponsiveAppBar from '../../component/Appbar';
import AvatarTheme from '../../component/Theme';

const QuizForm = () => {
  const [title, setTitle] = useState('');
  const [questions, setQuestions] = useState([
    { text: '', options: ['', '', '', ''], correctAnswerIndex: 0 }
  ]);
  const [score, setScore] = useState(0);
  const [quizzes, setQuizzes] = useState([]);
  const [currentQuizId, setCurrentQuizId] = useState(null);
  const [flashcardSetId, setFlashcardSetId] = useState(null);  // For storing the selected flashcard set ID
  const [flashcardSets, setFlashcardSets] = useState([]);  // For storing the list of available flashcard sets

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
    setQuestions([...questions, { text: '', options: ['', '', '', ''], correctAnswerIndex: 0 }]);
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

  const handleCreateOrUpdateQuiz = async (e) => {
    e.preventDefault();
    const newQuiz = {
      title,
      questions,
      score,
      flashcardSet: { setId: flashcardSetId },  // Include the selected flashcard set
    };

    if (!title || questions.length === 0 || score < 0 || !flashcardSetId) {
      console.error('All fields are required and score must be non-negative');
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
    setQuestions([{ text: '', options: ['', '', '', ''], correctAnswerIndex: 0 }]);
    setScore(0);
    setFlashcardSetId('');
    setCurrentQuizId(null);
  };

  const handleEditQuiz = (quiz) => {
    const confirmEdit = window.confirm("Are you sure you want to edit this quiz?");
    if (confirmEdit) {
      setTitle(quiz.title);
      setQuestions(quiz.questions);
      setScore(quiz.score);
      setFlashcardSetId(quiz.flashcardSetId);
      setCurrentQuizId(quiz.quizId);
    }
  };

  const handleDeleteQuiz = async (quizId) => {
    const confirmDelete = window.confirm("Are you sure you want to delete this quiz?");
    if (confirmDelete) {
      try {
        await axios.delete(`http://localhost:8080/api/quiz/deleteQuizDetails/${quizId}`);
        fetchQuizzes();
      } catch (error) {
        console.error('Error deleting quiz:', error);
      }
    }
  };

  return (
    <>
      <ResponsiveAppBar />
      <AvatarTheme />
      <div style={{ padding: '20px' }}>
        <style>
          {`
            .quiz-header {
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

            .quiz-form {
              background-color: #f9f9f9;
              padding: 20px;
              border-radius: 10px;
              box-shadow: 0px 4px 8px rgba(0, 0, 0, 0.1);
            }

            .quiz-input-container {
              display: flex;
              flex-direction: column;
              margin-bottom: 15px;
            }

            .quiz-input-container label {
              font-size: 0.9rem;
              color: #333;
              margin-bottom: 5px;
            }

            .quiz-input-container input, .quiz-input-container select {
              padding: 10px;
              border: 1px solid #ccc;
              border-radius: 5px;
              font-size: 0.9rem;
            }

            .submit-button, .cancel-button {
              background-color: #4caf50;
              color: #fff;
              padding: 10px;
              border: none;
              border-radius: 5px;
              cursor: pointer;
              font-size: 1rem;
              margin-right: 10px;
            }

            .cancel-button {
              background-color: #f44336; /* Red color for cancel button */
            }

            .quiz-list {
              margin-top: 20px;
            }

            .quiz-item {
              background-color: #fff;
              padding: 15px;
              margin-bottom: 10px;
              border-radius: 8px;
              box-shadow: 0px 2px 4px rgba(0, 0, 0, 0.1);
              display: flex;
              justify-content: space-between;
              align-items: center;
            }

            .quiz-actions {
              display: flex;
              gap: 10px;
            }

            .quiz-actions button {
              background: none;
              border: none;
              color: #4caf50;
              font-size: 0.9rem;
              cursor: pointer;
            }

            .quiz-actions button:hover {
              text-decoration: underline;
            }

            .title, .questions {
              flex: 1;
              font-size: 0.9rem;
              color: #333;
            }

            .title strong, .questions strong {
              display: block;
              font-weight: bold;
              color: #666;
            }
          `}
        </style>

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
              </div>
            ))}
          </div>
          <button type="button" className="submit-button" onClick={handleAddQuestion}>
            Add Question
          </button>
          <div className="quiz-input-container">
            <label>Score:</label>
            <input
              type="number"
              value={score}
              onChange={(e) => setScore(Number(e.target.value))}
              placeholder="Enter score"
              min="0"
              required
            />
          </div>
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
          <button type="button" className="cancel-button" onClick={resetForm}>
            Cancel
          </button>
        </form>

        <div className="quiz-list">
          <h3>Existing Quizzes</h3>
          {quizzes.map((quiz) => (
            <div key={quiz.quizId} className="quiz-item">
              <div className="title">{quiz.title}</div>
              <div className="quiz-actions">
                <button onClick={() => handleEditQuiz(quiz)}>Edit</button>
                <button onClick={() => handleDeleteQuiz(quiz.quizId)}>Delete</button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </>
  );
};

export default QuizForm;
