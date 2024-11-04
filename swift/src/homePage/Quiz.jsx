import React, { useState, useEffect } from 'react';
import axios from 'axios';

const QuizForm = () => {
  const [title, setTitle] = useState('');
  const [questions, setQuestions] = useState(['']);
  const [score, setScore] = useState(0);
  const [quizzes, setQuizzes] = useState([]);
  const [currentQuizId, setCurrentQuizId] = useState(null);

  const fetchQuizzes = async () => {
    try {
      const response = await axios.get('http://localhost:8080/api/quiz/getAllQuizzes');
      setQuizzes(response.data);
    } catch (error) {
      console.error('Error fetching quizzes:', error);
    }
  };

  useEffect(() => {
    fetchQuizzes();
  }, []);

  const handleAddQuestion = () => {
    setQuestions([...questions, '']);
  };

  const handleQuestionChange = (index, value) => {
    const newQuestions = [...questions];
    newQuestions[index] = value;
    setQuestions(newQuestions);
  };

  const handleCreateOrUpdateQuiz = async (e) => {
    e.preventDefault();
    const questionsString = questions.join(', ');
    const newQuiz = { title, questions: questionsString, score };

    if (!title || questions.length === 0 || score < 0) {
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
    setQuestions(['']);
    setScore(0);
    setCurrentQuizId(null);
  };

  const handleEditQuiz = (quiz) => {
    setTitle(quiz.title);
    setQuestions(quiz.questions.split(', '));
    setScore(quiz.score);
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

  // Inline styles
  const styles = {
    container: {
      backgroundColor: '#f8f8f8',
      borderRadius: '8px',
      padding: '20px',
      marginBottom: '20px',
      boxShadow: '0px 4px 8px rgba(0, 0, 0, 0.1)',
    },
    title: {
      fontSize: '1.5em',
      fontWeight: 'bold',
      color: '#333',
      marginBottom: '10px',
    },
    formGroup: {
      marginBottom: '15px',
    },
    label: {
      display: 'block',
      fontWeight: 'bold',
      color: '#333',
    },
    input: {
      width: '100%',
      padding: '8px',
      marginTop: '5px',
      border: '1px solid #ddd',
      borderRadius: '4px',
      fontSize: '1em',
    },
    addButton: {
      backgroundColor: '#4CAF50',
      color: 'white',
      padding: '10px 20px',
      border: 'none',
      borderRadius: '4px',
      fontSize: '1em',
      cursor: 'pointer',
      marginTop: '10px',
    },
    addButtonHover: {
      backgroundColor: '#45a049',
    },
    quizList: {
      marginTop: '20px',
    },
    quizListItem: {
      backgroundColor: '#f1f1f1',
      padding: '10px',
      marginBottom: '10px',
      borderRadius: '4px',
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center',
    },
    deleteButton: {
      marginLeft: '10px',
      backgroundColor: '#d9534f',
      color: 'white',
      border: 'none',
      padding: '5px 10px',
      borderRadius: '4px',
      cursor: 'pointer',
    },
    deleteButtonHover: {
      backgroundColor: '#c9302c',
    },
  };

  return (
    <div>
      <div style={styles.container}>
        <h2 style={styles.title}>{currentQuizId ? 'Update Quiz' : 'Create a Quiz'}</h2>
        <form onSubmit={handleCreateOrUpdateQuiz}>
          <div style={styles.formGroup}>
            <label style={styles.label}>Title:</label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              required
              style={styles.input}
            />
          </div>
          <div style={styles.formGroup}>
            <label style={styles.label}>Questions:</label>
            {questions.map((question, index) => (
              <div key={index} style={styles.formGroup}>
                <input
                  type="text"
                  value={question}
                  onChange={(e) => handleQuestionChange(index, e.target.value)}
                  required
                  style={styles.input}
                />
              </div>
            ))}
            <button
              type="button"
              style={styles.addButton}
              onClick={handleAddQuestion}
            >
              Add Question
            </button>
          </div>
          <div style={styles.formGroup}>
            <label style={styles.label}>Score:</label>
            <input
              type="number"
              value={score}
              onChange={(e) => setScore(Number(e.target.value))}
              required
              style={styles.input}
            />
          </div>
          <button type="submit" style={styles.addButton}>
            {currentQuizId ? 'Submit Edit' : 'Submit Quiz'}
          </button>
        </form>
      </div>

      <div style={styles.quizList}>
        <h2>Quizzes</h2>
        <ul>
          {quizzes.map((quiz) => (
            <li key={quiz.quizId} style={styles.quizListItem}>
              <strong>{quiz.title}</strong>: {quiz.questions || 'No questions available'} (Score: {quiz.score})
              <button
                style={styles.deleteButton}
                onClick={() => handleEditQuiz(quiz)}
              >
                Edit
              </button>
              <button
                style={styles.deleteButton}
                onClick={() => handleDeleteQuiz(quiz.quizId)}
              >
                Delete
              </button>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default QuizForm;
