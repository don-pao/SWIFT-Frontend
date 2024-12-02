import React, { useState, useEffect } from 'react';
import ResponsiveAppBar from '../../component/Appbar';
import AvatarTheme from '../../component/Theme';
import { useLocation, useNavigate } from 'react-router-dom';
import './Answer.css';
import { Button } from '@mui/material';
import axios from 'axios';

const AnswerForm = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { quiz, flashcardSetId } = location.state;
  const [selectedAnswers, setSelectedAnswers] = useState([]);
  const [totalScore, setTotalScore] = useState(0);
  const [isSubmitted, setIsSubmitted] = useState(false);

  useEffect(() => {
    if (quiz) {
      setSelectedAnswers(new Array(quiz.questions.length).fill(null));
    }
  }, [quiz]);

  const handleAnswerChange = (questionIndex, optionIndex) => {
    const newAnswers = [...selectedAnswers];
    newAnswers[questionIndex] = optionIndex;
    setSelectedAnswers(newAnswers);
  };

  const handleSubmitAnswers = async () => {
    let score = 0;

    quiz.questions.forEach((question, index) => {
      if (selectedAnswers[index] === question.correctAnswerIndex) {
        score += question.score;
      }
    });

    setTotalScore(score);
    setIsSubmitted(true);

    try {
      await axios.post('http://localhost:8080/api/quiz/update-user-score', {
        quizId: quiz.quizId,
        userScore: score,
      });
    } catch (error) {
      console.error('Error updating user score:', error);
    }
  };

  if (!quiz) {
    return <div>No quiz data available</div>;
  }

  return (
    <>
      <ResponsiveAppBar />
      <AvatarTheme />
      <div className="answer-form-container">
      <Button
        className="back-button"
        onClick={() => navigate(`/quiz-form/${flashcardSetId}`)}
        variant="outlined"
        style={{
          color: '#73489c', // Text color
          borderColor: '#73489c', // Outline color
        }}
      >
        Back to Quizzes
      </Button>

        <h1 className="quiz-header">Answer Quiz: {quiz.title}</h1>
        <div className="quiz-questions">
          {quiz.questions.map((question, questionIndex) => (
            <div key={questionIndex} className="quiz-question">
              <p className="question-text">
                {questionIndex + 1}. {question.text}
              </p>
              <div className="question-options">
                {question.options.map((option, optionIndex) => {
                  const isCorrectAnswer = question.correctAnswerIndex === optionIndex;
                  const isSelectedAnswer =
                    selectedAnswers[questionIndex] === optionIndex;

                  const optionClass = isSubmitted
                    ? isCorrectAnswer
                      ? 'correct-option'
                      : isSelectedAnswer
                      ? 'incorrect-option'
                      : ''
                    : '';

                  return (
                    <label
                      key={optionIndex}
                      className={`option-label ${optionClass}`}
                    >
                      <input
                        type="radio"
                        name={`question-${questionIndex}`}
                        value={optionIndex}
                        checked={isSelectedAnswer}
                        onChange={() =>
                          handleAnswerChange(questionIndex, optionIndex)
                        }
                        disabled={isSubmitted}
                      />
                      {option}
                    </label>
                  );
                })}
              </div>
            </div>
          ))}
        </div>
        {!isSubmitted ? (
          <Button
            className="submit-button"
            onClick={handleSubmitAnswers}
            variant="contained"
            sx={{
              backgroundColor: '#73489c',
              color: '#ffffff',
              '&:hover': {
                backgroundColor: '#5d387a', // Slightly darker shade for hover effect
              },
            }}
          >
            Submit Answers
          </Button>
        ) : (
          <div className="result-message">
            <strong>Total Score: {totalScore}</strong>
          </div>
        )}
      </div>
    </>
  );
};

export default AnswerForm;
